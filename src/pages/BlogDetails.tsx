import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Calendar, Loader2, ArrowLeft } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { frontendApi } from "@/api/frontend";
import { getImageSrc } from "@/lib/utils";

interface BlogDetailsData {
  id: number;
  title: string;
  slug: string;
  body: string;
  image: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export function BlogDetails() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [blog, setBlog] = useState<BlogDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError(true);
      return;
    }

    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        const response = await frontendApi.getBlogDetails(id);
        if (response?.status && response?.data) {
          setBlog(response.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch blog details:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary-main" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div>
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog-list" }, { label: "Not Found" }]}
          title="Blog Not Found"
        />
        <Section>
          <Container>
            <div className="text-center py-16 space-y-4">
              <p className="text-gray-secondary text-base">The blog post you are looking for does not exist or has been removed.</p>
              <Link 
                to="/blog-list" 
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-main hover:underline"
              >
                <ArrowLeft className="size-4" /> Back to Blog List
              </Link>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" }, 
          { label: "Blog", href: "/blog-list" }, 
          { label: blog.title }
        ]}
        title={blog.title}
      />
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl">
            <span className="text-primary-main mb-3 block text-sm font-medium uppercase">
              Article
            </span>
            <h1 className="text-gray-primary mb-4 text-2xl font-bold md:text-32">
              {blog.title}
            </h1>
            <div className="text-gray-tertiary mb-6 flex flex-wrap items-center gap-5 text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4" /> {formatDate(blog.created_at)}
              </span>
            </div>
            <div className="mb-8 aspect-16/9 overflow-hidden rounded-2xl bg-gray-100 relative">
              {blog.image ? (
                <img
                  src={getImageSrc(blog.image)}
                  alt={blog.title}
                  className="size-full object-cover"
                />
              ) : (
                <PlaceholderImage label={blog.title} className="size-full" />
              )}
            </div>
            <div className="text-gray-secondary space-y-5 text-base leading-relaxed whitespace-pre-line">
              {blog.body}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}