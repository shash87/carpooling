"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

export default function UserFilters() {
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    kycStatus: "all",
  });

  const handleReset = () => {
    setFilters({
      search: "",
      role: "all",
      kycStatus: "all",
    });
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          className="pl-9"
        />
      </div>

      <Select
        value={filters.role}
        onValueChange={(value) =>
          setFilters((prev) => ({ ...prev, role: value }))
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="USER">User</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.kycStatus}
        onValueChange={(value) =>
          setFilters((prev) => ({ ...prev, kycStatus: value }))
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by KYC" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="verified">Verified</SelectItem>
          <SelectItem value="unverified">Unverified</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleReset}
        className="shrink-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}