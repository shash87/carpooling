"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  Car,
  FileCheck,
  BarChart3,
  MessageSquare,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    title: "Overview",
    href: "/admin",
    icon: BarChart3,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "KYC Verification",
    href: "/admin/kyc",
    icon: FileCheck,
  },
  {
    title: "Rides",
    href: "/admin/rides",
    icon: Car,
  },
  {
    title: "Support",
    href: "/admin/support",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r bg-card px-3 py-4">
      <div className="mb-8 px-4">
        <h1 className="text-xl font-bold">GOALYFT Admin</h1>
      </div>
      
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}