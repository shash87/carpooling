"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Car, MapPin, Calendar as CalendarIcon, Search, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Hero() {
  const router = useRouter();
  const [date, setDate] = useState<Date>();
  const [search, setSearch] = useState({
    from: "",
    to: "",
    driverGender: "ANY",
    passengers: "1",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      from: search.from,
      to: search.to,
      date: date ? date.toISOString() : "",
      driverGender: search.driverGender,
      passengers: search.passengers,
    });
    router.push(`/rides?${params.toString()}`);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')",
          opacity: 0.15 
        }}
      />
      
      <div className="container relative z-10 px-4 md:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Share Rides, Create Connections
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Join GOALYFT and be part of the sustainable transportation revolution. 
            Save money, reduce emissions, and meet amazing people along the way.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card border rounded-lg p-6 shadow-lg">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="From where?"
                    className="pl-9"
                    value={search.from}
                    onChange={(e) => setSearch({ ...search, from: e.target.value })}
                    required
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="To where?"
                    className="pl-9"
                    value={search.to}
                    onChange={(e) => setSearch({ ...search, to: e.target.value })}
                    required
                  />
                </div>

                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="relative">
                  <Select
                    value={search.passengers}
                    onValueChange={(value) =>
                      setSearch({ ...search, passengers: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <Users className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Passengers" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Passenger" : "Passengers"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  value={search.driverGender}
                  onValueChange={(value) =>
                    setSearch({ ...search, driverGender: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Preferred driver gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ANY">Any Gender</SelectItem>
                    <SelectItem value="MALE">Male Driver</SelectItem>
                    <SelectItem value="FEMALE">Female Driver</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1" size="lg">
                    <Search className="mr-2 h-5 w-5" />
                    Find Rides
                  </Button>
                  
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/offer">
                      Offer a Ride <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Popular routes: Mumbai → Pune, Delhi → Agra, Bangalore → Mysore</p>
          </div>
        </div>
      </div>
    </div>
  );
}