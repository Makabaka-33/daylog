"use client";

import { cn } from "@/lib/utils";

interface Tab {
  value: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-1 rounded-lg bg-gray-100 p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            value === tab.value
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
