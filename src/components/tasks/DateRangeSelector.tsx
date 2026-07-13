"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const options = [
  { value: "3d", label: "近 3 天" },
  { value: "1w", label: "本周" },
  { value: "2w", label: "近两周" },
  { value: "1m", label: "本月" },
];

export function DateRangeSelector({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-600 outline-none focus:border-gray-400"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
