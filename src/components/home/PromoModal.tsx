import { useEffect, useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

const STORAGE_KEY = "mma_hide_promo_popup";
const PROMO_CODE = "SALES2026";

export function PromoModal() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Show shortly after landing, unless the user previously dismissed it for good.
  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY) === "true";
    if (dismissed) return;

    const timer = window.setTimeout(() => setOpen(true), 800);
    return () => window.clearTimeout(timer);
  }, []);

  // Lock scroll + allow Escape to close while open.
  useEffect(() => {
    if (!open) return;

    document.body.classList.add("overflow-hidden");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  function dontShowAgain() {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(PROMO_CODE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable/blocked (e.g. insecure context) — fail silently.
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-modal-title"
    >
      <div onClick={close} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />

      <div className="relative grid w-full max-w-[860px] grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-2xl sm:grid-cols-2">
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/80 text-gray-700 transition hover:bg-white hover:text-gray-900"
        >
          <X className="size-5" />
        </button>

        {/* Left panel */}
        <div className="bg-primary-light flex flex-col justify-center gap-4 px-8 py-10 sm:px-10">
          <Logo />
          <div>
            <p className="text-white text-sm font-semibold tracking-wide uppercase">
              Up to
            </p>
            <p className="text-white flex items-end gap-2 leading-none">
              <span className="text-6xl font-extrabold">50%</span>
              <span className="mb-1 text-lg font-bold">OFF</span>
            </p>
          </div>
          <p className="text-white/80 text-sm leading-relaxed">
            Join us and receive 10% off your first purchase with free shipping.
            Get updates on new deals and promotions.
          </p>
        </div>

        {/* Right panel */}
        <div className="flex flex-col justify-center gap-5 px-8 py-10 text-center sm:px-10">
          <p className="text-gray-900 text-lg font-semibold">Use code:</p>
          <button
            onClick={copyCode}
            className="relative flex items-center justify-center gap-2 rounded-lg bg-primary-main px-6 py-3 text-white font-semibold transition hover:bg-primary-main/90"
          >
            {PROMO_CODE}
            {copied ? (
              <Check className="size-5" />
            ) : (
              <Copy className="size-5" />
            )}
          </button>
          <button
            onClick={dontShowAgain}
            className="text-gray-500 text-sm transition hover:text-gray-700"
          >
            Don't show again
          </button>
        </div>
      </div>
    </div>
  );
}