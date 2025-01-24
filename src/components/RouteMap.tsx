import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Polyline, Marker } from '@react-google-maps/api';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface RouteMapProps {
  coordinates?: Array<[number, number]>;
  origin?: string;
  destination?: string;
  alternativeRoutes?: Array<Array<[number, number]>>;
  onRouteSelect?: (routeIndex: number) => void;
  isNavigating?: boolean;
  selectedRouteIndex: number;
}

const RouteMap: React.FC<RouteMapProps> = ({
  coordinates,
  origin,
  destination,
  alternativeRoutes = [],
  onRouteSelect,
  isNavigating = false,
  selectedRouteIndex = 0
}) => {
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    if (isNavigating) {
      if ("geolocation" in navigator) {
        watchId.current = navigator.geolocation.watchPosition(
          (position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.error("Error tracking location:", error);
            toast({
              title: "Location Error",
              description: "Could not track your current location",
              variant: "destructive",
            });
          }
        );
      }

      return () => {
        if (watchId.current !== null) {
          navigator.geolocation.clearWatch(watchId.current);
        }
      };
    }
  }, [isNavigating]);

  const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem'
  };

  const allRoutes = [coordinates, ...alternativeRoutes].filter(Boolean);
  const path = allRoutes[selectedRouteIndex]?.map(coord => ({
    lat: coord[0],
    lng: coord[1]
  })) || [];

  const center = path[0] || { lat: 0, lng: 0 };

  const polylineOptions = {
    strokeColor: '#3b82f6',
    strokeOpacity: 1,
    strokeWeight: 4,
  };

  const alternativePolylineOptions = {
    strokeColor: '#9ca3af',
    strokeOpacity: 0.7,
    strokeWeight: 3,
  };

  if (!coordinates?.length) {
    return (
      <div className="h-[400px] w-full rounded-lg bg-gray-100 flex items-center justify-center">
        No route data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <LoadScript googleMapsApiKey="AIzaSyAZgjoy0S8UH4e4Jlv7PhvJ-2ZB9mGrthY">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentLocation || center}
          zoom={12}
          options={{
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          }}
        >
          {allRoutes.map((routeCoords, index) => {
            if (!routeCoords) return null;
            const routePath = routeCoords.map(coord => ({
              lat: coord[0],
              lng: coord[1]
            }));
            return (
              <Polyline
                key={index}
                path={routePath}
                options={index === selectedRouteIndex ? polylineOptions : alternativePolylineOptions}
                onClick={() => {
                  onRouteSelect?.(index);
                }}
              />
            );
          })}

          {path.length > 0 && (
            <>
              <Marker
                position={path[0]}
                label={{
                  text: "Start",
                  className: "text-sm",
                  color: "#22c55e"
                }}
              />
              <Marker
                position={path[path.length - 1]}
                label={{
                  text: "End",
                  className: "text-sm",
                  color: "#ef4444"
                }}
              />
            </>
          )}

          {currentLocation && (
            <Marker
              position={currentLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#4f46e5",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>

      {alternativeRoutes.length > 0 && (
        <div className="flex gap-2">
          {allRoutes.map((_, index) => (
            <Button
              key={index}
              variant={index === selectedRouteIndex ? "default" : "outline"}
              onClick={() => {
                onRouteSelect?.(index);
              }}
            >
              Route {index + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RouteMap;