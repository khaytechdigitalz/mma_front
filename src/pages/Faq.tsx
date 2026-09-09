import { useEffect, useState } from "react";
import { Loader2, HelpCircle } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Accordion } from "@/components/ui/Accordion";
import { frontendApi, type FrontendContentItem } from "@/api/frontend";

interface FaqItemData {
  question: string;
  answer: string;
}

export function Faq() {
  const [faqs, setFaqs] = useState<FaqItemData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        setLoading(true);
        const result = await frontendApi.getComponent("faq");
        
        // Handle response based on your standard API wrapper patterns
        const items: FrontendContentItem[] = result?.data?.data || result?.data || [];
        
        const parsedFaqs: FaqItemData[] = [];
        items.forEach((item) => {
          if (item.value) {
            try {
              // Parse the JSON array string saved from the backend
              const parsed = JSON.parse(item.value);
              if (Array.isArray(parsed)) {
                parsedFaqs.push(...parsed);
              }
            } catch (e) {
              console.error("Failed to parse FAQ JSON value:", e);
            }
          }
        });

        setFaqs(parsedFaqs);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFaqs();
  }, []);

  return (
    <div>
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
        title="Frequently Asked Questions"
      />
      <Section>
        <Container>
          <div className="mx-auto max-w-2xl">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="size-8 animate-spin text-teal-600" />
                <p className="text-sm text-gray-500">Loading FAQs...</p>
              </div>
            ) : faqs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                <HelpCircle className="size-16 text-gray-300" />
                <h3 className="text-gray-900 font-bold text-lg">No FAQs Found</h3>
                <p className="text-gray-500 text-sm">Please check back later or add FAQ blocks from the admin dashboard.</p>
              </div>
            ) : (
              <Accordion
                defaultOpenId="q0"
                items={faqs.map((faq, i) => ({
                  id: `q${i}`,
                  title: faq.question,
                  content: faq.answer,
                }))}
              />
            )}
          </div>
        </Container>
      </Section>
    </div>
  );
}