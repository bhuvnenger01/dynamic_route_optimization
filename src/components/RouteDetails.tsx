import React from 'react';
import { VehicleDetails } from '@/types/vehicle';
import RouteMap from './RouteMap';
import RouteInformationCard from './route/RouteInformationCard';
import EmissionsChart from './route/EmissionsChart';
import WeatherCard from './route/WeatherCard';
import { Button } from "@/components/ui/button";

interface RouteDetailsProps {
  routeData: {
    origin: string;
    destination: string;
    routes: Array<{
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
      };
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
  if (!routeData || !routeData.routes || routeData.routes.length === 0) {
    return <div>Loading route details...</div>;
  }

  // Ensure selectedRouteIndex is within bounds
  const validIndex = Math.min(selectedRouteIndex, routeData.routes.length - 1);
  const selectedRoute = routeData.routes[validIndex];

  if (!selectedRoute) {
    return <div>No route data available</div>;
  }

  // Safely access weather data
  const weatherData = selectedRoute.weather_markers?.[0];

  return (
    <div className="space-y-6">
      {/* Route Selection Buttons */}
      <div className="flex gap-2 justify-center">
        {routeData.routes.map((_, index) => (
          <Button
            key={index}
            variant={index === validIndex ? "default" : "outline"}
            onClick={() => onRouteSelect(index)}
          >
            Route {index + 1}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {selectedRoute.distance && selectedRoute.time && (
            <RouteInformationCard
              distance={selectedRoute.distance}
              time={selectedRoute.time}
              emissions={selectedRoute.emissions}
            />
          )}

          {selectedRoute.emissions && (
            <EmissionsChart emissions={selectedRoute.emissions} />
          )}

          {weatherData && selectedRoute.air_quality && (
            <WeatherCard
              weather={weatherData}
              airQuality={selectedRoute.air_quality}
            />
          )}
        </div>

        <div className="space-y-6">
          <RouteMap 
            coordinates={selectedRoute.coordinates}
            origin={routeData.origin}
            destination={routeData.destination}
            alternativeRoutes={routeData.routes.map(route => route.coordinates)}
            isNavigating={isNavigating}
            selectedRouteIndex={validIndex}
            onRouteSelect={onRouteSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default RouteDetails;