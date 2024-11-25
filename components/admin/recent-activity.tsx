"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

const activities = [
  {
    id: 1,
    user: {
      name: "John Doe",
      image: "https://github.com/shadcn.png",
    },
    type: "booking",
    details: "Booked a ride from Mumbai to Pune",
    timestamp: new Date(),
  },
  {
    id: 2,
    user: {
      name: "Jane Smith",
      image: null,
    },
    type: "kyc",
    details: "Submitted KYC documents",
    timestamp: new Date(Date.now() - 3600000),
  },
  // Add more activities as needed
];

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.image || undefined} />
            <AvatarFallback>
              {activity.user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.user.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {activity.details}
            </p>
            <p className="text-xs text-muted-foreground">
              {format(activity.timestamp, "MMM d, h:mm a")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}