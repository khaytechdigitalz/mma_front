import { useEffect, useState } from "react";
import { apiClient } from "@/lib/axios";
import { getImageSrc } from "@/lib/utils";

interface AppLogoProps {
  userRole?: "master" | "seller";
  isCollapsed?: boolean;
  className?: string;
}

// Module-level cache so every <Logo> / <Watermark> instance on the page
// shares a single network request instead of each firing its own.
let logoUrlCache: string | null | undefined = undefined;
let logoFetchPromise: Promise<string | null> | null = null;

function fetchLogoUrl(): Promise<string | null> {
  if (logoUrlCache !== undefined) return Promise.resolve(logoUrlCache);
  if (logoFetchPromise) return logoFetchPromise;

  logoFetchPromise = apiClient
    .get("/front/settings")
    .then((response) => {
      const logoPath = response.data?.data?.general?.logo || null;
      logoUrlCache = logoPath ? getImageSrc(logoPath) : null;
      return logoUrlCache;
    })
    .catch((err) => {
      console.error("Failed to fetch platform logo:", err);
      logoUrlCache = null;
      return null;
    });

  return logoFetchPromise;
}

/** Shared hook: resolves the platform logo URL once and caches it for reuse. */
export function useAppLogoUrl() {
  const [url, setUrl] = useState<string | null>(logoUrlCache ?? null);
  const [loaded, setLoaded] = useState(logoUrlCache !== undefined);

  useEffect(() => {
    let cancelled = false;
    fetchLogoUrl().then((resolved) => {
      if (!cancelled) {
        setUrl(resolved);
        setLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { url, loaded };
}

/**
 * Repeats the platform logo as a subtle, tiled background watermark. Uses a
 * CSS repeating background (not N rendered <img> tags) so it scales to any
 * page length and shares the single cached logo fetch from useAppLogoUrl.
 */
export function LogoWatermarkOLD({ className }: { className?: string }) {
  const { url, loaded } = useAppLogoUrl();

  if (!loaded || !url) return null;

  return (
    <div
      aria-hidden="true"
      className={
        className ||
        "pointer-events-none absolute inset-0 z-0 opacity-[0.06] select-none"
      }
      style={{
        backgroundImage: `url(${url})`,
        backgroundRepeat: "repeat",
        backgroundSize: "140px auto",
      }}
    />
  );
}

export function LogoWatermark({ className }: { className?: string }) {
  const { url, loaded } = useAppLogoUrl();

  if (!loaded || !url) return null;

  return (
    <div
      aria-hidden="true"
      className={
        className ||
        "pointer-events-none absolute inset-0 z-0 opacity-[0.07] select-none" // Increased opacity for better visibility
      }
      style={{
        backgroundImage: `url(${url})`,
        backgroundRepeat: "repeat",
        backgroundSize: "60px auto", // Keeps it small and densely repeated
      }}
    />
  );
}

export function Logo({ isCollapsed = false, className }: AppLogoProps) {
  const { url, loaded } = useAppLogoUrl();

  // Render nothing while loading or if no logo is provided by the endpoint
  if (!loaded || !url) {
    return null;
  }

  if (isCollapsed) {
    return (
      <img
        src={url}
        alt="Logo Icon"
        width={32}
        height={32}
        className={className || "max-w-none object-contain size-8"}
      />
    );
  }

  return (
    <img
      src={url}
      alt="Logo"
      width={114}
      height={37}
      className={className || "max-w-none object-contain h-[37px] w-auto"}
    />
  );
}
