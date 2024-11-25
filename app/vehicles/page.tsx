"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Car, Upload } from "lucide-react";

const formSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().regex(/^\d{4}$/, "Invalid year"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  seatCount: z.string().regex(/^\d+$/, "Invalid seat count"),
});

export default function VehicleManagement() {
  const [vehicleImage, setVehicleImage] = useState("");
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      registrationNumber: "",
      seatCount: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          year: parseInt(values.year),
          seatCount: parseInt(values.seatCount),
          vehicleImage,
        }),
      });

      if (!response.ok) throw new Error("Failed to add vehicle");

      toast({
        title: "Success",
        description: "Vehicle added successfully",
      });
      
      form.reset();
      setVehicleImage("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add vehicle",
      });
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <div className="bg-card p-8 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Car className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Add Vehicle</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Toyota" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Camry" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 2020" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seatCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Seats</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 4" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="registrationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter vehicle registration number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Vehicle Image</FormLabel>
              <CldUploadWidget
                uploadPreset="vehicle_images"
                onSuccess={(result: any) => {
                  setVehicleImage(result.info.secure_url);
                }}
              >
                {({ open }) => (
                  <div className="flex flex-col items-center gap-4">
                    {vehicleImage ? (
                      <div className="relative w-full h-48">
                        <img
                          src={vehicleImage}
                          alt="Vehicle"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          className="absolute bottom-2 right-2"
                          onClick={() => open()}
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-48"
                        onClick={() => open()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Vehicle Image
                      </Button>
                    )}
                  </div>
                )}
              </CldUploadWidget>
            </div>

            <Button type="submit" className="w-full">
              Add Vehicle
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}