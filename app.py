import logging
from flask import Flask, request, render_template, jsonify
import folium
import os
import plotly.graph_objects as go
import requests  
from emissions_calc import calculate_emissions  # Import the new function
from route_optimizer import fetch_route_data, decode_polyline, get_route_details  # Import the new functions

app = Flask(__name__)

# Ensure the static directory exists
if not os.path.exists('static'):
    os.makedirs('static')

API_KEY = os.environ.get('google_map_api')
WEATHER_API_KEY = os.environ.get('openweather_api')
AQICN_API_KEY = os.environ.get('aqicn_api')

# Configure logging
logging.basicConfig(level=logging.INFO)

if not WEATHER_API_KEY:
    logging.error("OpenWeather API key is missing. Please set the 'openweather_api' environment variable.")
    raise ValueError("OpenWeather API key is missing. Please set the 'openweather_api' environment variable.")

if not AQICN_API_KEY:
    logging.error("AQICN API key is missing. Please set the 'aqicn_api' environment variable.")
    raise ValueError("AQICN API key is missing. Please set the 'aqicn_api' environment variable.")

def get_weather(lat, lon):
    try:
        weather_url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}&units=metric"
        response = requests.get(weather_url)
        response.raise_for_status()
        data = response.json()
        if data.get('cod') != 200:
            return {"error": "Unable to fetch weather data"}
        return {
            "temperature": data["main"]["temp"],
            "condition": data["weather"][0]["description"],
            "icon": data["weather"][0]["icon"],
            "wind_speed": data["wind"]["speed"],
            "humidity": data["main"]["humidity"]
        }
    except requests.RequestException as e:
        logging.error(f"Weather API request failed: {e}")
        return {"error": "Unable to fetch weather data"}

def get_air_quality(location):
    try:
        aqi_url = f"https://api.waqi.info/feed/{location}/?token={AQICN_API_KEY}"
        response = requests.get(aqi_url)
        response.raise_for_status()
        data = response.json()
        if data.get('status') != 'ok':
            return {"error": "Unable to fetch air quality data"}
        return {
            "aqi": data["data"]["aqi"],
            "dominant_pollutant": data["data"]["dominentpol"]
        }
    except requests.RequestException as e:
        logging.error(f"AQICN API request failed: {e}")
        return {"error": "Unable to fetch air quality data"}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/calculate-route', methods=['POST'])
def calculate_route():
    try:
        origin = request.form.get('origin', '').strip()
        destination = request.form.get('destination', '').strip()
        vehicle_type = request.form.get('vehicle_type', '').strip()

        logging.info(f"Received form data - Origin: {origin}, Destination: {destination}, Vehicle Type: {vehicle_type}")

        if not origin or not destination:
            logging.error("Origin and destination must not be empty")
            return jsonify({"error": "Origin and destination must not be empty"}), 400

        route_data = fetch_route_data(origin, destination)
        route_details = get_route_details(route_data)

        distance_text = route_details['distance_text']
        duration = route_details['duration']
        polyline_points = route_details['polyline_points']

        # Decode polyline into lat, lng points
        coordinates = decode_polyline(polyline_points)

        # Generate weather markers along the route
        weather_markers = []
        for coord in coordinates[::10]:  # Sample every 10th coordinate for weather data
            weather = get_weather(coord[0], coord[1])
            if "error" not in weather:
                weather_markers.append({
                    "lat": coord[0],
                    "lon": coord[1],
                    "temperature": weather["temperature"],
                    "condition": weather["condition"],
                    "icon_url": f"http://openweathermap.org/img/wn/{weather['icon']}@2x.png",
                    "wind_speed": weather["wind_speed"],
                    "humidity": weather["humidity"]
                })

        # Convert distance to float (assume input is like "10 km")
        distance = float(distance_text.split()[0])

        # Calculate emissions using the new function
        emissions = calculate_emissions(distance, vehicle_type)

        # Fetch air quality data
        air_quality = get_air_quality(destination)

        route_data = {
            "origin": origin,
            "destination": destination,
            "distance": distance_text,
            "time": duration,
            "emissions": f"{emissions} kg CO₂",
            "air_quality": air_quality,
            "coordinates": coordinates,
            "weather_markers": weather_markers
        }

        # Add bar chart generation
        emission_comparison = go.Figure(
            data=[
                go.Bar(name="Car", x=["Vehicle"], y=[distance * 0.21]),
                go.Bar(name="Bike", x=["Vehicle"], y=[distance * 0.08]),
                go.Bar(name="Truck", x=["Vehicle"], y=[distance * 0.5])
            ]
        )
        emission_comparison.update_layout(title="Emissions by Vehicle Type (kg CO₂)", barmode="group")
        chart_path = "static/emissions_chart.html"
        emission_comparison.write_html(chart_path)
        
        route_data["chart_path"] = chart_path

        return render_template('result.html', route=route_data)
    except requests.RequestException as e:
        logging.error(f"Google Maps API request failed: {e}")
        return jsonify({"error": "Unable to fetch route data"}), 500
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/fetch-optimized-route', methods=['GET'])
def fetch_optimized_route():
    try:
        lat = request.args.get('lat')
        lon = request.args.get('lon')
        destination = request.args.get('destination')
        origin = request.args.get('origin')

        if not origin:
            origin = f"{lat},{lon}"

        if not origin or not destination:
            return jsonify({"error": "Origin and destination must not be empty"}), 400

        route_data = fetch_route_data(origin, destination)
        route_details = get_route_details(route_data)

        polyline_points = route_details['polyline_points']
        coordinates = decode_polyline(polyline_points)

        return jsonify({"coordinates": coordinates})
    except requests.RequestException as e:
        logging.error(f"Google Maps API request failed: {e}")
        return jsonify({"error": "Unable to fetch optimized route"}), 500
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)