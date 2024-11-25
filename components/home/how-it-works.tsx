import { Search, Calendar, MapPin } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find Your Ride",
    description: "Search for rides matching your route and schedule.",
  },
  {
    icon: Calendar,
    title: "Book Instantly",
    description: "Reserve your seat with instant confirmation.",
  },
  {
    icon: MapPin,
    title: "Travel Together",
    description: "Meet at the pickup point and enjoy your journey.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          How GOALYFT Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}