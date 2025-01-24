import React, { useState } from 'react';
import { VehicleDetails } from '@/types/vehicle';
import RouteMap from './RouteMap';
import RouteInformationCard from './route/RouteInformationCard';
import EmissionsChart from './route/EmissionsChart';
import WeatherCard from './route/WeatherCard';
import { Button } from "@/components/ui/button";
import { Navigation2 } from "lucide-react";

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
  selectedRouteIndex,
  onRouteSelect
}) => {
  const [isNavigating, setIsNavigating] = useState(false);

  if (!routeData || !routeData.routes || routeData.routes.length === 0) {
    return <div>Loading route details...</div>;
  }

  const validIndex = Math.min(selectedRouteIndex, routeData.routes.length - 1);
  const selectedRoute = routeData.routes[validIndex];

  if (!selectedRoute) {
    return <div>No route data available</div>;
  }

  const weatherData = selectedRoute.weather_markers?.[0];

  const startNavigation = () => {
    setIsNavigating(true);
  };

  const stopNavigation = () => {
    setIsNavigating(false);
  };

  return (
    <div className="space-y-6">
      {/* Route Selection Buttons */}
      <div className="flex gap-2 justify-center mb-6">
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

      <div className="space-y-6">
        {/* Map Section */}
        <div className="w-full">
          <RouteMap 
            coordinates={selectedRoute.coordinates}
            origin={routeData.origin}
            destination={routeData.destination}
            alternativeRoutes={routeData.routes.map(route => route.coordinates)}
            isNavigating={isNavigating}
            selectedRouteIndex={validIndex}
            onRouteSelect={onRouteSelect}
          />
          <div className="mt-4 flex justify-center">
            <Button
              onClick={isNavigating ? stopNavigation : startNavigation}
              className="flex items-center gap-2"
            >
              <Navigation2 className="h-4 w-4" />
              {isNavigating ? 'Stop Navigation' : 'Start Navigation'}
            </Button>
          </div>
        </div>

        {/* Information Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>

        {/* Weather Card Section */}
        {weatherData && selectedRoute.air_quality && (
          <div className="w-full">
            <WeatherCard
              weather={weatherData}
              airQuality={selectedRoute.air_quality}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteDetails;