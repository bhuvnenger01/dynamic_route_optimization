from flask import Flask, request, render_template, jsonify, send_from_directory
from flask_socketio import SocketIO, emit
import logging
import os
from dotenv import load_dotenv
from flask_cors import CORS
from route_service import process_route_request

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, allow_headers='*', origins='*')
socketio = SocketIO(app, cors_allowed_origins="*")

# Configure logging
logging.basicConfig(level=logging.INFO)

@app.route('/calculate-route', methods=['POST'])
def calculate_route():
    try:
        origin = request.form.get('origin', '').strip()
        destination = request.form.get('destination', '').strip()
        vehicle_type = request.form.get('vehicle_type', '')
        
        vehicle_details = {
            'type': vehicle_type,
            'fuelType': request.form.get('fuel_type', 'gasoline'),
            'efficiency': float(request.form.get('efficiency', 0)) or None,
            'year': int(request.form.get('year', 2020))
        }

        route_data = process_route_request(origin, destination, vehicle_details)
        return render_template('result.html', route=route_data)
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/route', methods=['POST'])
def api_route():
    try:
        data = request.json
        origin = data.get('origin', '').strip()
        destination = data.get('destination', '').strip()
        vehicle_details = data.get('vehicleDetails', {})
        
        route_data = process_route_request(origin, destination, vehicle_details)
        return jsonify(route_data)
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500

@socketio.on('calculate_route')
def handle_calculate_route(data):
    try:
        origin = data.get('origin', '').strip()
        destination = data.get('destination', '').strip()
        vehicle_details = data.get('vehicleDetails', {})
        
        route_data = process_route_request(origin, destination, vehicle_details)
        emit('response', route_data)
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        emit('response', {"error": str(e)})

if __name__ == '__main__':
    app.static_folder = 'frontend/build'
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)