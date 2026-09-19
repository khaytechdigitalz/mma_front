// src/pages/VendorList.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Package, Store, ShieldCheck, ArrowRight } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Rating } from "@/components/ui/Rating";
import { getImageSrc } from "@/lib/utils";
import { fetchSellers, type VendorItem } from "@/api/sellers";

export function VendorList() {
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadSellers = async () => {
      try {
        setLoading(true);
        const response = await fetchSellers();
        if (response.status && response.data) {
          // Handles Laravel paginator structure or direct arrays
          const paginatedData = response.data;
          setVendors(paginatedData.data || paginatedData);
        }
      } catch (error) {
        console.error("Failed to fetch vendors", error);
      } finally {
        setLoading(false);
      }
    };

    loadSellers();
  }, []);

  return (
    <div>
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Vendors" }]}
        title="All Vendors"
      />
      <Section>
        <Container>
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-slate-200/60 shadow-xs animate-pulse bg-white"
                >
                  <div className="aspect-16/6 bg-slate-100" />
                  <div className="relative px-6 pt-10 pb-6 space-y-3">
                    <div className="absolute -top-8 left-6 size-16 rounded-full border-4 border-white bg-slate-200" />
                    <div className="h-5 bg-slate-100 rounded w-3/4" />
                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                    <div className="h-3 bg-slate-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : vendors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                <Store className="size-8" />
              </div>
              <h3 className="text-slate-900 text-lg font-bold">No Vendors Found</h3>
              <p className="text-slate-500 text-sm mt-1">Check back later for available creator stores.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vendors.map((vendor) => {
                const storeName = vendor.storefront?.name || vendor.name;
                const bannerSrc = vendor.storefront?.banner ? getImageSrc(vendor.storefront.banner) : null;
                const logoSrc = vendor.storefront?.logo || vendor.avatar ? getImageSrc(vendor.storefront?.logo || vendor.avatar!) : null;
                const rating = vendor.average_rating || 5;
                const reviewCount = vendor.total_reviews || 0;
                const productCount = vendor.total_products || 0;
                const location = vendor.location || "Online Store";

                return (
                  <Link
                    key={vendor.id}
                    to={`/vendor-profile?id=${vendor.id}`}
                    className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-500/30 flex flex-col justify-between"
                  >
                    <div>
                      {/* Cover Banner */}
                      <div className="aspect-16/6 overflow-hidden bg-slate-100 relative">
                        {bannerSrc ? (
                          <img
                            src={bannerSrc}
                            alt={`${storeName} cover`}
                            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <PlaceholderImage label={`${storeName} cover`} className="size-full" tone="primary" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent" />
                      </div>

                      {/* Content Section */}
                      <div className="relative px-6 pt-9 pb-5">
                        {/* Avatar / Logo */}
                        <div className="absolute -top-8 left-6 size-16 overflow-hidden rounded-full border-4 border-white bg-white shadow-md">
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
                            <PlaceholderImage label={storeName} className="size-full text-xs" />
                          )}
                        </div>

                        {/* Store Title & Verified Badge */}
                        <div className="flex items-center gap-1.5 mb-1">
                          <h3 className="text-slate-900 group-hover:text-indigo-600 text-base font-bold tracking-tight transition-colors line-clamp-1">
                            {storeName}
                          </h3>
                          <ShieldCheck className="size-4 text-indigo-600 shrink-0 fill-indigo-50" />
                        </div>

                        {/* Rating Component */}
                        <Rating value={rating} reviewCount={reviewCount} className="my-2" />

                        {/* Location & Product Badges */}
                        <div className="flex flex-wrap items-center gap-2 mt-3.5 pt-3 border-t border-slate-100">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                            <MapPin className="size-3 text-slate-400 shrink-0" /> {location}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                            <Package className="size-3 text-indigo-500 shrink-0" /> {productCount} items
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Action Bar */}
                    <div className="px-6 py-3.5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:bg-indigo-50/40 transition-colors">
                      <span>Explore Storefront</span>
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}