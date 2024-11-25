"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import {
  MoreVertical,
  Shield,
  ShieldAlert,
  UserX,
  Download,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import UserDetailsDialog from "./user-details-dialog";
import UserActivityDialog from "./user-activity-dialog";
import { exportToCSV } from "@/lib/export";

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: "USER" | "ADMIN";
  emailVerified: Date | null;
  createdAt: Date;
  kyc?: {
    isVerified: boolean;
  };
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [showActivity, setShowActivity] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSelectAll = (checked: boolean) => {
    setSelectedUserIds(checked ? users.map(user => user.id) : []);
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    setSelectedUserIds(prev =>
      checked ? [...prev, userId] : prev.filter(id => id !== userId)
    );
  };

  const handleBulkAction = async (action: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/users/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIds: selectedUserIds,
          action,
        }),
      });

      if (!response.ok) throw new Error("Failed to perform bulk action");

      toast({
        title: "Success",
        description: "Bulk action completed successfully",
      });

      setSelectedUserIds([]);
      fetchUsers();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to perform bulk action",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/admin/users/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIds: selectedUserIds.length > 0 ? selectedUserIds : undefined,
        }),
      });

      if (!response.ok) throw new Error("Failed to export data");

      const data = await response.json();
      exportToCSV(data, "users-export.csv");

      toast({
        title: "Success",
        description: "User data exported successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to export user data",
      });
    }
  };

  const handleAction = async (userId: string, action: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) throw new Error("Failed to perform action");

      toast({
        title: "Success",
        description: "User action completed successfully",
      });

      fetchUsers();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to perform action",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {selectedUserIds.length > 0 && (
        <div className="bg-muted/50 p-4 rounded-lg mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{selectedUserIds.length} users selected</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("verify")}
              disabled={isLoading}
            >
              Verify Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("suspend")}
              disabled={isLoading}
            >
              Suspend Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Selected
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedUserIds.length === users.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>KYC Status</TableHead>
              <TableHead>Email Verified</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedUserIds.includes(user.id)}
                    onCheckedChange={(checked) =>
                      handleSelectUser(user.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.image || undefined} />
                      <AvatarFallback>
                        {user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "ADMIN" ? "default" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.kyc?.isVerified ? (
                    <Badge variant="success">Verified</Badge>
                  ) : (
                    <Badge variant="destructive">Unverified</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {user.emailVerified ? (
                    <Badge variant="success">Verified</Badge>
                  ) : (
                    <Badge variant="destructive">Unverified</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(user.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user);
                          setShowActivity(true);
                        }}
                      >
                        View Activity
                      </DropdownMenuItem>
                      {user.role !== "ADMIN" && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleAction(user.id, "promote")}
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Make Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction(user.id, "suspend")}
                            className="text-red-600"
                          >
                            <ShieldAlert className="mr-2 h-4 w-4" />
                            Suspend User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction(user.id, "delete")}
                            className="text-red-600"
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UserDetailsDialog
        user={selectedUser}
        open={!!selectedUser && !showActivity}
        onClose={() => setSelectedUser(null)}
      />

      <UserActivityDialog
        userId={selectedUser?.id}
        open={!!selectedUser && showActivity}
        onClose={() => {
          setSelectedUser(null);
          setShowActivity(false);
        }}
      />
    </>
  );
}