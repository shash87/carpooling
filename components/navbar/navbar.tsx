"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import UserMenu from "./user-menu";
import { Car } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 w-full h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container h-full mx-auto flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Car className="h-6 w-6" />
          <span className="font-bold text-xl">GOALYFT</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/rides">
            <Button variant="ghost">Find Rides</Button>
          </Link>
          <Link href="/offer">
            <Button variant="ghost">Offer Ride</Button>
          </Link>
          <ModeToggle />
          {session ? (
            <UserMenu user={session.user} />
          ) : (
            <Link href="/auth">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}