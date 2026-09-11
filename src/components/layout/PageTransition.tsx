import { motion } from "framer-motion";
import type { ReactNode } from "react";

// Kept intentionally short (0.25s) and opacity/y-only — no scale or
// blur — so it reads as "premium and quick" rather than a slow
// showcase animation that gets in the user's way on every navigation.
// `prefers-reduced-motion` is respected globally via the CSS override
// in styles/index.css.
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
