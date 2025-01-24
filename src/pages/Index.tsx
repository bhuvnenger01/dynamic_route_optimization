import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { RouteForm } from "@/components/RouteForm";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [routeData, setRouteData] = useState(null);

  const handleRouteCalculation = async (data: { origin: string; destination: string; vehicleType: string }) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        setRouteData(result);
        toast({
          title: "Route calculated successfully!",
          description: `Distance: ${result.distance}, Duration: ${result.time}, Emissions: ${result.emissions}`,
        });
      } else {
        toast({
          title: "Error calculating route",
          description: result.error || "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error calculating route",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModifyDetails = () => {
    setRouteData(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12 page-transition">
          <h1 className="text-4xl font-bold mb-4">Find Your Optimal Route</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter your origin and destination to discover the most efficient route for your journey.
          </p>
        </div>
        <div className="page-transition">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loader"></div>
            </div>
          ) : routeData ? (
            <div className="space-y-6">
              <div className="glass-card p-8 rounded-xl max-w-md w-full mx-auto">
                <h2 className="text-2xl font-bold mb-4">Route Details</h2>
                <p><strong>Distance:</strong> {routeData.distance}</p>
                <p><strong>Duration:</strong> {routeData.time}</p>
                <p><strong>Emissions:</strong> {routeData.emissions}</p>
                <Button onClick={handleModifyDetails} className="button-secondary w-full mt-4">
                  Modify Details
                </Button>
              </div>
            </div>
          ) : (
            <RouteForm onSubmit={handleRouteCalculation} loading={loading} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;