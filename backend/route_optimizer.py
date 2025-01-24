import requests
import polyline
import os

API_KEY = os.environ.get('google_map_api')

def fetch_route_data(origin, destination):
    """
    Fetch route data from Google Maps API with alternatives.

    :param origin: Starting point of the route
    :param destination: Ending point of the route
    :return: Route data in JSON format
    """
    url = f"https://maps.googleapis.com/maps/api/directions/json?origin={origin}&destination={destination}&alternatives=true&key={API_KEY}"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

def decode_polyline(polyline_points):
    """
    Decode polyline into latitude and longitude points.

    :param polyline_points: Encoded polyline string
    :return: List of (latitude, longitude) tuples
    """
    return polyline.decode(polyline_points)

def get_route_details(route_data):
    """
    Extract route details from the route data.

    :param route_data: Route data in JSON format
    :return: Dictionary containing distance, duration, and polyline points for all routes
    """
    if not route_data.get('routes'):
        raise ValueError("No routes found for the given origin and destination")

    routes = []
    for route in route_data['routes']:
        distance_text = route['legs'][0]['distance']['text']
        duration = route['legs'][0]['duration']['text']
        polyline_points = route['overview_polyline']['points']
        
        routes.append({
            "distance_text": distance_text,
            "duration": duration,
            "polyline_points": polyline_points
        })

    return routes