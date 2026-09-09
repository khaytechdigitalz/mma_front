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

export function ProductCard({
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
        "group flex h-full flex-col gap-3.5 rounded-xl border border-gray-300 p-4 transition-shadow hover:shadow-regular",
        className,
      )}
    >
      <div className="relative">
        <Link
          to={`/product-details-1?id=${product.id}`}
          className="relative block aspect-square overflow-hidden rounded-lg bg-gray-100"
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
          <span className="bg-error-dark absolute top-2 left-2 rounded-full px-2 py-1 text-xs font-medium text-white uppercase">
            {product.discount}% off
          </span>
        )}

        <button
          onClick={() => toggleWishlist(productIdStr)}
          className={cn(
            "absolute top-3 right-3 flex size-8 cursor-pointer items-center justify-center rounded-full transition-all duration-300",
            liked ? "bg-error-dark text-white" : "bg-white text-gray-secondary",
          )}
          aria-label="Toggle wishlist"
        >
          <Heart className={cn("size-4", liked && "fill-current")} />
        </button>

        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="text-gray-primary absolute bottom-3 left-1/2 flex h-9 -translate-x-1/2 translate-y-3 cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 text-xs font-medium opacity-0 shadow-regular transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <Eye className="size-3.5" /> Quick View
          </button>
        )}
      </div>

      <div>
        <h3 className="text-gray-primary hover:text-primary-main line-clamp-1 text-base font-medium">
          <Link to={`/product-details-1?id=${product.id}`}>{product.name}</Link>
        </h3>
        {product.short_description && (
          <p className="text-gray-tertiary mt-1 line-clamp-1 text-xs">
            {product.short_description}
          </p>
        )}
      </div>

      <Rating value={5} reviewCount={0} />

      <div className="flex items-center gap-2">
        <span className="text-gray-primary text-lg font-bold">
          {formatCurrency(product.unit_price)}
        </span>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="bg-primary-main hover:bg-primary-main-dark text-success-light mt-auto flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 hover:text-white disabled:opacity-70"
      >
        {loading ? (
          <Loader2 className="size-4.5 animate-spin" />
        ) : (
          <ShoppingCart className="size-4.5" />
        )}
        {loading ? "Adding..." : "Add to Cart"}
      </button>
    </article>
  );
}