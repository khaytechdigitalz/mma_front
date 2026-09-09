// src/pages/Products.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductCard } from "@/components/ui/ProductCard";
import { fetchProducts, type ProductItem } from "@/api/products";
import { fetchCategories, type Category } from "@/api/categories";
import { cn, formatCurrency } from "@/lib/utils";

const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
];

const DEFAULT_PRICE_CEILING = 5000;

export function Products() {
  const [searchParams] = useSearchParams();
  // The header's category links use `category_id` (matching the value the
  // backend filter expects), so read the same key here.
  const activeCategoryId = searchParams.get("category_id");
  const query = searchParams.get("search") || searchParams.get("q") || "";

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [sort, setSort] = useState("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    activeCategoryId ? [activeCategoryId] : [],
  );

  // `priceCeiling` is the fixed upper bound of the slider track (derived once
  // from the catalog). `maxPrice` is the live, user-adjustable thumb position,
  // and `appliedMaxPrice` is the debounced value actually sent to the server.
  // Keeping these separate is what lets the slider move freely - previously
  // the slider's `max` and `value` were the same state, so the thumb could
  // never sit anywhere but the far right.
  const priceCeilingSetRef = useRef(false);
  const [priceCeiling, setPriceCeiling] = useState(DEFAULT_PRICE_CEILING);
  const [maxPrice, setMaxPrice] = useState(DEFAULT_PRICE_CEILING);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(DEFAULT_PRICE_CEILING);

  // Pagination states from backend meta
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [fromItem, setFromItem] = useState(0);
  const [toItem, setToItem] = useState(0);

  // Debounce slider drags before triggering a new server request.
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedMaxPrice(maxPrice);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [maxPrice]);

  // Fetch products and categories whenever a real filter/page/sort changes.
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          fetchProducts({
            search: query || undefined,
            page: currentPage,
            category_id: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
            min_price: 0,
            max_price: appliedMaxPrice < priceCeiling ? appliedMaxPrice : undefined,
          }),
          fetchCategories(),
        ]);

        if (!cancelled && prodRes?.data) {
          const paginatedData = prodRes.data;
          setProducts(paginatedData.data || []);
          setCurrentPage(paginatedData.current_page);
          setTotalPages(paginatedData.last_page);
          setTotalResults(paginatedData.total);
          setFromItem(paginatedData.from || 0);
          setToItem(paginatedData.to || 0);

          const categoryList = Array.isArray(catRes) ? catRes : (catRes as any)?.data || [];
          setCategories(categoryList);

          // Derive the price slider's ceiling once, from the first unfiltered
          // load, so it stays stable while the user filters afterwards.
          if (!priceCeilingSetRef.current && paginatedData.data.length > 0) {
            const highestPrice = Math.max(...paginatedData.data.map((p) => p.unit_price));
            const ceiling = Math.max(Math.ceil(highestPrice), 1);
            priceCeilingSetRef.current = true;
            setPriceCeiling(ceiling);
            setMaxPrice(ceiling);
            setAppliedMaxPrice(ceiling);
          }
        }
      } catch (err) {
        console.error("Failed to load products page data", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [query, currentPage, selectedCategories, appliedMaxPrice, priceCeiling]);

  // Sorting is a lightweight, purely client-side presentation concern applied
  // to whatever page of (already server-filtered) results is currently loaded.
  const filtered = useMemo(() => {
    switch (sort) {
      case "price-asc":
        return [...products].sort((a, b) => a.unit_price - b.unit_price);
      case "price-desc":
        return [...products].sort((a, b) => b.unit_price - a.unit_price);
      default:
        return products;
    }
  }, [products, sort]);

  function toggleCategory(categoryId: string) {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId],
    );
    setCurrentPage(1);
  }

  return (
    <div>
      <Breadcrumb
        title={query ? `Search results for "${query}"` : "All Products"}
        items={[{ label: "Home", href: "/" }, { label: "Shop" }]}
      />
      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
            <aside className="space-y-8">
              <div>
                <h3 className="text-gray-primary mb-4 flex items-center gap-2 text-base font-bold">
                  <SlidersHorizontal className="size-4" /> Filter
                </h3>
              </div>
              <div>
                <h4 className="text-gray-primary mb-3 text-sm font-semibold">Categories</h4>
                <ul className="space-y-3">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <label className="text-gray-secondary flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          className="accent-primary-main"
                          checked={selectedCategories.includes(cat.id.toString())}
                          onChange={() => toggleCategory(cat.id.toString())}
                        />
                        {cat.name}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-gray-primary mb-3 text-sm font-semibold">Price Range</h4>
                <input
                  type="range"
                  min={0}
                  max={priceCeiling}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="size-guide-slider accent-primary-main w-full cursor-pointer"
                />
                <div className="text-gray-secondary mt-2 flex justify-between text-xs">
                  <span>{formatCurrency(0)}</span>
                  <span>Up to {formatCurrency(maxPrice)}</span>
                </div>
              </div>
            </aside>

            <div>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-gray-secondary text-sm">
                  Showing {totalResults > 0 ? fromItem : 0}-{toItem} of {totalResults} results
                </p>
                <div className="flex items-center gap-3">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="border-gray-tertiary/32 rounded-full border px-4 py-2 text-sm focus:outline-0"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="border-gray-tertiary/32 flex overflow-hidden rounded-full border">
                    <button
                      onClick={() => setView("grid")}
                      className={cn(
                        "flex size-9 items-center justify-center cursor-pointer",
                        view === "grid" ? "bg-primary-main text-success-light" : "text-gray-secondary",
                      )}
                    >
                      <LayoutGrid className="size-4" />
                    </button>
                    <button
                      onClick={() => setView("list")}
                      className={cn(
                        "flex size-9 items-center justify-center cursor-pointer",
                        view === "list" ? "bg-primary-main text-success-light" : "text-gray-secondary",
                      )}
                    >
                      <List className="size-4" />
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                // Skeleton Loader Grid
                <div
                  className={cn(
                    "grid gap-5",
                    view === "grid"
                      ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1",
                  )}
                >
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-xs animate-pulse"
                    >
                      <div className="aspect-square w-full bg-gray-200 rounded-xl mb-4" />
                      <div className="h-3 w-1/3 bg-gray-200 rounded mb-2" />
                      <div className="h-4 w-4/5 bg-gray-200 rounded mb-4" />
                      <div className="mt-auto flex items-center justify-between">
                        <div className="h-5 w-1/4 bg-gray-200 rounded" />
                        <div className="size-9 bg-gray-200 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <p className="text-gray-secondary py-16 text-center">
                  No products match your filters.
                </p>
              ) : (
                <>
                  <div
                    className={cn(
                      "grid gap-5",
                      view === "grid"
                        ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1",
                    )}
                  >
                    {filtered.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex size-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
                      >
                        <ChevronLeft className="size-4" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            "flex size-10 items-center justify-center rounded-full text-sm font-medium cursor-pointer transition-colors",
                            currentPage === page
                              ? "bg-primary-main text-white"
                              : "border border-gray-200 text-gray-600 hover:bg-gray-50",
                          )}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex size-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
