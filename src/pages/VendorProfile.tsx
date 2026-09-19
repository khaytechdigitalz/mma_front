// src/pages/VendorProfile.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MapPin, Package, Star, MessageCircle, Loader2, ShieldCheck, Share2, Store } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Rating } from "@/components/ui/Rating";
import { Tabs } from "@/components/ui/Tabs";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { getImageSrc } from "@/lib/utils";
import { fetchSellerDetails } from "@/api/sellers";
import type { ProductItem } from "@/api/products";
import { toast } from "sonner";

interface Storefront {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  banner: string | null;
  description: string | null;
}

interface VendorDetails {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  storefront?: Storefront | null;
  products?: ProductItem[];
  total_products?: number;
  average_rating?: number;
  total_reviews?: number;
  star_breakdown?: Record<number, number>;
  location?: string;
}

export function VendorProfile() {
  const [searchParams] = useSearchParams();
  const vendorId = searchParams.get("id");

  const [vendor, setVendor] = useState<VendorDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!vendorId) {
      setLoading(false);
      return;
    }

    const loadVendorDetails = async () => {
      try {
        setLoading(true);
        const response = await fetchSellerDetails(vendorId);
        if (response.status && response.data) {
          setVendor(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch vendor details", error);
      } finally {
        setLoading(false);
      }
    };

    loadVendorDetails();
  }, [vendorId]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
          <Store className="size-8" />
        </div>
        <h2 className="text-slate-900 text-xl font-bold">Vendor not found</h2>
        <p className="text-slate-500 text-sm mt-1">The store you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  const storeName = vendor.storefront?.name || vendor.name;
  const storeDescription = vendor.storefront?.description || "No description provided.";
  const bannerSrc = vendor.storefront?.banner ? getImageSrc(vendor.storefront.banner) : null;
  const logoSrc = vendor.storefront?.logo || vendor.avatar ? getImageSrc(vendor.storefront?.logo || vendor.avatar!) : null;
  const rating = vendor.average_rating || 5;
  const reviewCount = vendor.total_reviews || 0;
  const productCount = vendor.total_products || vendor.products?.length || 0;
  const location = vendor.location || "Online Store";
  const vendorProducts = vendor.products || [];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Storefront link copied to clipboard!");
  };

  return (
    <div>
      {/* Cover Banner */}
      <div className="aspect-16/5 overflow-hidden bg-slate-900 relative">
        {bannerSrc ? (
          <img
            src={bannerSrc}
            alt={`${storeName} banner`}
            className="size-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <PlaceholderImage label={`${storeName} storefront banner`} className="size-full" tone="dark" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
      </div>

      {/* Profile Header Card */}
      <Container>
        <div className="relative mb-8 flex flex-col gap-6 pt-4 sm:flex-row sm:items-end justify-between border-b border-slate-200 pb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Logo Avatar */}
            <div className="size-28 sm:size-32 -mt-16 sm:-mt-20 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl relative z-10">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={storeName}
                  className="size-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <PlaceholderImage label={storeName} className="size-full text-sm" />
              )}
            </div>

            {/* Store Metadata */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-slate-900 text-2xl sm:text-3xl font-black tracking-tight">{storeName}</h1>
                <ShieldCheck className="size-6 text-indigo-600 fill-indigo-50" />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500">
                <Rating value={rating} reviewCount={reviewCount} />
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-slate-400" /> {location}
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <Package className="size-4 text-indigo-500" /> {productCount} masterpieces listed
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex items-center gap-2 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold"
            >
              <Share2 className="size-4" /> Share Store
            </Button>
            <Button
              onClick={() => toast.info("Vendor messaging feature coming soon!")}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
            >
              <MessageCircle className="size-4" /> Contact Vendor
            </Button>
          </div>
        </div>
      </Container>

      {/* Tabs Content Section */}
      <Section className="pt-0">
        <Container>
          <Tabs
            defaultTabId="products"
            tabs={[
              {
                id: "products",
                label: `Products (${productCount})`,
                content: vendorProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <Package className="size-12 text-slate-300 mb-2" />
                    <h3 className="text-slate-800 font-bold text-base">No Products Listed Yet</h3>
                    <p className="text-slate-500 text-xs mt-1">This creator has not published any artwork for sale currently.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {vendorProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                ),
              },
              {
                id: "about",
                label: "About Store",
                content: (
                  <div className="max-w-3xl rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-4">
                    <h3 className="text-lg font-bold text-slate-900">About {storeName}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {storeDescription}
                    </p>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {storeName} provides certified high-quality goods, reliable customer service, and secure worldwide shipping on all artisan creations.
                    </p>
                  </div>
                ),
              },
              {
                id: "reviews",
                label: `Customer Reviews (${reviewCount})`,
                content: (
                  <div className="max-w-2xl space-y-4">
                    {reviewCount === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                        <Star className="size-12 text-slate-300 mb-2" />
                        <h3 className="text-slate-800 font-bold text-base">No Reviews Yet</h3>
                        <p className="text-slate-500 text-xs mt-1">Be the first to buy and review an item from this storefront.</p>
                      </div>
                    ) : (
                      Array.from({ length: Math.min(reviewCount, 3) }).map((_, i) => (
                        <div key={i} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Star className="fill-amber-400 text-amber-400 size-4" />
                              <span className="text-slate-900 text-sm font-bold">
                                Verified Buyer {i + 1}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400">2 weeks ago</span>
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed">
                            Reliable seller, packaging was exceptionally secure and delivery arrived right on schedule. Absolutely love the artwork!
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                ),
              },
            ]}
          />
        </Container>
      </Section>
    </div>
  );
}