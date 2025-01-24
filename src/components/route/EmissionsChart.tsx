import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EmissionsChartProps {
  emissions: {
    emissions: number;
    unit: string;
    potential_savings: {
      electric: number;
      hybrid: number;
    };
    recommendations: string[];
  };
}

const EmissionsChart: React.FC<EmissionsChartProps> = ({ emissions }) => {
  const emissionsData = [
    {
      name: 'Current Vehicle',
      emissions: emissions.emissions
    },
    {
      name: 'Electric Alternative',
      emissions: emissions.emissions - emissions.potential_savings.electric
    },
    {
      name: 'Hybrid Alternative',
      emissions: emissions.emissions - emissions.potential_savings.hybrid
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environmental Impact</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={emissionsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="emissions" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-2">
          <p className="font-medium">Potential Savings:</p>
          <div className="flex gap-2">
            <Badge variant="secondary">
              Electric: {emissions.potential_savings.electric} {emissions.unit}
            </Badge>
            <Badge variant="secondary">
              Hybrid: {emissions.potential_savings.hybrid} {emissions.unit}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-medium">Recommendations:</p>
          <ul className="list-disc list-inside space-y-1">
            {emissions.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-gray-600">{rec}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmissionsChart;