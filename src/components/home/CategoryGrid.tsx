import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { fetchCategories, type Category } from "@/api/categories";
import { getImageSrc } from "@/lib/utils";

export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetchCategories()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch((err) => {
        console.error("Failed to load categories for grid", err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const categoryList = Array.isArray(categories)
    ? categories
    : (categories as any)?.data || [];

  return (
    <Section>
      <Container>
        <SectionHeading title="Shop by Category" subtitle="Browse our most popular departments" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {categoryList
            .filter((cat: any) => !cat.status || cat.status === "active")
            .map((cat: any) => {
              const imageSrc = getImageSrc(cat.icon);

              return (
                <Link
                  key={cat.id || cat.slug}
                  to={`/products?category_id=${cat.id}`}
                  className="group flex flex-col items-center gap-2.5 rounded-xl border border-gray-200 p-3 transition-all hover:border-primary-main hover:shadow-sm"
                >
                  <div className="bg-primary-lighter/40 flex size-12 items-center justify-center overflow-hidden rounded-full p-2">
                    {cat.icon ? (
                      <img
                        src={imageSrc}
                        alt={cat.name}
                        className="size-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/placeholder.png";
                        }}
                      />
                    ) : (
                      <PlaceholderImage label={cat.name} tone="primary" className="size-full text-xs" />
                    )}
                  </div>
                  <div className="w-full text-center">
                    <h3 className="text-gray-primary group-hover:text-primary-main truncate text-xs font-semibold">
                      {cat.name}
                    </h3>
                    {cat.itemCount !== undefined && cat.itemCount !== null && (
                      <p className="text-gray-tertiary text-[10px]">{cat.itemCount} items</p>
                    )}
                  </div>
                </Link>
              );
            })}
        </div>
      </Container>
    </Section>
  );
}