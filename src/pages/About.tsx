import { useState } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  Clock, 
  Navigation, 
  Palette, 
  ShieldCheck, 
  Globe2, 
  Truck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  ShoppingBag, 
  HeartHandshake 
} from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";

const inputClass =
  "border-gray-tertiary/32 h-12 w-full rounded-xl border px-4 text-sm focus:outline-0 focus:border-primary-main focus:ring-2 focus:ring-primary-main/20 transition-all";

export function About() {
 
  // Impact metrics counters
  const stats = [
    { label: "Active African Artists", value: "2,500+", icon: Users },
    { label: "Original Artworks Sold", value: "14,000+", icon: ShoppingBag },
    { label: "Countries Delivered", value: "48+", icon: Globe2 },
    { label: "Collector Satisfaction", value: "99.2%", icon: HeartHandshake },
  ];

  // Core brand values
  const values = [
    {
      icon: ShieldCheck,
      title: "Guaranteed Authenticity",
      description: "Every piece listed on MMA comes directly from verified artists, complete with signed certificates of authenticity.",
    },
    {
      icon: HeartHandshake,
      title: "Direct Artist Empowerment",
      description: "We bridge creators directly to global markets, ensuring fair compensation and sustainable livelihoods for local talents.",
    },
    {
      icon: Truck,
      title: "Seamless Global Logistics",
      description: "Integrated multi-vendor courier partnerships allow safe packaging and tracked door-to-door delivery worldwide.",
    },
    {
      icon: Palette,
      title: "Cultural Heritage",
      description: "Celebrating rich heritage—from historic Benin bronze techniques to modern contemporary African expression.",
    },
  ];

  return (
    <div className="bg-gray-50/30">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} title="About Us" />

      {/* Hero Section */}
      <Section className="pt-8 pb-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-lighter/40 border border-primary-main/20 text-primary-main text-xs font-bold">
                <Sparkles className="size-3.5" />
                <span>Empowering Global African Artistry</span>
              </div>
              <h1 className="text-gray-primary text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Connecting African Creators to World-Class Art Collectors
              </h1>
              <p className="text-gray-secondary text-base sm:text-lg leading-relaxed">
                Market My Art (MMA) is the premier digital gateway dedicated to magnifying authentic African paintings, sculptures, and craft traditions. We eliminate international trade barriers so master creators focus on what they do best: creating breathtaking art.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-2xs">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  Direct Vendor Payouts
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-2xs">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  Verified Art Provenance
                </div>
              </div>
            </div>

            {/* Hero Gallery Grid */}
            <div className="grid grid-cols-2 gap-4 relative">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm aspect-4/5 group">
                  <img
                    src="https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcSVoPEZLVgamMzHOUbBU9WPG0x98idRdxMkDj5MD2vBajozoXfnc4gLgXhO1z8bQdimH01uFjvg_g80I2o"
                    alt="African painter in studio creating canvas art"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="rounded-2xl bg-primary-main text-white p-5 shadow-md">
                  <p className="text-xs uppercase font-bold tracking-wider text-primary-lighter opacity-90">Headquarters</p>
                  <p className="text-sm font-bold mt-1">Benin City, Edo State, Nigeria</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm aspect-square group">
                  <img
                    src="https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQOFi1wbzA5E4-qurdfyH8um9t6u_HpdMn95XrVLHKEusA2a1gw_34B1o7qety637ly0bJZeNnfE162Z2E"
                    alt="African art exhibition gallery"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm aspect-4/3 group">
                  <img
                    src="https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcS-h5HgJi2btdm_I6T2ipmKYPF8lTy8BhATC1wL464IaOq4Ye8Tap2pxda_5-ifLR_JrCNe6r90qUVujV4"
                    alt="Sculptor workshop"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Impact Counters Section */}
      <Section className="py-12 bg-white border-y border-gray-200/80">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="p-4 rounded-2xl bg-gray-50/60 border border-gray-100 hover:border-primary-main/30 transition-all">
                <span className="size-10 rounded-xl bg-primary-lighter/40 text-primary-main mx-auto mb-3 flex items-center justify-center">
                  <Icon className="size-5" />
                </span>
                <p className="text-gray-primary text-2xl sm:text-3xl font-black tracking-tight">{value}</p>
                <p className="text-gray-500 text-xs font-semibold mt-1">{label}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Mission & Vision Section */}
      <Section className="py-16">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-gray-primary text-2xl sm:text-3xl font-bold tracking-tight">Our Purpose & Vision</h2>
            <p className="text-gray-500 text-sm mt-2">
              Building the infrastructure to safeguard cultural art while granting independent creators access to global wealth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div className="size-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                <Sparkles className="size-7" />
              </div>
              <div className="space-y-3">
                <h3 className="text-gray-primary text-xl font-bold">Our Mission</h3>
                <p className="text-gray-secondary text-sm leading-relaxed">
                  To provide an end-to-end commerce ecosystem featuring storefront management, automated split-shipping logistics, and secure international payouts, allowing African artists to build sustainable creative businesses.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div className="size-14 rounded-2xl bg-primary-lighter/50 text-primary-main flex items-center justify-center mb-6">
                <Globe2 className="size-7" />
              </div>
              <div className="space-y-3">
                <h3 className="text-gray-primary text-xl font-bold">Our Vision</h3>
                <p className="text-gray-secondary text-sm leading-relaxed">
                  To become the definitive worldwide marketplace for African art and craftsmanship—where every art enthusiast can seamlessly discover, verify, and collect original pieces directly from the source.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Core Brand Values */}
      <Section className="py-16 bg-white border-t border-gray-200/80">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-gray-primary text-2xl sm:text-3xl font-bold tracking-tight">Why Collectors Choose MMA</h2>
            <p className="text-gray-500 text-sm mt-2">
              We maintain strict quality control and authentic origins for every single item on our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs hover:border-primary-main/40 transition-all flex flex-col justify-between">
                <div>
                  <span className="size-11 rounded-xl bg-primary-lighter/30 text-primary-main flex items-center justify-center mb-4">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="text-gray-primary text-base font-bold mb-2">{title}</h3>
                  <p className="text-gray-secondary text-xs leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Dual Call to Action Banner */}
      <Section className="py-16">
        <Container>
          <div className="rounded-3xl bg-gray-900 text-white p-8 sm:p-12 relative overflow-hidden shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
              <div className="space-y-4">
                <span className="text-primary-lighter font-bold text-xs uppercase tracking-wider">Join Our Movement</span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
                  Are You an Artist Ready to Sell Globally?
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Set up your custom storefront, set your own prices, and reach thousands of verified art collectors around the globe today.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
                <a href="/register" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary-main text-white font-bold text-sm shadow-md hover:bg-primary-main/90 transition-all">
                  Open Your Storefront
                  <ArrowRight className="size-4" />
                </a>
                <a href="/products" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 text-white font-bold text-sm backdrop-blur-xs hover:bg-white/20 transition-all border border-white/20">
                  Explore Artwork
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      
    </div>
  );
}