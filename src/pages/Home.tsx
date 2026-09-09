// src/pages/Home.tsx
import { useEffect, useState } from "react";
import { HeroSlider } from "@/components/home/HeroSlider";
import { TrustBadges } from "@/components/home/TrustBadges";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { BestSellingTabs } from "@/components/home/BestSellingTabs";
import { DealsCountdown } from "@/components/home/DealsCountdown";
import { ProductSlider } from "@/components/home/ProductSlider";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { BlogSection } from "@/components/home/BlogSection";
import { fetchFeaturedProducts, fetchNewArrivals } from "@/api/home-products";
import type { ProductItem } from "@/api/products";
import { PromoModal } from "@/components/home/PromoModal";

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductItem[]>([]);
  const [newArrivals, setNewArrivals] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      try {
        const [featuredRes, newArrivalsRes] = await Promise.all([
          fetchFeaturedProducts(),
          fetchNewArrivals(),
        ]);

        if (cancelled) return;

        // Normalizer helper for partial API objects to match ProductItem
        const normalizeProduct = (p: any, defaults: Partial<ProductItem> = {}) => ({
          id: p.id,
          seller_id: p.seller_id || 1,
          brand_id: p.brand_id || null,
          category_id: p.category_id,
          sub_category_id: p.sub_category_id || null,
          name: p.name,
          slug: p.slug,
          sku: p.sku || "",
          product_type: p.product_type || "physical",
          unit: p.unit || null,
          tags: p.tags || [],
          short_description: p.short_description || "",
          description: p.description || "",
          thumbnail: p.thumbnail,
          images: p.images || [],
          unit_price: p.unit_price ?? p.purchase_price ?? 0,
          purchase_price: p.purchase_price ?? 0,
          tax: p.tax || 0,
          tax_type: p.tax_type || "flat",
          discount: p.discount || 0,
          discount_type: p.discount_type || "flat",
          current_stock: p.current_stock ?? 10,
          minimum_order_qty: p.minimum_order_qty || 1,
          low_stock_threshold: p.low_stock_threshold || 5,
          stock_status: p.stock_status || "in_stock",
          shipping_cost: p.shipping_cost || 0,
          multiply_qty: p.multiply_qty || false,
          digital_file: p.digital_file || null,
          digital_file_type: p.digital_file_type || null,
          is_featured: p.is_featured ?? defaults.is_featured ?? false,
          is_todays_deal: p.is_todays_deal || false,
          published: p.published ?? true,
          status: p.status || "approved",
          denied_reason: p.denied_reason || null,
          meta_title: p.meta_title || null,
          meta_description: p.meta_description || null,
          meta_image: p.meta_image || null,
          created_at: p.created_at || "",
          updated_at: p.updated_at || "",
          deleted_at: p.deleted_at || null,
          category: p.category || null,
          brand: p.brand || null,
        });

        if (featuredRes?.data) {
          setFeaturedProducts(featuredRes.data.map((p) => normalizeProduct(p, { is_featured: true })));
        }

        if (newArrivalsRes?.data) {
          setNewArrivals(newArrivalsRes.data.map((p) => normalizeProduct(p)));
        }
      } catch (err) {
        console.error("Failed to load homepage product sliders", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <PromoModal />
      <HeroSlider />
      <TrustBadges />
      <CategoryGrid />
      <BestSellingTabs />
      <DealsCountdown />

      {!loading && featuredProducts.length > 0 && (
        <ProductSlider
          title="Featured Products"
          subtitle="Loved by thousands of shoppers"
          products={featuredProducts}
          navPrefix="featured"
        />
      )}

      {!loading && newArrivals.length > 0 && (
        <ProductSlider
          title="New Arrivals"
          subtitle="Fresh additions to our catalog"
          products={newArrivals}
          navPrefix="new-arrivals"
        />
      )}

      <TestimonialsSection />
      <BlogSection />
    </div>
  );
}