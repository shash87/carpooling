import { Car, Shield, CreditCard, Users } from "lucide-react";

const features = [
  {
    icon: Car,
    title: "Convenient Travel",
    description: "Find rides going your way with our easy-to-use platform.",
  },
  {
    icon: Shield,
    title: "Verified Users",
    description: "Travel with confidence with our verified user community.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Safe and transparent payments through our platform.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Join a growing community of trusted travelers.",
  },
];

export default function Features() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose GOALYFT?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <feature.icon className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}