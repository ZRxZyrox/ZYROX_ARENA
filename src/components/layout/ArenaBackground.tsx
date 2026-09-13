import { memo } from "react";

const BG_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3GJaYKPxdnQG0Q9O26lu6DPmcHu/hf_20260805_192612_e00017a8-56b0-4957-935b-9ffd87663994.mp4";

function ArenaBackgroundComponent() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none"
      style={{ contain: "strict", transform: "translateZ(0)" }}
    >
      {/* High-Performance Looping Cinematic Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover scale-[1.02] transform-gpu will-change-transform"
        src={BG_VIDEO_URL}
      />

      {/* Cinematic Contrast & Legibility Overlay */}
      <div className="absolute inset-0 bg-[#08080E]/45 dark:bg-[#06060B]/60 transition-colors duration-300" />

      {/* Soft Vignette Depth Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75" />
    </div>
  );
}

const ArenaBackground = memo(ArenaBackgroundComponent);
export default ArenaBackground;
