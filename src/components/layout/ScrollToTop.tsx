import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="bg-primary-main text-success-light fixed right-5 bottom-20 z-40 flex size-11 cursor-pointer items-center justify-center rounded-full shadow-lg xl:bottom-5"
      aria-label="Scroll to top"
    >
      <ArrowUp className="size-5" />
    </button>
  );
}
