import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import MapPopup from "@/components/MapPopup"; // Import MapPopup component

interface RouteFormProps {
  onSubmit: (data: { origin: string; destination: string; vehicleType: string }) => void;
  loading: boolean;
}

export const RouteForm = ({ onSubmit, loading }: RouteFormProps) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [showOriginMap, setShowOriginMap] = useState(false);
  const [showDestinationMap, setShowDestinationMap] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ origin, destination, vehicleType });
  };

  const handleSelectOrigin = (lat: number, lng: number) => {
    setOrigin(`${lat},${lng}`);
    setShowOriginMap(false);
  };

  const handleSelectDestination = (lat: number, lng: number) => {
    setDestination(`${lat},${lng}`);
    setShowDestinationMap(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 glass-card p-8 rounded-xl max-w-md w-full mx-auto">
      <div className="space-y-2">
        <label className="text-sm font-medium">Origin</label>
        <Input
          type="text"
          placeholder="Enter origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="form-input"
        />
        <Button type="button" onClick={() => setShowOriginMap(true)}>
          Select from Map
        </Button>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Destination</label>
        <Input
          type="text"
          placeholder="Enter destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="form-input"
        />
        <Button type="button" onClick={() => setShowDestinationMap(true)}>
          Select from Map
        </Button>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Vehicle Type</label>
        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          className="form-input"
        >
          <option value="">Select Vehicle Type</option>
          <option value="car">Car</option>
          <option value="bike">Bike</option>
          <option value="truck">Truck</option>
        </select>
      </div>
      <Button
        type="submit"
        className="button-primary w-full"
        disabled={loading}
      >
        {loading ? "Calculating..." : "Calculate Route"}
      </Button>

      {showOriginMap && <MapPopup onSelect={handleSelectOrigin} onClose={() => setShowOriginMap(false)} />}
      {showDestinationMap && <MapPopup onSelect={handleSelectDestination} onClose={() => setShowDestinationMap(false)} />}
    </form>
  );
};