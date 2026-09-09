import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { BreadcrumbItem } from "@/types";

export function Breadcrumb({
  items,
  title,
}: {
  items: BreadcrumbItem[];
  title?: string;
}) {
  return (
    <div className="border-b border-gray-300 bg-gray-100">
      <div className="custom-container flex flex-col gap-2 py-6">
        {title && (
          <h1 className="text-gray-primary text-2xl font-bold md:text-32">
            {title}
          </h1>
        )}
        <nav className="flex flex-wrap items-center gap-1.5 text-sm">
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="text-gray-tertiary size-3.5" />}
              {item.href ? (
                <Link
                  to={item.href}
                  className="text-gray-secondary hover:text-primary-main"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-primary-main font-medium">
                  {item.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}
