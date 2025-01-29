"use client";
import { useRouter } from "next/navigation";
import { logout } from "@/app/actions/auth";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/hooks/use-toast";

export function LogoutMenuItem() {
  const { toast } = useToast();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have successfully logged out!",
      });
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed",
        description: "Logout failed. Please try again.",
      });
    }
  };

  return (
    <DropdownMenuItem onClick={handleLogout}>
      Log out
      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  );
}
