import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("custom-container", className)}>{children}</div>
  );
}

export function Section({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={cn("py-10 md:py-14", className)}>{children}</section>;
}

export function SectionHeading({
  title,
  subtitle,
  align = "left",
}: {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("mb-8", align === "center" && "text-center")}>
      <h2 className="text-gray-primary mb-2 text-2xl font-bold md:text-32">
        {title}
      </h2>
      {subtitle && <p className="text-gray-secondary text-base">{subtitle}</p>}
    </div>
  );
}
