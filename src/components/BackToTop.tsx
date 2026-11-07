import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(scrollY > 400);
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);
  return (
    <button
      hidden={!visible}
      className="back-to-top"
      aria-label="Back to top"
      title="Back to top"
      onClick={() => {
        document.getElementById("home")?.focus({ preventScroll: true });
        window.scrollTo({
          top: 0,
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
      }}
    >
      <ArrowUp size={20} aria-hidden="true" />
    </button>
  );
}
