import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WeatherCardProps {
  weather: {
    temperature: number;
    condition: string;
    wind_speed: number;
    humidity: number;
  };
  airQuality?: {
    aqi: string | number;
    dominant_pollutant: string;
  };
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, airQuality }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather & Air Quality</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Temperature</p>
            <p className="font-medium">{weather.temperature}°C</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Condition</p>
            <p className="font-medium">{weather.condition}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Wind Speed</p>
            <p className="font-medium">{weather.wind_speed} m/s</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Humidity</p>
            <p className="font-medium">{weather.humidity}%</p>
          </div>
        </div>
        
        {airQuality && (
          <div>
            <p className="text-sm text-gray-600">Air Quality Index</p>
            <div className="flex items-center gap-2">
              <Badge variant={
                Number(airQuality.aqi) <= 50 ? "secondary" :
                Number(airQuality.aqi) <= 100 ? "outline" : "destructive"
              }>
                AQI: {airQuality.aqi}
              </Badge>
              <span className="text-sm">
                ({airQuality.dominant_pollutant})
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;