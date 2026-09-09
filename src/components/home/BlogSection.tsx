import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Loader2 } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
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

export function BlogSection() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        setLoading(true);
        const response = await frontendApi.getBlogs(1, 4); // Fetch first page, limited or we take slice below
        const paginatedData = response?.data;
        
        if (paginatedData) {
          const allBlogs = paginatedData.data || [];
          // Take only the latest 4 posts
          setBlogs(allBlogs.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch latest blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlogs();
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
    <Section>
      <Container>
        <div className="mb-8 flex items-end justify-between gap-4">
          <SectionHeading title="From Our Blog" subtitle="Tips, recipes, and grocery guides" />
          <Link
            to="/blog-list"
            className="text-primary-main hidden items-center gap-1.5 text-sm font-medium sm:flex hover:underline"
          >
            View All <ArrowRight className="size-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary-main" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            No blog posts available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {blogs.map((post) => (
              <Link
                key={post.id}
                to={`/blog-details?id=${post.id}`}
                className="group flex flex-col gap-3 rounded-xl border border-gray-300 p-3 transition-shadow hover:shadow-regular bg-white"
              >
                <div className="aspect-4/3 overflow-hidden rounded-lg bg-gray-100 relative">
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
                <h3 className="text-gray-primary group-hover:text-primary-main line-clamp-2 text-base font-semibold">
                  {post.title}
                </h3>
                <div className="text-gray-tertiary flex items-center gap-4 text-xs mt-auto pt-1">
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
  );
}