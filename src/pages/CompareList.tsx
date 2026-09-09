import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GitCompare, X, ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Rating } from "@/components/ui/Rating";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/store/StoreContext";
import { fetchProductDetails, type RatingSummary } from "@/api/product-details";
import type { ProductItem } from "@/api/products";
import { formatCurrency, getImageSrc } from "@/lib/utils";

interface CompareEntry {
  product: ProductItem;
  ratingSummary: RatingSummary;
}

export function CompareList() {
  const { compareList, toggleCompare, addToCart } = useStore();
  const [items, setItems] = useState<CompareEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);

  // compareList stores real product ids from the catalog API, so the compare
  // table has to fetch those actual products rather than filter local mock data.
  useEffect(() => {
    let cancelled = false;

    if (compareList.length === 0) {
      setItems([]);
      return;
    }

    setLoading(true);
    Promise.all(
      compareList.map((id) =>
        fetchProductDetails(id)
          .then((res) => (res?.data ? { product: res.data.product, ratingSummary: res.data.rating_summary } : null))
          .catch(() => null),
      ),
    ).then((results) => {
      if (!cancelled) {
        setItems(results.filter((r): r is CompareEntry => r !== null));
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [compareList]);

  const handleAddToCart = async (product: ProductItem) => {
    setAddingId(product.id);
    const result = await addToCart(product.id, 1);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setAddingId(null);
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Compare" }]} title="Compare Products" />
      <Section>
        <Container>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-8 animate-spin text-gray-secondary" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <GitCompare className="text-gray-tertiary size-20" />
              <h2 className="text-gray-primary text-xl font-bold">No products to compare</h2>
              <p className="text-gray-secondary">
                Tap the compare icon on any product to add it here.
              </p>
              <Link to="/products">
                <Button>Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] table-fixed border-separate border-spacing-4">
                <tbody>
                  <tr>
                    {items.map(({ product: p, ratingSummary }) => (
                      <td key={p.id} className="w-56 rounded-2xl border border-gray-300 p-4 align-top">
                        <button
                          onClick={() => toggleCompare(String(p.id))}
                          className="text-gray-tertiary hover:text-error-dark mb-2 float-right cursor-pointer"
                          aria-label="Remove from compare"
                        >
                          <X className="size-4" />
                        </button>
                        <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-gray-100">
                          {p.thumbnail ? (
                            <img
                              src={getImageSrc(p.thumbnail)}
                              alt={p.name}
                              className="size-full object-cover"
                            />
                          ) : (
                            <PlaceholderImage label={p.name} className="size-full" />
                          )}
                        </div>
                        <h3 className="text-gray-primary mb-2 line-clamp-2 text-sm font-semibold">
                          {p.name}
                        </h3>
                        <Rating
                          value={ratingSummary?.average_rating || 0}
                          reviewCount={ratingSummary?.total_reviews || 0}
                          className="mb-2"
                        />
                        <p className="text-gray-primary mb-3 text-lg font-bold">
                          {formatCurrency(p.unit_price)}
                        </p>
                        <Button
                          size="sm"
                          fullWidth
                          icon={
                            addingId === p.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <ShoppingCart className="size-4" />
                            )
                          }
                          disabled={addingId === p.id}
                          onClick={() => handleAddToCart(p)}
                        >
                          {addingId === p.id ? "Adding..." : "Add to Cart"}
                        </Button>
                      </td>
                    ))}
                  </tr>
                  {(
                    [
                      ["Category", (p) => p.category?.name || "General"],
                      ["Unit", (p) => p.unit || "N/A"],
                      ["SKU", (p) => p.sku || "N/A"],
                      ["Availability", (p) => (p.current_stock > 0 ? "In Stock" : "Out of Stock")],
                    ] as Array<[string, (p: ProductItem) => string]>
                  ).map(([label, getValue]) => (
                    <tr key={label}>
                      {items.map(({ product: p }) => (
                        <td key={p.id} className="text-gray-secondary rounded-xl border border-gray-200 p-4 text-sm">
                          <span className="text-gray-primary font-medium">{label}: </span>
                          {getValue(p)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
