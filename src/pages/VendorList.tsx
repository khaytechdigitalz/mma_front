// src/pages/VendorList.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Package } from "lucide-react";
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
                  className="overflow-hidden rounded-2xl border border-gray-300 animate-pulse bg-white"
                >
                  <div className="aspect-16/6 bg-gray-200" />
                  <div className="relative px-5 pt-10 pb-5 space-y-3">
                    <div className="absolute -top-8 left-5 size-16 rounded-full border-4 border-white bg-gray-300" />
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : vendors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Package className="text-gray-tertiary size-16 mb-3" />
              <h3 className="text-gray-primary text-lg font-bold">No Vendors Found</h3>
              <p className="text-gray-secondary text-sm mt-1">Check back later for available stores.</p>
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
                    className="group overflow-hidden rounded-2xl border border-gray-300 transition-shadow hover:shadow-regular bg-white"
                  >
                    <div className="aspect-16/6 overflow-hidden bg-gray-100">
                      {bannerSrc ? (
                        <img
                          src={bannerSrc}
                          alt={`${storeName} cover`}
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <PlaceholderImage label={`${storeName} cover`} className="size-full" tone="primary" />
                      )}
                    </div>
                    <div className="relative px-5 pt-10 pb-5">
                      <div className="border-primary-lighter absolute -top-8 left-5 size-16 overflow-hidden rounded-full border-4 bg-white shadow-sm">
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
                          <PlaceholderImage label={storeName} className="size-full" />
                        )}
                      </div>
                      <h3 className="text-gray-primary group-hover:text-primary-main text-base font-bold line-clamp-1">
                        {storeName}
                      </h3>
                      <Rating value={rating} reviewCount={reviewCount} className="my-2" />
                      <p className="text-gray-tertiary mb-1 flex items-center gap-1.5 text-xs">
                        <MapPin className="size-3.5 shrink-0" /> {location}
                      </p>
                      <p className="text-gray-tertiary flex items-center gap-1.5 text-xs">
                        <Package className="size-3.5 shrink-0" /> {productCount} products
                      </p>
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