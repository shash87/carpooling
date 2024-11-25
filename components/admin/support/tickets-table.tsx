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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { MoreVertical, Eye, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import TicketDetailsDialog from "./ticket-details-dialog";

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    image: string;
  };
}

export default function TicketsTable() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (ticketId: string, status: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/support/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update ticket status");

      toast({
        title: "Success",
        description: "Ticket status updated successfully",
      });

      // Refresh tickets
      fetchTickets();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update ticket status",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const response = await fetch("/api/admin/support");
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={ticket.user.image} />
                      <AvatarFallback>
                        {ticket.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{ticket.user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {ticket.user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{ticket.subject}</div>
                  <div className="text-sm text-muted-foreground line-clamp-1">
                    {ticket.description}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      ticket.priority === "HIGH"
                        ? "destructive"
                        : ticket.priority === "MEDIUM"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {ticket.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      ticket.status === "CLOSED"
                        ? "success"
                        : ticket.status === "IN_PROGRESS"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {ticket.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(ticket.createdAt), "MMM d, h:mm a")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedTicket(ticket)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {ticket.status !== "CLOSED" && (
                        <>
                          {ticket.status === "OPEN" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(ticket.id, "IN_PROGRESS")
                              }
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              Mark In Progress
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(ticket.id, "CLOSED")
                            }
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Resolved
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

      <TicketDetailsDialog
        ticket={selectedTicket}
        open={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </>
  );
}