import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
