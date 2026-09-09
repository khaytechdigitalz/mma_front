import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: "left" | "right";
  widthClassName?: string;
  title?: string;
}

export function Drawer({
  open,
  onClose,
  children,
  side = "right",
  widthClassName = "max-w-md",
  title,
}: DrawerProps) {
  useEffect(() => {
    if (open) {
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.documentElement.classList.remove("overflow-hidden");
    }
    return () => document.documentElement.classList.remove("overflow-hidden");
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-110">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        className={cn(
          "animate__animated animate__faster absolute top-0 flex h-full w-full flex-col bg-white shadow-2xl",
          widthClassName,
          side === "right"
            ? "right-0 animate__slideInRight"
            : "left-0 animate__slideInLeft",
        )}
      >
        {title && (
          <div className="border-gray-tertiary/24 flex shrink-0 items-center justify-between border-b px-5 py-4">
            <h3 className="text-gray-primary text-lg font-bold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-secondary hover:text-primary-main flex size-9 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100"
            >
              <X className="size-5" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
