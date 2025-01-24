import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Polyline, Marker } from '@react-google-maps/api';
import { useToast } from '@/components/ui/use-toast';

interface RouteMapProps {
  coordinates?: Array<[number, number]>;
  origin?: string;
  destination?: string;
}

const RouteMap: React.FC<RouteMapProps> = ({ coordinates, origin, destination }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (coordinates) {
      setLoading(false);
    }
  }, [coordinates]);

  const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem'
  };

  // Convert coordinates to Google Maps LatLng format
  const path = coordinates?.map(coord => ({
    lat: coord[0],
    lng: coord[1]
  })) || [];

  const center = path[0] || { lat: 0, lng: 0 };

  const polylineOptions = {
    strokeColor: '#3b82f6',
    strokeOpacity: 1,
    strokeWeight: 4,
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="loader"></div>
    </div>;
  }

  if (!coordinates?.length) {
    return <div className="h-[400px] w-full rounded-lg bg-gray-100 flex items-center justify-center">
      No route data available
    </div>;
  }

  return (
    <div className="space-y-4">
      <LoadScript googleMapsApiKey="AIzaSyAZgjoy0S8UH4e4Jlv7PhvJ-2ZB9mGrthY">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          options={{
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          }}
        >
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
              <Polyline
                path={path}
                options={polylineOptions}
              />
            </>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default RouteMap;