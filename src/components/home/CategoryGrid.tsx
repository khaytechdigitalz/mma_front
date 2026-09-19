// src/components/home/CategoryGrid.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { fetchCategories, type Category } from "@/api/categories";
import { getImageSrc } from "@/lib/utils";

export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchCategories()
      .then((data) => {
        if (!cancelled) {
          const list = Array.isArray(data) ? data : (data as any)?.data || [];
          setCategories(list);
        }
      })
      .catch((err) => {
        console.error("Failed to load categories for grid", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const activeCategories = categories.filter(
    (cat: any) => !cat.status || cat.status === "active"
  );

  if (loading) {
    return (
      <Section>
        <Container>
          <div className="flex items-end justify-between mb-6">
            <div className="space-y-1.5">
              <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
              <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 animate-pulse">
                <div className="size-16 sm:size-20 rounded-full bg-slate-100" />
                <div className="h-3 w-16 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        </Container>
      </Section>
    );
  }

  if (activeCategories.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container>
        {/* Header Section */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-600 mb-1">
              <Compass className="size-3.5" /> Collections
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Explore Categories
            </h2>
          </div>
          <Link 
            to="/products" 
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors group bg-slate-100 hover:bg-indigo-50 px-3.5 py-1.5 rounded-full"
          >
            View All <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Smaller Circular Grid Layout */}
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {activeCategories.map((cat: any) => {
            const imageSrc = getImageSrc(cat.icon);

            return (
              <Link
                key={cat.id || cat.slug}
                to={`/products?category_id=${cat.id}`}
                className="group flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1"
              >
                {/* Even Smaller Circular Image Container */}
                <div className="relative size-16 sm:size-20 overflow-hidden rounded-full bg-slate-100 border-2 border-slate-200/80 shadow-sm transition-all duration-300 group-hover:border-indigo-500 group-hover:shadow-md">
                  {cat.icon ? (
                    <img
                      src={imageSrc}
                      alt={cat.name}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/placeholder.png";
                      }}
                    />
                  ) : (
                    <PlaceholderImage label={cat.name} tone="primary" className="size-full text-[9px]" />
                  )}
                  {/* Subtle hover gradient tint */}
                  <div className="absolute inset-0 bg-indigo-950/0 group-hover:bg-indigo-950/10 transition-colors" />
                </div>

                {/* Category Title & Count */}
                <div className="mt-2 w-full">
                  <h3 className="text-slate-800 group-hover:text-indigo-600 truncate text-xs font-bold transition-colors">
                    {cat.name}
                  </h3>
                  {cat.itemCount !== undefined && cat.itemCount !== null && (
                    <p className="text-slate-400 text-[10px] font-medium mt-0.5">
                      {cat.itemCount} items
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-6 text-center sm:hidden">
          <Link 
            to="/products" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-4 py-2 rounded-full"
          >
            View All Categories <ArrowRight className="size-3" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}