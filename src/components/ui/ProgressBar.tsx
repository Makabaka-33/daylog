import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  color?: string;
}

export function ProgressBar({ value, className, color }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn("h-2 w-full rounded-full bg-gray-100 overflow-hidden", className)}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${clamped}%`,
          backgroundColor: color || "#1f2937",
        }}
      />
    </div>
  );
}
