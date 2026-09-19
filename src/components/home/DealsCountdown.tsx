// src/components/home/DealsCountdown.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Flame, ArrowRight, Sparkles } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Button } from "@/components/ui/Button";
import { fetchTodayDeals } from "@/api/home-products";
import type { ProductItem } from "@/api/products";
import { getImageSrc, formatCurrency, cn } from "@/lib/utils";

function getTimeLeft(target: number) {
  const diff = Math.max(0, target - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export function DealsCountdown() {
  const [target] = useState(() => Date.now() + 1000 * 60 * 60 * 36); // 36-hour countdown timer
  const [time, setTime] = useState(() => getTimeLeft(target));
  const [deals, setDeals] = useState<ProductItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  useEffect(() => {
    let cancelled = false;
    async function loadDeals() {
      try {
        const res = await fetchTodayDeals();
        if (!cancelled && res?.data && res.data.length > 0) {
          setDeals(res.data);
        }
      } catch (err) {
        console.error("Failed to load today's deals", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadDeals();
    return () => {
      cancelled = true;
    };
  }, []);

  const currentDeal = deals[currentIndex] || null;

  const units: Array<[string, number]> = [
    ["Days", time.days],
    ["Hours", time.hours],
    ["Mins", time.minutes],
    ["Secs", time.seconds],
  ];

  if (loading) {
    return (
      <Section>
        <Container>
          <div className="h-80 rounded-3xl bg-gray-900 animate-pulse flex items-center justify-center">
            <div className="text-white/40 text-sm">Loading curated deals...</div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 shadow-2xl border border-slate-800">
          {/* Background Decorative Glow */}
          <div className="absolute -right-20 -top-20 size-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 size-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          {/* Using flex-col-reverse on mobile so the image preview appears at the top */}
          <div className="flex flex-col-reverse md:grid items-center gap-8 md:grid-cols-12 relative z-10">
            {/* Left Column: Deal Metadata & Countdown (Span 7 cols on desktop) */}
            <div className="space-y-4 md:col-span-7 w-full">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 text-xs font-semibold text-indigo-400">
                <Flame className="size-3.5 text-orange-400 animate-pulse" />
                Limited Time Deal of the Day
              </div>

              <div>
                <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white mb-2 line-clamp-1">
                  {currentDeal ? currentDeal.name : "Exclusive Masterwork Collection"}
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-2">
                  {currentDeal?.short_description || "Discover special collector discounts on our finest curated selection of artisan masterpieces."}
                </p>
              </div>

              {/* Pricing & Discount Tag */}
              {currentDeal && (
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                    {formatCurrency(currentDeal.purchase_price)}
                  </span>
                  {currentDeal.discount > 0 && (
                    <span className="rounded-full bg-red-500/20 border border-red-500/30 px-3 py-0.5 text-xs font-bold text-red-400 uppercase tracking-wider">
                      Save {currentDeal.discount}% OFF
                    </span>
                  )}
                </div>
              )}

              {/* Countdown Timer Blocks */}
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
                  <Sparkles className="size-3.5 text-indigo-400" /> Offer expires in:
                </span>
                <div className="flex gap-2.5">
                  {units.map(([label, value]) => (
                    <div
                      key={label}
                      className="flex w-16 sm:w-18 flex-col items-center rounded-2xl bg-white/5 border border-white/10 py-2.5 shadow-inner backdrop-blur-md"
                    >
                      <span className="text-lg sm:text-xl font-black text-white tracking-tight">
                        {String(value).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] uppercase font-medium text-slate-400 mt-0.5">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons & Deal Switcher Dots */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to={currentDeal ? `/product-details-1?id=${currentDeal.id}` : "/products"}>
                  <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2 text-sm">
                    Shop This Deal <ArrowRight className="size-4" />
                  </Button>
                </Link>

                {/* Multiple Deals Pagination Indicators */}
                {deals.length > 1 && (
                  <div className="flex items-center gap-1.5 ml-auto">
                    {deals.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={cn(
                          "h-2 rounded-full transition-all duration-300 cursor-pointer",
                          currentIndex === idx ? "w-6 bg-indigo-500" : "w-2 bg-white/25 hover:bg-white/50",
                        )}
                        aria-label={`Switch to deal ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Deal Product Image Preview (Span 5 cols on desktop, appears on top on mobile) */}
            <div className="relative group md:col-span-5 w-full">
              <div className="aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 shadow-xl relative">
                {currentDeal?.thumbnail ? (
                  <img
                    src={getImageSrc(currentDeal.thumbnail)}
                    alt={currentDeal.name}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/placeholder.png";
                    }}
                  />
                ) : (
                  <PlaceholderImage label="Deal masterwork preview" className="size-full" tone="dark" />
                )}
                
                {/* Floating Badge */}
                <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-lg text-xs font-bold text-white shadow">
                  Deal #{currentIndex + 1} of {deals.length || 1}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}