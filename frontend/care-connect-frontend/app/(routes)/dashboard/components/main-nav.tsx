"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
type MainNavProps = React.HTMLAttributes<HTMLElement> & {
  userRole: string | null;
};

export default function MainNav({
  userRole,
  className,
  ...props
}: MainNavProps) {
  const pathname = usePathname();

  // Helper function to check if a link is active
  const isActive = (href: string) => pathname === href;

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/dashboard"
        className={cn(
          "text-sm font-light text-muted-foreground transition-colors hover:text-primary",
          isActive("/dashboard") && "font-medium text-primary",
        )}
      >
        Overview
      </Link>

      {(userRole === "admin" ||
        userRole === "doctor" ||
        userRole === "patient") && (
        <Link
          href="#"
          className={cn(
            "text-sm text-muted-foreground transition-colors hover:text-primary",
            isActive("#") && "font-medium text-primary",
          )}
        >
          Doctors
        </Link>
      )}

      {(userRole === "admin" || userRole === "doctor") && (
        <Link
          href="#"
          className={cn(
            "text-sm text-muted-foreground transition-colors hover:text-primary",
            isActive("#") && "font-medium text-primary",
          )}
        >
          Patients
        </Link>
      )}

      <Link
        href="/dashboard/profile"
        className={cn(
          "text-sm font-light text-muted-foreground transition-colors hover:text-primary",
          isActive("/dashboard/profile") && "font-medium text-primary",
        )}
      >
        Settings
      </Link>
    </nav>
  );
}
