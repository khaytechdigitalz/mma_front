import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Loader2 } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/store/StoreContext";
import { fetchProductDetails } from "@/api/product-details";
import type { ProductItem } from "@/api/products";

export function Wishlist() {
  const { wishlist } = useStore();
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);

  // wishlist stores real product ids from the catalog API, so this page fetches
  // those actual products rather than filtering local mock/demo data.
  useEffect(() => {
    let cancelled = false;

    if (wishlist.length === 0) {
      setItems([]);
      return;
    }

    setLoading(true);
    Promise.all(
      wishlist.map((id) =>
        fetchProductDetails(id)
          .then((res) => res?.data?.product ?? null)
          .catch(() => null),
      ),
    ).then((results) => {
      if (!cancelled) {
        setItems(results.filter((p): p is ProductItem => p !== null));
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [wishlist]);

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} title="My Wishlist" />
      <Section>
        <Container>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-8 animate-spin text-gray-secondary" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <Heart className="text-gray-tertiary size-20" />
              <h2 className="text-gray-primary text-xl font-bold">Your wishlist is empty</h2>
              <p className="text-gray-secondary">
                Tap the heart icon on any product to save it here.
              </p>
              <Link to="/products">
                <Button>Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
