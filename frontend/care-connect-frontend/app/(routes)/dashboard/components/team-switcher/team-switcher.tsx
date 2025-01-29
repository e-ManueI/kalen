// app/components/UserNav.tsx (Client Component)
"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type UserData = {
  email: string;
  fullName: string;
} | null;

type UserNavProps = {
  userData: UserData;
  userRole: string | null;
};

export default function TeamSwitcher({ userData, userRole }: UserNavProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="User menu"
          className={cn("w-auto justify-between")}
        >
          <div className="flex items-center">
            <Avatar className="mr-2 h-5 w-auto">
              <AvatarImage
                src={`https://avatar.vercel.sh/${userData?.email}.png`}
                alt={userData?.fullName || "User"}
              />
              <AvatarFallback>{userData?.fullName?.[0] || "U"}</AvatarFallback>
            </Avatar>
            {userRole! === "doctor" && "Dr."} {userData?.fullName || "User"}
          </div>
          <ChevronsUpDown className="ml-auto opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No user data found.</CommandEmpty>
            <CommandGroup heading="User">
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                }}
                className="text-sm"
              >
                <Avatar className="mr-2 h-5 w-5">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${userData?.email}.png`}
                    alt={userData?.fullName || "User"}
                  />
                  <AvatarFallback>
                    {userData?.fullName?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                {userData?.fullName || "User"}
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                }}
                className="text-center text-sm"
              >
                <span className="text-center text-muted-foreground">
                  {userRole?.toUpperCase() || "User"}
                </span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
