import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import useToggle from "@rooks/use-toggle";
import { Routes, Route } from 'react-router-dom';
import RouteDetails from './components/RouteDetails';
import { VehicleDetailsForm } from './components/VehicleDetailsForm';
import { VehicleDetails } from './types/vehicle';
import About from "./pages/About";
import Contact from "./pages/Contact";

const socket = io('http://localhost:5000');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  const [routeData, setRouteData] = useState(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails>({
    type: 'car',
    fuelType: 'gasoline'
  });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useToggle(true);
  const [results, setResults] = useToggle(false);
  const [showImage, setShowImage] = useState(true);

  useEffect(() => {
    socket.on('response', (data) => {
      setRouteData(data);
      setLoading(false);
    });

    return () => {
      socket.off('response');
    };
  }, []);

  const handleVehicleSubmit = (data: VehicleDetails) => {
    setVehicleDetails(data);
  };

  const fetchRouteData = () => {
    if (!origin || !destination) {
      alert('Please fill all the fields!');
      return;
    }
    setLoading(true);
    socket.emit('calculate_route', { 
      origin, 
      destination, 
      vehicleDetails 
    });
    setForm(false);
    setResults(true);
    setShowImage(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-radial from-primary-light via-background to-secondary-light">
            <Navigation />
            <main className="container mx-auto pt-24 px-4">
              <Routes>
                <Route path="/" element={
                  <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 animate-fade-in">
                      <h2 className="text-4xl font-bold mb-4 text-primary-dark">Find Your Optimal Route</h2>
                      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Enter your vehicle details and destination to discover the most efficient and eco-friendly route.
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                      <div className={`form-container ${form ? 'animate-fade-in' : 'hidden'}`}>
                        <div className="glass-card p-8 rounded-xl space-y-8">
                          <VehicleDetailsForm onSubmit={handleVehicleSubmit} />
                          
                          <div className="space-y-6">
                            <div>
                              <label className="block text-gray-600 text-sm font-medium mb-2">Origin</label>
                              <input
                                type="text"
                                placeholder="Enter origin"
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                className="form-input"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 text-sm font-medium mb-2">Destination</label>
                              <input
                                type="text"
                                placeholder="Enter destination"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className="form-input"
                              />
                            </div>
                            <button 
                              onClick={fetchRouteData} 
                              className="button-primary w-full"
                              disabled={loading}
                            >
                              {loading ? 'Calculating...' : 'Calculate Route'}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {showImage && (
                        <div className="hidden md:block">
                          <img 
                            src="/images/routes1.png" 
                            alt="Route Finding Illustration" 
                            className="w-full h-auto animate-fade-in"
                          />
                        </div>
                      )}
                    </div>

                    <div className={`route-details-container ${results ? 'animate-fade-in' : 'hidden'}`}>
                      {routeData && <RouteDetails routeData={routeData} vehicleDetails={vehicleDetails} />}
                    </div>
                  </div>
                } />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
          </div>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;