import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Map as MapIcon } from "lucide-react";
import MapPopup from './MapPopup';
import { toast } from "@/components/ui/use-toast";

interface LocationSelectorProps {
  onLocationSelect: (location: string) => void;
  placeholder: string;
  label: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  onLocationSelect,
  placeholder,
  label
}) => {
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude},${longitude}`);
          onLocationSelect(`${latitude},${longitude}`);
          setLoading(false);
          toast({
            title: "Location detected",
            description: "Current location has been set successfully.",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Error",
            description: "Could not get your current location. Please try again or enter manually.",
            variant: "destructive",
          });
          setLoading(false);
        }
      );
    } else {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleMapSelect = (lat: number, lng: number) => {
    const locationString = `${lat},${lng}`;
    setLocation(locationString);
    onLocationSelect(locationString);
    setShowMap(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder={placeholder}
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            onLocationSelect(e.target.value);
          }}
          className="flex-1"
        />
        <Button
          variant="outline"
          onClick={() => setShowMap(true)}
          className="flex items-center gap-2"
        >
          <MapIcon className="h-4 w-4" />
          Map
        </Button>
        {label.toLowerCase().includes('origin') && (
          <Button
            variant="outline"
            onClick={getCurrentLocation}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            Current
          </Button>
        )}
      </div>

      {showMap && (
        <MapPopup
          onSelect={handleMapSelect}
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  );
};

export default LocationSelector;