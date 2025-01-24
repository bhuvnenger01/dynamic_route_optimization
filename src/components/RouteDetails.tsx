import React from 'react';
import { VehicleDetails } from '@/types/vehicle';
import RouteMap from './RouteMap';
import RouteInformationCard from './route/RouteInformationCard';
import EmissionsChart from './route/EmissionsChart';
import WeatherCard from './route/WeatherCard';

interface RouteDetailsProps {
  routeData: {
    origin: string;
    destination: string;
    distance: string;
    time: string;
    emissions: {
      emissions: number;
      unit: string;
      potential_savings: {
        electric: number;
        hybrid: number;
      };
      recommendations: string[];
    } | string;
    coordinates: Array<[number, number]>;
    air_quality?: {
      aqi: string | number;
      dominant_pollutant: string;
    };
    weather_markers?: Array<{
      temperature: number;
      condition: string;
      wind_speed: number;
      humidity: number;
    }>;
  };
  vehicleDetails: VehicleDetails;
  isNavigating: boolean;
  selectedRouteIndex: number;
  onRouteSelect: (index: number) => void;
}

const RouteDetails: React.FC<RouteDetailsProps> = ({ 
  routeData, 
  vehicleDetails,
  isNavigating,
  selectedRouteIndex,
  onRouteSelect
}) => {
  if (!routeData) {
    return <div>Loading route details...</div>;
  }

  const weatherData = routeData.weather_markers?.[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <RouteInformationCard
          distance={routeData.distance}
          time={routeData.time}
          emissions={routeData.emissions}
        />

        {typeof routeData.emissions !== 'string' && routeData.emissions && (
          <EmissionsChart emissions={routeData.emissions} />
        )}

        {weatherData && (
          <WeatherCard
            weather={weatherData}
            airQuality={routeData.air_quality}
          />
        )}
      </div>

      <div className="space-y-6">
        <RouteMap 
          coordinates={routeData.coordinates}
          origin={routeData.origin}
          destination={routeData.destination}
          isNavigating={isNavigating}
          selectedRouteIndex={selectedRouteIndex}
          onRouteSelect={onRouteSelect}
        />
      </div>
    </div>
  );
};

export default RouteDetails;