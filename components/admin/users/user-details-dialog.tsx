"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  emailVerified: Date | null;
  createdAt: Date;
  kyc?: {
    isVerified: boolean;
    documentType: string;
    documentNumber: string;
    address: string;
    submittedAt: Date;
    verifiedAt: Date | null;
  };
  rides?: {
    total: number;
    completed: number;
    cancelled: number;
  };
  bookings?: {
    total: number;
    completed: number;
    cancelled: number;
  };
}

interface UserDetailsDialogProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

export default function UserDetailsDialog({
  user,
  open,
  onClose,
}: UserDetailsDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                  {user.role}
                </Badge>
                {user.kyc?.isVerified ? (
                  <Badge variant="success">KYC Verified</Badge>
                ) : (
                  <Badge variant="destructive">KYC Pending</Badge>
                )}
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="kyc">KYC Details</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {format(new Date(user.createdAt), "MMMM d, yyyy")}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Email Status</p>
                  <p className="font-medium">
                    {user.emailVerified ? "Verified" : "Not Verified"}
                  </p>
                </div>
              </div>

              {user.rides && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Rides Offered</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-2xl font-bold">{user.rides.total}</p>
                      <p className="text-sm text-muted-foreground">Total</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-2xl font-bold">{user.rides.completed}</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-2xl font-bold">{user.rides.cancelled}</p>
                      <p className="text-sm text-muted-foreground">Cancelled</p>
                    </div>
                  </div>
                </div>
              )}

              {user.bookings && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Bookings Made</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-2xl font-bold">{user.bookings.total}</p>
                      <p className="text-sm text-muted-foreground">Total</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-2xl font-bold">
                        {user.bookings.completed}
                      </p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-2xl font-bold">
                        {user.bookings.cancelled}
                      </p>
                      <p className="text-sm text-muted-foreground">Cancelled</p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="kyc" className="space-y-4">
              {user.kyc ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Document Type
                      </p>
                      <p className="font-medium">{user.kyc.documentType}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Document Number
                      </p>
                      <p className="font-medium">{user.kyc.documentNumber}</p>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{user.kyc.address}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Submitted At
                      </p>
                      <p className="font-medium">
                        {format(
                          new Date(user.kyc.submittedAt),
                          "MMMM d, yyyy h:mm a"
                        )}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Verification Status
                      </p>
                      <p className="font-medium">
                        {user.kyc.verifiedAt
                          ? `Verified on ${format(
                              new Date(user.kyc.verifiedAt),
                              "MMMM d, yyyy"
                            )}`
                          : "Pending Verification"}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">No KYC details available</p>
              )}
            </TabsContent>

            <TabsContent value="activity">
              <p className="text-muted-foreground">
                Recent activity will be shown here
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}