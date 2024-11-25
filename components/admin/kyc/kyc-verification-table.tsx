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
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import KycDetailsDialog from "./kyc-details-dialog";

interface KycVerification {
  id: string;
  documentType: string;
  documentNumber: string;
  documentImage: string;
  address: string;
  isVerified: boolean;
  submittedAt: Date;
  verifiedAt: Date | null;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

export default function KycVerificationTable() {
  const [verifications, setVerifications] = useState<KycVerification[]>([]);
  const [selectedKyc, setSelectedKyc] = useState<KycVerification | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleVerification = async (kycId: string, action: "approve" | "reject") => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/kyc/${kycId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) throw new Error("Failed to update verification");

      toast({
        title: "Success",
        description: `KYC ${action === "approve" ? "approved" : "rejected"} successfully`,
      });

      // Refresh verifications
      fetchVerifications();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update verification",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVerifications = async () => {
    try {
      const response = await fetch("/api/admin/kyc");
      const data = await response.json();
      setVerifications(data);
    } catch (error) {
      console.error("Failed to fetch verifications:", error);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Document Type</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {verifications.map((verification) => (
              <TableRow key={verification.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={verification.user.image || undefined} />
                      <AvatarFallback>
                        {verification.user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{verification.user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {verification.user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{verification.documentType}</TableCell>
                <TableCell>
                  {format(new Date(verification.submittedAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  {verification.isVerified ? (
                    <Badge variant="success">Verified</Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedKyc(verification)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {!verification.isVerified && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleVerification(verification.id, "approve")}
                          disabled={isLoading}
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleVerification(verification.id, "reject")}
                          disabled={isLoading}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <KycDetailsDialog
        kyc={selectedKyc}
        open={!!selectedKyc}
        onClose={() => setSelectedKyc(null)}
        onVerify={handleVerification}
      />
    </>
  );
}