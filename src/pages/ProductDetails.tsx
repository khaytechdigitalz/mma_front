import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Heart, GitCompare, ShoppingCart, Truck, ShieldCheck, Loader2 } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { ProductImageWatermark } from "@/components/ui/ProductImageWatermark";
import { Rating } from "@/components/ui/Rating";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Tabs } from "@/components/ui/Tabs";
import { ProductSlider } from "@/components/home/ProductSlider";
import { fetchProductDetails, type ProductDetailData } from "@/api/product-details";
import { useStore } from "@/store/StoreContext";
import { formatCurrency, cn, getImageSrc } from "@/lib/utils";

export function ProductDetails() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");

  const [details, setDetails] = useState<ProductDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);

  const { toggleWishlist, isWishlisted, toggleCompare, isCompared, addToCart } = useStore();

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(message: string) {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      if (!productId) return;
      setLoading(true);
      try {
        const res = await fetchProductDetails(productId);
        if (!cancelled && res?.data) {
          setDetails(res.data);
        }
      } catch (err) {
        console.error("Failed to load product details", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  async function handleAddToCart() {
    if (!product) return;

    setAddingToCart(true);
    const result = await addToCart(product.id, quantity);
    showToast(result.message);
    setAddingToCart(false);
  }

  if (loading) {
    return (
      <div className="py-24 text-center text-gray-secondary">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!details || !details.product) {
    return (
      <div className="py-24 text-center text-gray-secondary">
        <p>Product not found.</p>
      </div>
    );
  }

  const { product, rating_summary, related_products } = details;

  // Compile thumbnail + gallery images into a single list
  const allImages = [product.thumbnail, ...(product.images || [])].filter(Boolean);
  const currentImage = allImages[activeThumb] || product.thumbnail;

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/products" },
          { label: product.name },
        ]}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-xl transition-all">
          {toastMessage}
        </div>
      )}

      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-gray-100">
                {currentImage ? (
                  <img
                    src={getImageSrc(currentImage)}
                    alt={product.name}
                    className="size-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/placeholder.png";
                    }}
                  />
                ) : (
                  <PlaceholderImage label={product.name} className="size-full" />
                )}
                <ProductImageWatermark />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {allImages.slice(0, 4).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveThumb(i)}
                    className={cn(
                      "aspect-square overflow-hidden rounded-lg border-2 bg-gray-100 cursor-pointer",
                      activeThumb === i ? "border-primary-main" : "border-transparent",
                    )}
                  >
                    <img
                      src={getImageSrc(img)}
                      alt={`${product.name} ${i + 1}`}
                      className="size-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              {product.category?.name && (
                <p className="text-primary-main mb-2 text-sm font-medium">{product.category.name}</p>
              )}
              <h1 className="text-gray-primary mb-3 text-2xl font-bold md:text-32">
                {product.name}
              </h1>
              <Rating
                value={rating_summary.average_rating}
                reviewCount={rating_summary.total_reviews}
                className="mb-4"
              />

              <div className="mb-5 flex items-center gap-3">
                <span className="text-gray-primary text-3xl font-bold">
                  {formatCurrency(product.unit_price)}
                </span>
                {product.discount > 0 && (
                  <span className="bg-error-lighter text-error-dark rounded-full px-2 py-1 text-xs font-medium uppercase">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              <p className="text-gray-secondary mb-6 text-sm leading-relaxed">
                {product.short_description || product.description}
              </p>

              <div className="mb-6 flex flex-wrap items-center gap-4">
                <QuantityStepper value={quantity} onChange={setQuantity} />
                <Button
                  size="lg"
                  className="flex-1"
                  icon={addingToCart ? <Loader2 className="size-4.5 animate-spin" /> : <ShoppingCart className="size-4.5" />}
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </Button>
              </div>

              <div className="mb-6 flex items-center gap-3">
                <button
                  onClick={() => toggleWishlist(String(product.id))}
                  className={cn(
                    "border-gray-tertiary/32 flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                    isWishlisted(String(product.id)) && "border-error-dark text-error-dark",
                  )}
                >
                  <Heart className={cn("size-4", isWishlisted(String(product.id)) && "fill-current")} />
                  Wishlist
                </button>
                <button
                  onClick={() => toggleCompare(String(product.id))}
                  className={cn(
                    "border-gray-tertiary/32 flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                    isCompared(String(product.id)) && "border-primary-main text-primary-main",
                  )}
                >
                  <GitCompare className="size-4" />
                  Compare
                </button>
              </div>

              <div className="space-y-3 rounded-xl border border-gray-300 p-4">
                <p className="text-gray-secondary flex items-center gap-2 text-sm">
                  <Truck className="text-primary-main size-4" /> Free delivery available
                </p>
                <p className="text-gray-secondary flex items-center gap-2 text-sm">
                  <ShieldCheck className="text-primary-main size-4" /> Quality guaranteed or your money back
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14">
            <Tabs
              defaultTabId="description"
              tabs={[
                {
                  id: "description",
                  label: "Description",
                  content: (
                    <div className="text-gray-secondary max-w-3xl space-y-4 text-sm leading-relaxed">
                      <p>{product.description || product.short_description}</p>
                      <p>
                        Unit size: {product.unit || "N/A"}. Category: {product.category?.name || "General"}.
                        SKU: {product.sku}.
                      </p>
                    </div>
                  ),
                },
                {
                  id: "reviews",
                  label: `Reviews (${rating_summary.total_reviews})`,
                  content: (
                    <div className="max-w-2xl space-y-5">
                      {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map((rev) => (
                          <div key={rev.id} className="border-b border-gray-200 pb-5">
                            <div className="mb-2 flex items-center gap-3">
                              <div className="bg-primary-lighter flex size-9 items-center justify-center font-bold text-primary-main shrink-0 overflow-hidden rounded-full text-xs">
                                {rev.user?.name?.charAt(0) || "U"}
                              </div>
                              <div>
                                <p className="text-gray-primary text-sm font-semibold">
                                  {rev.user?.name || "Anonymous"}
                                </p>
                                <Rating value={rev.rating} />
                              </div>
                            </div>
                            <p className="text-gray-secondary text-sm">{rev.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-secondary text-sm">No reviews yet for this product.</p>
                      )}
                    </div>
                  ),
                },
                {
                  id: "shipping",
                  label: "Shipping & Returns",
                  content: (
                    <p className="text-gray-secondary max-w-2xl text-sm leading-relaxed">
                      Orders are processed and shipped securely. Returns are accepted within standard platform policy guidelines for eligible items.
                    </p>
                  ),
                },
              ]}
            />
          </div>
        </Container>
      </Section>

      {related_products && related_products.length > 0 && (
        <ProductSlider
          title="You May Also Like"
          products={related_products.map((item: any) => ({
            id: item.id,
            slug: item.slug,
            name: item.name,
            image: item.thumbnail || item.images?.[0] || "",
            price: item.purchase_price || item.unit_price || 0,
            rating: item.rating_summary?.average_rating || 0,
            reviewCount: item.rating_summary?.total_reviews || 0,
            unit: item.unit || undefined,
            category: item.category?.name || "",
            vendor: item.seller?.name || undefined,
            inStock: item.current_stock > 0,
            unit_price: item.purchase_price || 0,
            thumbnail: item.thumbnail,
            seller_id: 1,
            brand_id: null,
            category_id: 1,
            sub_category_id: null,
            sku: "",
            product_type: "physical",
            tags: [],
            short_description: "",
            description: "",
            images: item.images || [],
            purchase_price: item.purchase_price || 0,
            tax: 0,
            tax_type: "flat",
            discount: 0,
            discount_type: "flat",
            current_stock: item.current_stock || 0,
            minimum_order_qty: 1,
            low_stock_threshold: 5,
            stock_status: "in_stock",
            shipping_cost: 0,
            multiply_qty: false,
            digital_file: null,
            digital_file_type: null,
            is_featured: false,
            is_todays_deal: false,
            published: true,
            status: "approved",
            denied_reason: null,
            meta_title: null,
            meta_description: null,
            meta_image: null,
            created_at: "",
            updated_at: "",
            deleted_at: null,
            category_data: (item as any).category,
            brand: null,
          }))}
          navPrefix="related-products"
        />
      )}
    </div>
  );
}