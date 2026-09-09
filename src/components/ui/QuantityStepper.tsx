import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-gray-tertiary/32 inline-flex items-center rounded-full border",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="text-gray-secondary hover:text-primary-main flex size-10 cursor-pointer items-center justify-center"
        aria-label="Decrease quantity"
      >
        <Minus className="size-4" />
      </button>
      <span className="text-gray-primary w-8 text-center text-sm font-medium">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="text-gray-secondary hover:text-primary-main flex size-10 cursor-pointer items-center justify-center"
        aria-label="Increase quantity"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
