import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "dark" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary-main text-success-light hover:bg-primary-main-dark hover:text-white",
  outline:
    "border border-gray-tertiary/32 text-gray-primary hover:border-primary-main hover:text-primary-main bg-transparent",
  ghost: "bg-transparent text-gray-primary hover:text-primary-main",
  dark: "bg-gray-primary text-white hover:bg-black",
  danger: "bg-error-dark text-white hover:bg-error-dark/90",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-medium transition-all duration-300",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
