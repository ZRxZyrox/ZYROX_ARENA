import { useEffect, useState } from "react";

function getRemaining(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: diff <= 0,
  };
}

export default function Countdown({ target }: { target: Date }) {
  const [time, setTime] = useState(() => getRemaining(target));

  useEffect(() => {
    const id = setInterval(() => setTime(getRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (time.expired) {
    return <span className="font-mono text-xs text-charcoal-muted dark:text-[#7A7B88] font-bold">Registration closed</span>;
  }

  const boxes = [
    { v: time.days, l: "DAYS" },
    { v: time.hours, l: "HRS" },
    { v: time.minutes, l: "MIN" },
    { v: time.seconds, l: "SEC" },
  ];

  return (
    <div className="flex gap-2">
      {boxes.map((b) => (
        <div key={b.l} className="min-w-[48px] rounded-xl glass-card border border-charcoal/10 dark:border-white/8 px-3 py-2 text-center shadow-glass">
          <b className="block font-mono text-lg font-bold text-charcoal dark:text-white">{String(b.v).padStart(2, "0")}</b>
          <small className="text-[9px] font-mono text-charcoal-muted dark:text-[#7A7B88] font-bold">{b.l}</small>
        </div>
      ))}
    </div>
  );
}
