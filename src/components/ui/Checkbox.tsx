"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({ checked, onChange, className }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex h-5 w-5 items-center justify-center rounded border transition-colors",
        checked
          ? "border-gray-900 bg-gray-900 text-white"
          : "border-gray-300 hover:border-gray-400",
        className
      )}
    >
      {checked && <Check size={12} strokeWidth={3} />}
    </button>
  );
}
