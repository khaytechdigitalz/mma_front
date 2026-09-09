import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  children,
  widthClassName = "max-w-3xl",
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  widthClassName?: string;
  title?: string;
}) {
  useEffect(() => {
    if (open) document.documentElement.classList.add("overflow-hidden");
    else document.documentElement.classList.remove("overflow-hidden");
    return () => document.documentElement.classList.remove("overflow-hidden");
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className={cn(
          "animate__animated animate__faster animate__zoomIn relative max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl",
          widthClassName,
        )}
      >
        {title && (
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-gray-primary text-lg font-bold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-secondary hover:text-primary-main flex size-9 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100"
            >
              <X className="size-5" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
