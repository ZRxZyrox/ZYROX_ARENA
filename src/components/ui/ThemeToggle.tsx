import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`
        relative flex items-center justify-center
        h-9 w-9 rounded-full
        transition-all duration-300
        ${isDark
          ? "bg-white/8 border border-white/12 hover:bg-white/14 hover:border-neon/30 shadow-[0_0_16px_rgba(123,92,255,0.15)]"
          : "bg-charcoal/6 border border-charcoal/10 hover:bg-charcoal/12 hover:border-gold/40 shadow-glass"
        }
      `}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center justify-center"
          >
            <Moon size={16} className="text-neon drop-shadow-[0_0_6px_rgba(123,92,255,0.5)]" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center justify-center"
          >
            <Sun size={16} className="text-gold drop-shadow-[0_0_6px_rgba(201,168,118,0.5)]" />
          </motion.span>
        )}
      </AnimatePresence>

      {/* Subtle glow ring on hover */}
      <span
        className={`
          absolute inset-0 rounded-full opacity-0 hover:opacity-100
          transition-opacity duration-300 pointer-events-none
          ${isDark
            ? "shadow-[inset_0_0_8px_rgba(123,92,255,0.2)]"
            : "shadow-[inset_0_0_8px_rgba(201,168,118,0.2)]"
          }
        `}
      />
    </button>
  );
}
