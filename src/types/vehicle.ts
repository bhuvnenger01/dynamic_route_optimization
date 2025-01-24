export interface VehicleDetails {
  type: 'car' | 'truck' | 'bike' | 'ev' | 'hybrid';
  fuelType?: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  efficiency?: number; // mpg or kWh/100mi
  year?: number;
  capacity?: number; // in kg
  currentCharge?: number; // for EVs, percentage
}

export interface RouteOptimizationParams {
  vehicleDetails: VehicleDetails;
  weatherConditions: boolean;
  avoidTraffic: boolean;
  prioritizeCharging?: boolean;
  avoidEmissionsZones?: boolean;
}