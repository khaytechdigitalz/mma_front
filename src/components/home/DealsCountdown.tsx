// src/components/home/DealsCountdown.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Section } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Button } from "@/components/ui/Button";
import { fetchTodayDeals } from "@/api/home-products";
import type { ProductItem } from "@/api/products";
import { getImageSrc } from "@/lib/utils";

function getTimeLeft(target: number) {
  const diff = Math.max(0, target - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export function DealsCountdown() {
  const [target] = useState(() => Date.now() + 1000 * 60 * 60 * 62);
  const [time, setTime] = useState(() => getTimeLeft(target));
  const [dealProduct, setDealProduct] = useState<ProductItem | null>(null);

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
          // Pick a random product from the today's deal list
          const randomIndex = Math.floor(Math.random() * res.data.length);
          setDealProduct(res.data[randomIndex]);
        }
      } catch (err) {
        console.error("Failed to load today's deal", err);
      }
    }
    loadDeals();
    return () => {
      cancelled = true;
    };
  }, []);

  const units: Array<[string, number]> = [
    ["Days", time.days],
    ["Hours", time.hours],
    ["Min", time.minutes],
    ["Sec", time.seconds],
  ];

  return (
    <Section>
      <Container>
        <div className="bg-general-cta grid items-center gap-8 overflow-hidden rounded-3xl bg-gray-900 px-6 py-10 md:grid-cols-2 md:px-14">
          <div>
            <span className="bg-success-light mb-4 inline-block rounded-full px-3 py-1 text-xs font-medium text-gray-800">
              Deal of the Day
            </span>
            <h2 className="mb-4 text-2xl font-extrabold text-white md:text-32">
              {dealProduct ? dealProduct.name : "Grab Top Deals Before It's Gone"}
            </h2>
            <p className="text-gray-300 mb-6 text-sm">
              {dealProduct?.short_description || "Discover special discounts on our finest selection of curated items."}
            </p>
            <div className="mb-6 flex gap-3">
              {units.map(([label, value]) => (
                <div
                  key={label}
                  className="flex w-16 flex-col items-center rounded-xl bg-white/10 py-2.5"
                >
                  <span className="text-lg font-bold text-white">
                    {String(value).padStart(2, "0")}
                  </span>
                  <span className="text-xs text-white/70">{label}</span>
                </div>
              ))}
            </div>
            <Link to={dealProduct ? `/product-details-1?id=${dealProduct.id}` : "/products"}>
              <Button>Shop the Deal</Button>
            </Link>
          </div>
          <div className="aspect-4/3 overflow-hidden rounded-2xl bg-gray-800">
            {dealProduct?.thumbnail ? (
              <img
                src={getImageSrc(dealProduct.thumbnail)}
                alt={dealProduct.name}
                className="size-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/placeholder.png";
                }}
              />
            ) : (
              <PlaceholderImage label="Weekly deal bundle" className="size-full" tone="dark" />
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}