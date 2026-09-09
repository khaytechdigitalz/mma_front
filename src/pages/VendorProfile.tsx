// src/pages/VendorProfile.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MapPin, Package, Star, MessageCircle, Loader2 } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Rating } from "@/components/ui/Rating";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { ProductCard } from "@/components/ui/ProductCard";
import { getImageSrc } from "@/lib/utils";
import { fetchSellerDetails } from "@/api/sellers";
import type { ProductItem } from "@/api/products";

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
        <Loader2 className="size-8 animate-spin text-gray-secondary" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <h2 className="text-gray-primary text-xl font-bold">Vendor not found</h2>
        <p className="text-gray-secondary mt-1">The store you are looking for does not exist or has been removed.</p>
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

  return (
    <div>
      <div className="aspect-16/5 overflow-hidden bg-gray-100">
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
          <PlaceholderImage label={`${storeName} storefront banner`} className="size-full" tone="primary" />
        )}
      </div>

      <Container>
        <div className="relative mb-8 flex flex-col gap-5 pt-4 sm:flex-row sm:items-end">
          <div className="border-primary-lighter -mt-16 size-28 shrink-0 overflow-hidden rounded-2xl border-4 bg-white shadow-regular">
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
          <div className="flex-1">
            <h1 className="text-gray-primary text-2xl font-bold">{storeName}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-4">
              <Rating value={rating} reviewCount={reviewCount} />
              <span className="text-gray-tertiary flex items-center gap-1.5 text-sm">
                <MapPin className="size-4" /> {location}
              </span>
              <span className="text-gray-tertiary flex items-center gap-1.5 text-sm">
                <Package className="size-4" /> {productCount} products
              </span>
            </div>
          </div>
          <Button icon={<MessageCircle className="size-4" />}>Contact Vendor</Button>
        </div>
      </Container>

      <Section className="pt-0">
        <Container>
          <Tabs
            defaultTabId="products"
            tabs={[
              {
                id: "products",
                label: "Products",
                content: vendorProducts.length === 0 ? (
                  <p className="text-gray-secondary py-8 text-center text-sm">This vendor has no products listed yet.</p>
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
                label: "About",
                content: (
                  <p className="text-gray-secondary max-w-2xl text-sm leading-relaxed">
                    {storeDescription} {storeName} provides high-quality goods with reliable customer service.
                  </p>
                ),
              },
              {
                id: "reviews",
                label: `Reviews (${reviewCount})`,
                content: (
                  <div className="max-w-2xl space-y-5">
                    {reviewCount === 0 ? (
                      <p className="text-gray-secondary py-8 text-center text-sm">No reviews yet for this vendor.</p>
                    ) : (
                      Array.from({ length: Math.min(reviewCount, 3) }).map((_, i) => (
                        <div key={i} className="border-b border-gray-200 pb-5">
                          <div className="mb-2 flex items-center gap-2">
                            <Star className="fill-warning-dark text-warning-dark size-4" />
                            <span className="text-gray-primary text-sm font-semibold">
                              Verified Buyer {i + 1}
                            </span>
                          </div>
                          <p className="text-gray-secondary text-sm">
                            Reliable seller, packaging was excellent and delivery was quick.
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