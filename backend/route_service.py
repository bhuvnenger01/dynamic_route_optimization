from flask import jsonify
import logging
from emissions_calc import calculate_emissions
from weather_service import get_weather
from air_quality_service import get_air_quality
from route_optimizer import fetch_route_data, decode_polyline, get_route_details

def process_route_request(origin, destination, vehicle_details):
    try:
        if not origin or not destination:
            return jsonify({"error": "Origin and destination must not be empty"}), 400

        route_data = fetch_route_data(origin, destination)
        route_details = get_route_details(route_data)

        distance_text = route_details['distance_text']
        duration = route_details['duration']
        polyline_points = route_details['polyline_points']
        coordinates = decode_polyline(polyline_points)

        # Generate weather markers
        weather_markers = []
        for coord in coordinates[::10]:
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

        # Convert distance to float
        distance = float(distance_text.replace(',', '').split()[0])

        # Calculate emissions
        emissions = calculate_emissions(distance, vehicle_details)

        # Fetch air quality data
        air_quality = get_air_quality(destination)

        return {
            "origin": origin,
            "destination": destination,
            "distance": distance_text,
            "time": duration,
            "emissions": emissions,
            "air_quality": air_quality,
            "coordinates": coordinates,
            "weather_markers": weather_markers
        }
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")
        return {"error": str(e)}, 500