"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  gradient: string;
  action?: React.ReactNode;
}

export function SectionHeader({
  icon: Icon,
  title,
  description,
  gradient,
  action,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center",
            gradient
          )}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {description && <p className="text-sm text-white/50">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

interface ColorPickerInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPickerInput({ label, value, onChange }: ColorPickerInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-3">{label}</label>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg border border-white/20 cursor-pointer overflow-hidden relative"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <span className="text-white/60 font-mono text-sm">{value.toUpperCase()}</span>
      </div>
    </div>
  );
}

interface SelectButtonGroupProps<T extends string | number> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
  gradient?: string;
}

export function SelectButtonGroup<T extends string | number>({
  options,
  value,
  onChange,
  gradient = "from-indigo-500 to-purple-500",
}: SelectButtonGroupProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            value === option.value
              ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
              : "bg-white/[0.05] text-white/70 hover:bg-white/[0.1] hover:text-white"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
