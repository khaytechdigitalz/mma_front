// src/components/home/BestSellingTabs.tsx
import { useEffect, useState } from "react";
import { TrendingUp, Sparkles } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { ProductCard } from "@/components/ui/ProductCard";
import { fetchBestsellers, type BestsellerCategoryGroup } from "@/api/home-products";
import type { ProductItem } from "@/api/products";
import { cn } from "@/lib/utils";

export function BestSellingTabs() {
  const [categories, setCategories] = useState<BestsellerCategoryGroup[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      try {
        const res = await fetchBestsellers();
        if (!cancelled && res?.data && res.data.length > 0) {
          setCategories(res.data);
          setActiveCategoryId(res.data[0].category_id);
        }
      } catch (err) {
        console.error("Failed to load bestsellers", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <Section>
        <Container>
          <div className="flex flex-col items-center mb-8">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="mx-auto mb-10 flex max-w-xl justify-center gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 w-28 bg-gray-100 rounded-full animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        </Container>
      </Section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  const activeGroup = categories.find((c) => c.category_id === activeCategoryId) || categories[0];

  return (
    <Section>
      <Container>
        {/* Section Heading with Theme Badge */}
        <div className="text-center mb-8"> 
          <SectionHeading
            title="Best Selling Masterpieces"
            subtitle="Explore our top-rated artisan goods with special weekend discounts"
            align="center"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="mx-auto mb-10 flex max-w-3xl flex-nowrap justify-start sm:justify-center gap-2.5 overflow-x-auto pb-2 px-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategoryId === cat.category_id;
            return (
              <button
                key={cat.category_id}
                onClick={() => setActiveCategoryId(cat.category_id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer shadow-xs",
                  isActive
                    ? "bg-primary-main text-white shadow-md"
                    : "border border-gray-200 bg-white text-gray-700 hover:border-primary-main hover:bg-gray-50 hover:text-primary-main",
                )}
              >
                <Sparkles className={cn("size-3.5", isActive ? "text-white/80" : "text-gray-400")} />
                {cat.category_name}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {activeGroup?.products?.map((p: any) => {
            const normalizedProduct: ProductItem = {
              id: p.id,
              seller_id: p.seller_id || 1,
              brand_id: p.brand_id || null,
              category_id: p.category_id || activeGroup.category_id,
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
              is_featured: p.is_featured || false,
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
              category: p.category || { id: activeGroup.category_id, name: activeGroup.category_name },
              brand: p.brand || null,
            };

            return <ProductCard key={normalizedProduct.id} product={normalizedProduct} />;
          })}
        </div>
      </Container>
    </Section>
  );
}