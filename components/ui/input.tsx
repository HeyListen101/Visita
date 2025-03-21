import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md bg-[#f5f5f5] px-3 py-2 text-sm text-black placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-0",
          className
        )}        
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
