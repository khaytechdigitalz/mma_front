import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaceholderImageProps {
  label?: string;
  className?: string;
  iconClassName?: string;
  tone?: "light" | "primary" | "dark";
}

const tones: Record<string, string> = {
  light: "bg-gray-200 text-gray-tertiary",
  primary: "bg-primary-lighter text-primary-main",
  dark: "bg-primary-main text-primary-light",
};

/**
 * The original template's real product/banner photos were not included in
 * the uploaded archive (the `src/images` folder was empty). This component
 * stands in for every <img> in the template so the UI renders cleanly.
 * Swap it out for a real <img src="..." /> once you have your assets —
 * every place it's used forwards `className` so sizing/aspect ratio is
 * already handled by the parent component.
 */
export function PlaceholderImage({
  label,
  className,
  iconClassName,
  tone = "light",
}: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        "flex size-full flex-col items-center justify-center gap-1.5 overflow-hidden",
        tones[tone],
        className,
      )}
      role="img"
      aria-label={label ?? "Placeholder image"}
    >
      <ImageIcon className={cn("size-6 opacity-60", iconClassName)} />
      {label && (
        <span className="line-clamp-1 px-2 text-center text-[11px] leading-tight font-medium opacity-70">
          {label}
        </span>
      )}
    </div>
  );
}
