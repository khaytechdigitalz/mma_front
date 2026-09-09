import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  reviewCount,
  size = 16,
  className,
}: {
  value: number;
  reviewCount?: number;
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={
              i < Math.round(value)
                ? "fill-warning-dark text-warning-dark"
                : "fill-gray-200 text-gray-200"
            }
          />
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="text-gray-tertiary text-xs">({reviewCount})</span>
      )}
    </div>
  );
}
