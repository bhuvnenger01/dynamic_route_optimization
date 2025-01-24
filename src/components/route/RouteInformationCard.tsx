import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RouteInformationCardProps {
  distance: string;
  time: string;
  emissions: string | {
    emissions: number;
    unit: string;
  };
}

const RouteInformationCard: React.FC<RouteInformationCardProps> = ({
  distance,
  time,
  emissions
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Route Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Distance:</span>
          <span className="font-medium">{distance}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Duration:</span>
          <span className="font-medium">{time}</span>
        </div>
        {emissions && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Emissions:</span>
            <span className="font-medium">
              {typeof emissions === 'string' 
                ? emissions 
                : `${emissions.emissions} ${emissions.unit}`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteInformationCard;