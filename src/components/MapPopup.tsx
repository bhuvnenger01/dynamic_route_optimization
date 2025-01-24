import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Button } from "@/components/ui/button";

interface MapPopupProps {
  onSelect: (lat: number, lng: number) => void;
  onClose: () => void;
}

const MapPopup: React.FC<MapPopupProps> = ({ onSelect, onClose }) => {
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setSelectedPosition({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-lg mx-4">
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '400px' }}
            center={{ lat: 0, lng: 0 }}
            zoom={2}
            onClick={handleMapClick}
          >
            {selectedPosition && <Marker position={selectedPosition} />}
          </GoogleMap>
        </LoadScript>
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={() => selectedPosition && onSelect(selectedPosition.lat, selectedPosition.lng)}>
            Select
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapPopup;
