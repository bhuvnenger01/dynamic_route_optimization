import requests
import os
import logging

AQICN_API_KEY = os.environ.get('aqicn_api')

def get_air_quality(location):
    try:
        aqi_url = f"https://api.waqi.info/feed/{location}/?token={AQICN_API_KEY}"
        response = requests.get(aqi_url)
        response.raise_for_status()
        data = response.json()
        if data.get('status') != 'ok':
            return {"aqi": "N/A", "dominant_pollutant": "N/A"}
        return {
            "aqi": data["data"]["aqi"],
            "dominant_pollutant": data["data"]["dominentpol"]
        }
    except requests.RequestException as e:
        logging.error(f"AQICN API request failed: {e}")
        return {"aqi": "N/A", "dominant_pollutant": "N/A"}