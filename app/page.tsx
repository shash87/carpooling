import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import HowItWorks from "@/components/home/how-it-works";
import PopularRoutes from "@/components/home/popular-routes";

export default function Home() {
  return (
    <div className="flex flex-col gap-20">
      <Hero />
      <Features />
      <HowItWorks />
      <PopularRoutes />
    </div>
  );
}