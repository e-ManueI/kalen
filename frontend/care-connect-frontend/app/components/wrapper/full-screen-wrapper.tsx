import React from "react";
import { cn } from "@/lib/utils";

interface FullScreenWrapperProps {
  children: React.ReactNode;
  className?: string; // Optional prop to extend or override styles
}

const FullScreenWrapper: React.FC<FullScreenWrapperProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "w-full flex-col min-h-screen flex items-center justify-center",
        className
      )}
    >
      {children}
    </div>
  );
};

export default FullScreenWrapper;
