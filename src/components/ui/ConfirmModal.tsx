import { AlertTriangle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Generic confirm/cancel dialog - used for logout, deleting an address, etc. */
export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "primary",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <button
          onClick={onCancel}
          className="text-gray-tertiary hover:text-gray-primary absolute top-4 right-4 cursor-pointer"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
        <div
          className={cn(
            "mb-4 flex size-12 items-center justify-center rounded-full",
            tone === "danger" ? "bg-error-lighter/60 text-error-dark" : "bg-primary-lighter text-primary-main",
          )}
        >
          <AlertTriangle className="size-6" />
        </div>
        <h3 className="text-gray-primary mb-2 text-lg font-bold">{title}</h3>
        {description && <p className="text-gray-secondary mb-6 text-sm">{description}</p>}
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            fullWidth
            variant={tone === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
