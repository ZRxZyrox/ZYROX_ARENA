import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Trophy,
  Users,
  Award,
  Image as ImageIcon,
  BookOpen,
  HelpCircle,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  to: string;
  icon: typeof Home;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", to: "/", icon: Home },
  { id: "tournaments", label: "Tournaments", to: "/tournaments", icon: Trophy, badge: "LIVE" },
  { id: "teams", label: "Teams", to: "/teams", icon: Users },
  { id: "results", label: "Results", to: "/results", icon: Award },
  { id: "gallery", label: "Gallery", to: "/gallery", icon: ImageIcon },
  { id: "rules", label: "Rules", to: "/rules", icon: BookOpen },
  { id: "faq", label: "FAQ", to: "/faq", icon: HelpCircle },
];

export default function LiquidGlassBottomNav() {
  const location = useLocation();

  return (
    <aside
      aria-label="Liquid Glass Bottom Navigation"
      className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-1.5rem)]"
    >
      <motion.nav
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="liquid-glass-dock liquid-glass-specular rounded-full px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-0.5 sm:gap-1 shadow-2xl backdrop-blur-3xl overflow-x-auto no-scrollbar max-w-full"
      >
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.to === "/"
              ? location.pathname === "/"
              : location.pathname === item.to ||
                (item.to.startsWith("/tournaments") && location.pathname.startsWith("/tournaments"));

          return (
            <Link
              key={item.id}
              to={item.to}
              className="relative group flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full transition-all duration-300 select-none shrink-0"
            >
              {/* Liquid active pill glide */}
              {isActive && (
                <motion.div
                  layoutId="liquid-active-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-neon/20 via-gold/15 to-coral/15 dark:from-neon/25 dark:via-neon/10 dark:to-gold/10 border border-neon/35 shadow-[0_4px_16px_rgba(123,92,255,0.25)]"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}

              {/* Liquid hover shimmer aura */}
              <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-white/45 dark:bg-white/8 transition-opacity duration-200 pointer-events-none" />

              {/* Icon Container with optional pulse badge */}
              <div className="relative flex items-center justify-center">
                <item.icon
                  size={17}
                  className={`transition-all duration-300 ${
                    isActive
                      ? "text-neon scale-110 drop-shadow-[0_2px_8px_rgba(123,92,255,0.45)]"
                      : "text-charcoal-muted dark:text-[#7A7B88] group-hover:text-charcoal dark:group-hover:text-white group-hover:scale-105"
                  }`}
                />

                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-coral" />
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`relative text-[11px] sm:text-xs font-bold tracking-tight transition-colors duration-200 whitespace-nowrap ${
                  isActive ? "text-charcoal dark:text-white" : "text-charcoal-muted dark:text-[#7A7B88] group-hover:text-charcoal dark:group-hover:text-white"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </motion.nav>
    </aside>
  );
}
