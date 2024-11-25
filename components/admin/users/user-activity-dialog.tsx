"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useState, useEffect } from "react";

interface Activity {
  id: string;
  type: string;
  description: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

interface UserActivityDialogProps {
  userId?: string;
  open: boolean;
  onClose: () => void;
}

export default function UserActivityDialog({
  userId,
  open,
  onClose,
}: UserActivityDialogProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userId && open) {
      fetchActivities();
    }
  }, [userId, open]);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/users/${userId}/activity`);
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityBadgeVariant = (type: string) => {
    switch (type) {
      case "LOGIN":
        return "default";
      case "KYC_SUBMIT":
        return "secondary";
      case "RIDE_CREATE":
        return "success";
      case "BOOKING":
        return "warning";
      default:
        return "outline";
    }
  };

  if (!userId) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Activity Log</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : activities.length > 0 ? (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 border-b pb-4"
                >
                  <Badge variant={getActivityBadgeVariant(activity.type)}>
                    {activity.type}
                  </Badge>
                  <div className="flex-1">
                    <p>{activity.description}</p>
                    {activity.metadata && (
                      <pre className="mt-2 text-sm text-muted-foreground">
                        {JSON.stringify(activity.metadata, null, 2)}
                      </pre>
                    )}
                    <p className="mt-1 text-sm text-muted-foreground">
                      {format(new Date(activity.createdAt), "PPpp")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No activity found
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}