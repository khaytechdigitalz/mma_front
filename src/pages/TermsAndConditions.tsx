import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { frontendApi, type FrontendContentItem } from "@/api/frontend";

interface PolicySection {
  title: string;
  body: string;
}

export function TermsAndConditions() {
  const [sections, setSections] = useState<PolicySection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatedAt, setUpdatedAt] = useState<string>("January 2026");

  useEffect(() => {
    const loadPolicy = async () => {
      try {
        setLoading(true);
        const result = await frontendApi.getComponent("terms");
        
        const items: FrontendContentItem[] = result?.data?.data || result?.data || [];
        
        if (items.length > 0) {
          const item = items[0] as FrontendContentItem & { updated_at?: string };

          if (item.value) {
            const rawText = item.value;

            // Format updated_at date if available
            if (item.updated_at) {
              const dateObj = new Date(item.updated_at);
              setUpdatedAt(dateObj.toLocaleDateString("en-US", { month: "long", year: "numeric" }));
            }

            // Parse the text block separated by double newlines (\n\n) or single newlines
            const blocks = rawText.split(/\n\n+/);
            const parsedSections: PolicySection[] = [];

            blocks.forEach((block) => {
              const lines = block.trim().split("\n");
              if (lines.length >= 2) {
                const title = lines[0].trim();
                const body = lines.slice(1).join(" ").trim();
                parsedSections.push({ title, body });
              } else if (lines.length === 1 && lines[0].trim()) {
                parsedSections.push({ title: "Details", body: lines[0].trim() });
              }
            });

            setSections(parsedSections);
          }
        }
      } catch (error) {
        console.error("Error fetching terms and conditions policy:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPolicy();
  }, []);

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Terms and Conditions" }]} title="Terms and Conditions" />
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl space-y-8">
            <p className="text-gray-secondary text-sm">
              Last updated: {loading ? <span className="inline-block h-3 w-24 bg-gray-200 animate-pulse rounded" /> : updatedAt}
            </p>

            {loading ? (
              <div className="space-y-8 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded-md w-1/3" />
                    <div className="space-y-1.5">
                      <div className="h-4 bg-gray-100 rounded-md w-full" />
                      <div className="h-4 bg-gray-100 rounded-md w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sections.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                <ShieldAlert className="size-16 text-gray-300" />
                <h3 className="text-gray-900 font-bold text-lg">Policy Content Unavailable</h3>
                <p className="text-gray-500 text-sm">Please check back later or configure policy blocks from the admin dashboard.</p>
              </div>
            ) : (
              sections.map((s, index) => (
                <div key={index}>
                  <h2 className="text-gray-primary mb-2 text-lg font-bold">{s.title}</h2>
                  <p className="text-gray-secondary text-sm leading-relaxed">{s.body}</p>
                </div>
              ))
            )}
          </div>
        </Container>
      </Section>
    </div>
  );
}