import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Loader2 } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { frontendApi } from "@/api/frontend";
import { getImageSrc } from "@/lib/utils";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  body: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export function BlogList() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await frontendApi.getBlogs();
        const paginatedData = response?.data;

        if (!cancelled && paginatedData) {
          setBlogs(paginatedData.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch front blogs:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBlogs();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Blog" }]} title="Our Blog" />
      <Section>
        <Container>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary-main" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-sm">
              No blog posts available at the moment. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog-details?id=${post.id}`}
                  className="group flex flex-col gap-4 rounded-2xl border border-gray-300 p-4 transition-shadow hover:shadow-regular bg-white"
                >
                  <div className="aspect-16/10 overflow-hidden rounded-xl bg-gray-100 relative">
                    {post.image ? (
                      <img
                        src={getImageSrc(post.image)}
                        alt={post.title}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <PlaceholderImage
                        label={post.title}
                        className="size-full transition-transform duration-300 group-hover:scale-110"
                      />
                    )}
                  </div>
                  <span className="text-primary-main text-xs font-medium uppercase">
                    Article
                  </span>
                  <h3 className="text-gray-primary group-hover:text-primary-main line-clamp-2 text-lg font-semibold">
                    {post.title}
                  </h3>
                  <p className="text-gray-secondary line-clamp-2 text-sm">{post.body}</p>
                  <div className="text-gray-tertiary flex items-center gap-4 text-xs mt-auto pt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5" /> {formatDate(post.created_at)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
