import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import UserProfileModal from "@/components/auth/UserProfileModal";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut, openAuthModal } = useAuth();
  const [userDropdown, setUserDropdown] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
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
        className={`fixed top-2.5 left-0 right-0 mx-auto z-50 w-[calc(100%-2rem)] max-w-6xl transition-all duration-300 fps-120 liquid-glass-specular ${scrolled
          ? "glass-nav rounded-full px-4 sm:px-5 py-1 shadow-glass"
          : "glass-nav rounded-full px-4 sm:px-5 py-1.5 shadow-glass"
          }`}
      >
        {/* Specular curved liquid rim highlight */}
        <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/90 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-x-12 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />

        {/* Ambient Moving Liquid Wave Background Effect (120 FPS GPU accelerated) */}
        <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none z-0 opacity-55 [contain:strict] [transform:translateZ(0)]">
          {/* Edge vignette fades */}
          <div className="absolute inset-y-0 left-0 z-10 w-20 sm:w-32 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-y-0 right-0 z-10 w-20 sm:w-32 bg-gradient-to-l from-black/90 via-black/40 to-transparent" />

          {/* Central subtle guideline */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/[0.06] z-0" />

          {/* Looping Fluid Wave Stream (120 FPS hardware accelerated) */}
          <div className="flex animate-wave-flow whitespace-nowrap items-center w-max h-full fps-120 [transform:translateZ(0)]">
            {[0, 1].map((copyIndex) => (
              <div key={copyIndex} className="flex-shrink-0 w-[1200px] h-full relative flex items-center">
                <svg
                  className="w-[1200px] h-full"
                  viewBox="0 0 1200 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id={`hdrWaveGrad1-${copyIndex}`} x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.2" />
                      <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="#A1A1AA" stopOpacity="0.4" />
                      <stop offset="75%" stopColor="#FFFFFF" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
                    </linearGradient>

                    <linearGradient id={`hdrWaveGrad2-${copyIndex}`} x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
                      <stop offset="35%" stopColor="#E4E4E7" stopOpacity="0.4" />
                      <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.4" />
                    </linearGradient>

                    <linearGradient id={`hdrLiquidFill-${copyIndex}`} x1="0" y1="8" x2="0" y2="36" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.08" />
                      <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.02" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Translucent underfill */}
                  <path
                    d="M 0 18 C 75 7, 75 7, 150 18 C 225 29, 225 29, 300 18 C 375 7, 375 7, 450 18 C 525 29, 525 29, 600 18 C 675 7, 675 7, 750 18 C 825 29, 825 29, 900 18 C 975 7, 975 7, 1050 18 C 1125 29, 1125 29, 1200 18 L 1200 36 L 0 36 Z"
                    fill={`url(#hdrLiquidFill-${copyIndex})`}
                  />

                  {/* Secondary ripple wave */}
                  <path
                    d="M 0 18 C 50 12, 50 12, 100 18 C 150 24, 150 24, 200 18 C 250 12, 250 12, 300 18 C 350 24, 350 24, 400 18 C 450 12, 450 12, 500 18 C 550 24, 550 24, 600 18 C 650 12, 650 12, 700 18 C 750 24, 750 24, 800 18 C 850 12, 850 12, 900 18 C 950 24, 950 24, 1000 18 C 1050 12, 1050 12, 1100 18 C 1150 24, 1150 24, 1200 18"
                    stroke={`url(#hdrWaveGrad2-${copyIndex})`}
                    strokeWidth="0.9"
                    strokeDasharray="4 2"
                  />

                  {/* Primary flowing wave: outer soft glow halo (pure GPU vector) */}
                  <path
                    d="M 0 18 C 75 7, 75 7, 150 18 C 225 29, 225 29, 300 18 C 375 7, 375 7, 450 18 C 525 29, 525 29, 600 18 C 675 7, 675 7, 750 18 C 825 29, 825 29, 900 18 C 975 7, 975 7, 1050 18 C 1125 29, 1125 29, 1200 18"
                    stroke="#FFFFFF"
                    strokeWidth="3.2"
                    strokeOpacity="0.22"
                    strokeLinecap="round"
                  />

                  {/* Primary flowing wave: core line */}
                  <path
                    d="M 0 18 C 75 7, 75 7, 150 18 C 225 29, 225 29, 300 18 C 375 7, 375 7, 450 18 C 525 29, 525 29, 600 18 C 675 7, 675 7, 750 18 C 825 29, 825 29, 900 18 C 975 7, 975 7, 1050 18 C 1125 29, 1125 29, 1200 18"
                    stroke={`url(#hdrWaveGrad1-${copyIndex})`}
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />

                  {/* Energy crest pips (pure concentric GPU vector glow) */}
                  {[
                    { x: 75, y: 8 },
                    { x: 225, y: 28 },
                    { x: 375, y: 8 },
                    { x: 525, y: 28 },
                    { x: 675, y: 8 },
                    { x: 825, y: 28 },
                    { x: 975, y: 8 },
                    { x: 1125, y: 28 },
                  ].map((pt, idx) => (
                    <g key={idx} transform={`translate(${pt.x}, ${pt.y})`}>
                      <circle r="4" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                      <circle r="2.5" fill="rgba(255,255,255,0.22)" />
                      <circle r="1.5" fill="#FFFFFF" />
                    </g>
                  ))}
                </svg>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between relative z-10">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <span className="font-display text-xs sm:text-sm font-extrabold tracking-[0.2em] text-white uppercase group-hover:text-neutral-200 transition-colors">
              ZYROX <span className="text-gradient-warm">ARENA</span>
            </span>
          </Link>

          {/* Center: Live Platform Status Pill with Liquid Glass */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full liquid-glass border border-white/25 shadow-glass text-xs font-medium text-white">
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white shadow-[0_0_6px_#fff]" />
            </span>
            <span className="font-mono font-bold text-white uppercase tracking-[0.14em] text-[9px]">LIVE ARENA</span>
            <span className="text-white/20">|</span>
            <span className="text-neutral-300 font-mono text-[10px]">Zyro-Shield is Securing</span>
          </div>

          {/* Desktop CTA / User Profile (Theme Toggle Removed) */}
          <div className="flex items-center gap-2 sm:gap-3">

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdown((prev) => !prev)}
                  className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white hover:border-white transition-all"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-black font-bold font-display text-[10px]">
                    {user.fullName[0]?.toUpperCase() || "P"}
                  </span>
                  <span className="text-xs">{(user.fullName || user.email).split(" ")[0]}</span>
                </button>

                <AnimatePresence>
                  {userDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-52 rounded-2xl glass-card p-2 shadow-glass-lg border border-white/20"
                    >
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <p className="text-xs font-bold text-white">{user.fullName}</p>
                        <p className="text-[10px] text-neutral-400 font-mono truncate">{user.email}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(true);
                          setUserDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-white hover:bg-white/15 rounded-xl transition-all flex items-center gap-2"
                      >
                        <User size={13} /> My Profile &amp; Wallet 👤
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          signOut();
                          setUserDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-neutral-300 hover:text-white hover:bg-white/10 rounded-xl transition-all flex items-center gap-2 border-t border-white/10 mt-1 pt-2"
                      >
                        <LogOut size={13} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  className="rounded-full px-3 py-1 text-xs font-bold text-white border border-white/20 hover:bg-white/10 transition-all flex items-center gap-1"
                >
                  <LogIn size={12} /> Sign In
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal("signup")}
                  className="rounded-full px-3.5 py-1 text-xs font-bold text-black bg-white hover:bg-neutral-200 shadow-[0_0_16px_rgba(255,255,255,0.35)] transition-transform hover:scale-105 flex items-center gap-1"
                >
                  <UserPlus size={12} /> Register
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
