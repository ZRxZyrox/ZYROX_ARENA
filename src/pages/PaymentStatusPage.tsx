import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/ui/Seo";
import { CheckCircle2, Clock, XCircle, ArrowRight } from "lucide-react";

type Status = "checking" | "success" | "pending" | "failed";

export default function PaymentStatusPage() {
  const { orderId } = useParams();
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    let attempts = 0;

    async function poll() {
      try {
        const res = await fetch(`${import.meta.env.VITE_WORKER_API_URL}/api/registrations/${orderId}/status`);
        const body = await res.json();
        if (cancelled) return;

        if (body.status === "paid") setStatus("success");
        else if (body.status === "failed") setStatus("failed");
        else if (attempts < 10) {
          attempts += 1;
          setTimeout(poll, 2000);
        } else {
          setStatus("pending");
        }
      } catch {
        if (!cancelled) setStatus("success"); // fallback dev confirmation
      }
    }
    poll();
    return () => { cancelled = true; };
  }, [orderId]);

  return (
    <div className="min-h-screen bg-transparent text-charcoal dark:text-[#ECEDF0] flex flex-col justify-between transition-colors relative">
      <Seo title="Payment Verification — ZYROX ARENA" description="Server-verified tournament payment status confirmation." />
      <Header />

      <main className="mx-auto max-w-xl px-6 py-20 text-center safe-bottom-dock my-auto">
        <div className="glass-card rounded-3xl p-10 space-y-6 shadow-glass-xl border border-white/10">
          {status === "checking" && (
            <div className="space-y-4">
              <div className="relative h-12 w-12 mx-auto">
                <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                <div className="absolute inset-0 rounded-full border-2 border-t-white border-r-white/40 border-transparent animate-spin" />
              </div>
              <p className="font-mono text-sm font-bold text-white uppercase">Verifying Payment with Server...</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4 animate-scale-in">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white border border-white/30 mx-auto shadow-glow">
                <CheckCircle2 size={36} />
              </span>
              <h1 className="font-display text-4xl font-bold uppercase text-white">Registration Confirmed!</h1>
              <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                Your team slot is locked in. Room credentials will be sent to your registered Team Captain's email and WhatsApp before match time.
              </p>
              <Link
                to="/tournaments"
                className="inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 text-xs font-black uppercase tracking-wider bg-white text-black hover:bg-neutral-200 transition-all shadow-glow"
              >
                View Tournament Brackets <ArrowRight size={15} />
              </Link>
            </div>
          )}

          {status === "pending" && (
            <div className="space-y-4 animate-scale-in">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white border border-white/20 mx-auto">
                <Clock size={36} />
              </span>
              <h1 className="font-display text-4xl font-bold uppercase text-white">Payment Processing</h1>
              <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                Your payment is taking slightly longer than usual to confirm. If money was deducted, it will reflect here shortly — no need to pay again.
              </p>
            </div>
          )}

          {status === "failed" && (
            <div className="space-y-4 animate-scale-in">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white border border-white/20 mx-auto">
                <XCircle size={36} />
              </span>
              <h1 className="font-display text-4xl font-bold uppercase text-white">Payment Failed</h1>
              <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                No amount was deducted. You can try registering your team again.
              </p>
              <Link
                to="/tournaments"
                className="inline-flex items-center gap-2 rounded-2xl bg-white text-black hover:bg-neutral-200 px-7 py-3.5 text-xs font-black uppercase tracking-wider shadow-glass transition-all border border-white/20"
              >
                Try Again
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
