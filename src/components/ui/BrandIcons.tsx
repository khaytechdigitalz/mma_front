import type { SVGProps } from "react";

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-8.1h2.72l.41-3.16h-3.13V7.75c0-.92.25-1.54 1.57-1.54h1.68V3.4A22 22 0 0 0 14.3 3.2c-2.5 0-4.21 1.53-4.21 4.34v2.42H7.36v3.16h2.73V21h3.41Z" />
    </svg>
  );
}

export function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 3H21.7l-6.1 7 7.2 9.5h-5.6l-4.4-5.8-5 5.8H4.9l6.5-7.5L4.5 3h5.7l4 5.3L18.9 3Zm-1 15.2h1.5L7.2 4.7H5.6l12.3 13.5Z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.94 8.5H3.56V21h3.38V8.5ZM5.25 3.2a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM21 21v-6.9c0-3.7-2-5.42-4.63-5.42a4 4 0 0 0-3.6 2h-.05V8.5H9.5c.05 1 0 12.5 0 12.5h3.37v-6.98c0-.37.03-.74.14-1a2.28 2.28 0 0 1 2.14-1.53c1.51 0 2.11 1.15 2.11 2.85V21H21Z" />
    </svg>
  );
}

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path fill="#4285F4" d="M22.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h5.9a5.04 5.04 0 0 1-2.19 3.31v2.77h3.54c2.08-1.92 3.25-4.74 3.25-8.11Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.54-2.77c-.98.66-2.24 1.05-3.74 1.05-2.87 0-5.3-1.94-6.17-4.53H2.18v2.85A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.83 14.09a6.6 6.6 0 0 1 0-4.18V7.06H2.18a11 11 0 0 0 0 9.88l3.65-2.85Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.06l3.65 2.85C6.7 7.32 9.13 5.38 12 5.38Z" />
    </svg>
  );
}
