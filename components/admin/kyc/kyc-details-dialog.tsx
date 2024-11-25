"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CheckCircle, XCircle } from "lucide-react";

interface KycDetailsDialogProps {
  kyc: {
    id: string;
    documentType: string;
    documentNumber: string;
    documentImage: string;
    address: string;
    isVerified: boolean;
    submittedAt: Date;
    verifiedAt: Date | null;
    user: {
      name: string | null;
      email: string;
      image: string | null;
    };
  } | null;
  open: boolean;
  onClose: () => void;
  onVerify: (kycId: string, action: "approve" | "reject") => void;
}

export default function KycDetailsDialog({
  kyc,
  open,
  onClose,
  onVerify,
}: KycDetailsDialogProps) {
  if (!kyc) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>KYC Verification Details</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={kyc.user.image || undefined} />
              <AvatarFallback>{kyc.user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{kyc.user.name}</h2>
              <p className="text-muted-foreground">{kyc.user.email}</p>
              <div className="flex gap-2 mt-2">
                {kyc.isVerified ? (
                  <Badge variant="success">Verified</Badge>
                ) : (
                  <Badge variant="secondary">Pending Verification</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Document Type</p>
                <p className="font-medium">{kyc.documentType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Document Number</p>
                <p className="font-medium">{kyc.documentNumber}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Address</p>
              <p className="font-medium">{kyc.address}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Document Image</p>
              <img
                src={kyc.documentImage}
                alt="Document"
                className="w-full rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Submitted At</p>
                <p className="font-medium">
                  {format(new Date(kyc.submittedAt), "PPpp")}
                </p>
              </div>
              {kyc.verifiedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Verified At</p>
                  <p className="font-medium">
                    {format(new Date(kyc.verifiedAt), "PPpp")}
                  </p>
                </div>
              )}
            </div>

            {!kyc.isVerified && (
              <div className="flex gap-4">
                <Button
                  className="flex-1"
                  onClick={() => onVerify(kyc.id, "approve")}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => onVerify(kyc.id, "reject")}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}