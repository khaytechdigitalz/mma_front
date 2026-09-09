import { useEffect, useRef, useState, type ReactNode } from "react";

export function Dropdown({
  trigger,
  children,
  panelClassName = "",
}: {
  trigger: (opts: { open: boolean; toggle: () => void }) => ReactNode;
  children: (close: () => void) => ReactNode;
  panelClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {trigger({ open, toggle: () => setOpen((v) => !v) })}
      {open && (
        <div
          className={`ring-opacity-5 absolute z-50 mt-2 rounded-lg border border-gray-100 bg-white py-1 shadow-xl ring-1 ring-black ${panelClassName}`}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}
