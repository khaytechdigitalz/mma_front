import { Truck, ShieldCheck, RotateCcw, Headset } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";

const features = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
  { icon: ShieldCheck, title: "Secure Payment", desc: "100% protected checkout" },
  { icon: RotateCcw, title: "Easy Returns", desc: "14-day return policy" },
  { icon: Headset, title: "24/7 Support", desc: "Dedicated customer care" },
];

export function TrustBadges() {
  return (
    <Section className="py-8">
      <Container>
        <div className="grid grid-cols-2 gap-6 rounded-2xl border border-gray-300 p-6 md:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="bg-primary-lighter text-primary-main flex size-11 shrink-0 items-center justify-center rounded-full">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-gray-primary text-sm font-semibold">{title}</p>
                <p className="text-gray-tertiary text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
