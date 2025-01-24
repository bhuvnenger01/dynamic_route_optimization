import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RouteInformationCardProps {
  distance: string;
  time: string;
  emissions: {
    emissions: number;
    unit: string;
    potential_savings?: {
      electric: number;
      hybrid: number;
    };
    recommendations?: string[];
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
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Emissions:</span>
              <span className="font-medium">
                {emissions.emissions} {emissions.unit}
              </span>
            </div>
            {emissions.potential_savings && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Potential Savings:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Electric Vehicle:</span>
                    <span>{emissions.potential_savings.electric} {emissions.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hybrid Vehicle:</span>
                    <span>{emissions.potential_savings.hybrid} {emissions.unit}</span>
                  </div>
                </div>
              </div>
            )}
            {emissions.recommendations && emissions.recommendations.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {emissions.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteInformationCard;