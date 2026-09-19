import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { ProductImageWatermark } from "@/components/ui/ProductImageWatermark";
import { Rating } from "@/components/ui/Rating";
import { formatCurrency, cn, getImageSrc } from "@/lib/utils";
import { useStore } from "@/store/StoreContext";
import type { ProductItem } from "@/api/products";

export function ProductList({
  product,
  onQuickView,
  className,
}: {
  product: ProductItem;
  onQuickView?: (product: ProductItem) => void;
  className?: string;
}) {
  const { toggleWishlist, isWishlisted, addToCart } = useStore();
  const [loading, setLoading] = useState(false);

  // Ensure id is a string since store expects string ids
  const productIdStr = String(product.id);
  const liked = isWishlisted(productIdStr);
  const thumbnailSrc = getImageSrc(product.thumbnail);

  const handleAddToCart = async () => {
    setLoading(true);
    const result = await addToCart(product.id, 1);
    if (result.success) {
      toast.success(result.message || "Product added to cart successfully!");
    } else {
      toast.error(result.message || "Failed to add product to cart.");
    }
    setLoading(false);
  };

  return (
    <article
      className={cn(
        "group flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-5 rounded-xl border border-gray-300 bg-white p-4 transition-shadow hover:shadow-regular",
        className,
      )}
    >
      {/* Left side: Image & Badges */}
      <div className="relative w-full h-48 sm:size-36 shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <Link
          to={`/product-details-1?id=${product.id}`}
          className="relative block size-full"
        >
          {product.thumbnail ? (
            <img
              src={thumbnailSrc}
              alt={product.name}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/placeholder.png";
              }}
            />
          ) : (
            <PlaceholderImage
              label={product.name}
              className="size-full transition-transform duration-300 group-hover:scale-110"
            />
          )}
          <ProductImageWatermark />
        </Link>

        {product.discount > 0 && (
          <span className="bg-error-dark absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-medium text-white uppercase shadow-sm">
            {product.discount}% off
          </span>
        )}

        <button
          onClick={() => toggleWishlist(productIdStr)}
          className={cn(
            "absolute top-2 right-2 flex size-7 cursor-pointer items-center justify-center rounded-full transition-all duration-300 shadow-sm",
            liked ? "bg-error-dark text-white" : "bg-white text-gray-secondary",
          )}
          aria-label="Toggle wishlist"
        >
          <Heart className={cn("size-3.5", liked && "fill-current")} />
        </button>
      </div>

      {/* Middle: Details & Info */}
      <div className="flex flex-1 flex-col justify-center space-y-1.5">
        <h3 className="text-gray-primary hover:text-primary-main text-base font-semibold">
          <Link to={`/product-details-1?id=${product.id}`}>{product.name}</Link>
        </h3>
        
        {product.short_description && (
          <p className="text-gray-tertiary line-clamp-2 text-xs leading-relaxed">
            {product.short_description}
          </p>
        )}

        <div className="pt-1">
          <Rating value={5} reviewCount={0} />
        </div>
      </div>

      {/* Right side: Pricing & Actions */}
      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 sm:border-l border-gray-200 pt-3 sm:pt-0 sm:pl-6 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-gray-primary text-lg font-bold">
            {formatCurrency(product.unit_price)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="text-gray-primary flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 text-xs font-medium shadow-sm transition-all hover:bg-gray-50"
            >
              <Eye className="size-3.5" /> <span className="hidden md:inline">Quick View</span>
            </button>
          )}

          <button
            onClick={handleAddToCart}
            disabled={loading}
            className="bg-primary-main hover:bg-primary-main-dark text-white flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-medium transition-all duration-300 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ShoppingCart className="size-4" />
            )}
            {loading ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </article>
  );
}