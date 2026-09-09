import { useAppLogoUrl } from "@/components/ui/Logo";

/**
 * Faint centered logo overlay for product images (card thumbnails and the
 * product detail preview). Shares the single cached logo fetch from
 * useAppLogoUrl, so it adds no extra network requests.
 */
export function ProductImageWatermark({ className }: { className?: string }) {
  const { url, loaded } = useAppLogoUrl();

  if (!loaded || !url) return null;

  return (
    <img
      src={url}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={
        className ||
        "pointer-events-none absolute inset-0 m-auto max-h-[40%] max-w-[40%] object-contain opacity-20 select-none"
      }
    />
  );
}
