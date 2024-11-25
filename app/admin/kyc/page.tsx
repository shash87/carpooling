import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import KycVerificationTable from "@/components/admin/kyc/kyc-verification-table";
import KycFilters from "@/components/admin/kyc/kyc-filters";

export default function KycVerificationPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">KYC Verification</h1>
      </div>

      <KycFilters />

      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <KycVerificationTable />
      </Suspense>
    </div>
  );
}