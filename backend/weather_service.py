import requests
import os
import logging

WEATHER_API_KEY = os.environ.get('openweather_api')

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