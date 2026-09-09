// src/components/home/BestSellingTabs.tsx
import { useEffect, useState } from "react";
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
          <div className="py-12 text-center text-gray-secondary">Loading best sellers...</div>
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
        <SectionHeading
          title="Best Selling Products"
          subtitle="Enjoy up to 40% off through the weekend"
          align="center"
        />
        <div className="mx-auto mb-10 flex max-w-3xl flex-nowrap justify-center gap-3 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.category_id}
              onClick={() => setActiveCategoryId(cat.category_id)}
              className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 cursor-pointer",
                activeCategoryId === cat.category_id
                  ? "bg-primary-main text-success-light"
                  : "border-gray-tertiary/32 hover:border-primary-main hover:bg-primary-main hover:text-success-light border",
              )}
            >
              {cat.category_name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {activeGroup?.products?.map((p: any) => {
            // Normalize the partial bestseller product shape into a complete ProductItem expected by ProductCard
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