import { Navigation } from "@/components/Navigation";

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto page-transition">
          <h1 className="text-4xl font-bold mb-8 text-center text-primary-dark">About RouteWise</h1>
          <div className="glass-card p-8 rounded-xl space-y-6">
            <p className="text-lg leading-relaxed">
              RouteWise is a cutting-edge route optimization platform designed to help you find the most efficient paths for your journeys. Whether you're driving a car, riding a bike, or operating a truck, our sophisticated algorithms ensure you get the best possible route.
            </p>
            <p className="text-lg leading-relaxed">
              Our mission is to make transportation more efficient and sustainable by providing intelligent routing solutions that consider various factors such as traffic patterns, vehicle type, and road conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;