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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";

const formSchema = z.object({
  documentType: z.enum(["PASSPORT", "DRIVING_LICENSE", "NATIONAL_ID", "OTHER"]),
  documentNumber: z.string().min(1, "Document number is required"),
  address: z.string().min(1, "Address is required"),
});

export default function KYCVerification() {
  const [documentImage, setDocumentImage] = useState("");
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentType: "DRIVING_LICENSE",
      documentNumber: "",
      address: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          documentImage,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit KYC");

      toast({
        title: "Success",
        description: "KYC details submitted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit KYC details",
      });
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <div className="bg-card p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">KYC Verification</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PASSPORT">Passport</SelectItem>
                      <SelectItem value="DRIVING_LICENSE">
                        Driving License
                      </SelectItem>
                      <SelectItem value="NATIONAL_ID">National ID</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documentNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter document number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Document Image</FormLabel>
              <CldUploadWidget
                uploadPreset="kyc_documents"
                onSuccess={(result: any) => {
                  setDocumentImage(result.info.secure_url);
                }}
              >
                {({ open }) => (
                  <div className="flex flex-col items-center gap-4">
                    {documentImage ? (
                      <div className="relative w-full h-48">
                        <img
                          src={documentImage}
                          alt="Document"
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
                        Upload Document
                      </Button>
                    )}
                  </div>
                )}
              </CldUploadWidget>
            </div>

            <Button type="submit" className="w-full">
              Submit KYC
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}