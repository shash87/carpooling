const popularRoutes = [
  {
    from: "Mumbai",
    to: "Pune",
    price: "₹500",
    duration: "3 hours",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f",
  },
  {
    from: "Delhi",
    to: "Agra",
    price: "₹800",
    duration: "4 hours",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523",
  },
  {
    from: "Bangalore",
    to: "Mysore",
    price: "₹400",
    duration: "3.5 hours",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41",
  },
];

export default function PopularRoutes() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Popular Routes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularRoutes.map((route, index) => (
            <div
              key={index}
              className="group cursor-pointer bg-background rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${route.image})` }}
              />
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {route.from} → {route.to}
                    </h3>
                    <p className="text-muted-foreground">{route.duration}</p>
                  </div>
                  <p className="text-xl font-bold text-primary">{route.price}</p>
                </div>
                <button className="w-full py-2 text-center text-primary hover:text-primary/80 font-medium">
                  View Available Rides →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}