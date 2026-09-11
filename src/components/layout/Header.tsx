import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import UserProfileModal from "@/components/auth/UserProfileModal";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut, openAuthModal } = useAuth();
  const [userDropdown, setUserDropdown] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setUserDropdown(false);
  }, [location.pathname]);

  return (
    <>
      {/* Spacer so content doesn't overlap */}
      <div className="h-4" />

      <header
        className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl transition-all duration-300 ${
          scrolled
            ? "glass-nav rounded-full px-5 py-1.5 shadow-glass"
            : "glass-nav rounded-full px-5 py-2 shadow-glass"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-neon via-gold to-coral shadow-warm group-hover:shadow-glow transition-shadow">
              <span className="font-display text-xs font-black text-white">Z</span>
            </span>
            <span className="font-display text-base font-bold tracking-wide text-charcoal dark:text-white">
              ZYROX <span className="text-gradient-warm">ARENA</span>
            </span>
          </Link>

          {/* Center: Live Platform Status Pill */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/75 dark:bg-white/8 border border-white/90 dark:border-white/12 shadow-glass text-xs font-medium text-charcoal dark:text-[#ECEDF0] backdrop-blur-xl">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon" />
            </span>
            <span className="font-bold text-neon uppercase tracking-wider text-[10px]">LIVE ARENA</span>
            <span className="text-charcoal/20 dark:text-white/20">|</span>
            <span className="text-charcoal-muted dark:text-[#7A7B88] font-mono text-[11px]">Instant Brackets • Razorpay Verified</span>
          </div>

          {/* Desktop CTA / User Profile + Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Day/Night Toggle */}
            <ThemeToggle />

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdown((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-charcoal/10 dark:border-white/12 bg-ivory-warm dark:bg-white/8 px-3.5 py-1.5 text-xs font-bold text-charcoal dark:text-white hover:border-gold transition-all"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 text-gold font-bold font-display">
                    {user.fullName[0]?.toUpperCase() || "P"}
                  </span>
                  <span>{(user.fullName || user.email).split(" ")[0]}</span>
                </button>

                <AnimatePresence>
                  {userDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-52 rounded-2xl glass-card p-2 shadow-glass-lg border border-charcoal/10 dark:border-white/10"
                    >
                      <div className="px-3 py-2 border-b border-charcoal/8 dark:border-white/8 mb-1">
                        <p className="text-xs font-bold text-charcoal dark:text-white">{user.fullName}</p>
                        <p className="text-[10px] text-charcoal-muted dark:text-[#7A7B88] font-mono truncate">{user.email}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(true);
                          setUserDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-charcoal dark:text-white hover:bg-neon/10 hover:text-neon rounded-xl transition-all flex items-center gap-2"
                      >
                        <User size={13} /> My Profile &amp; Wallet 👤
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          signOut();
                          setUserDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-coral hover:bg-coral/10 rounded-xl transition-all flex items-center gap-2 border-t border-charcoal/5 dark:border-white/5 mt-1 pt-2"
                      >
                        <LogOut size={13} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  className="rounded-full px-3.5 py-1.5 text-xs font-bold text-charcoal dark:text-white hover:bg-white/60 dark:hover:bg-white/10 transition-all flex items-center gap-1.5"
                >
                  <LogIn size={13} /> Sign In
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal("signup")}
                  className="shimmer-btn rounded-full px-4 py-1.5 text-xs font-bold text-white shadow-glow transition-transform hover:scale-105 flex items-center gap-1.5"
                >
                  <UserPlus size={13} /> Register
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* User Profile Modal Popup */}
      <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}
