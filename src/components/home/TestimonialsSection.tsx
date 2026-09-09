import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Quote } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Rating } from "@/components/ui/Rating";
import { frontendApi } from "@/api/frontend";
import { getImageSrc } from "@/lib/utils";

interface MultiTestimonialItem {
  image?: string;
  head: string;
  subtext: string;
}

export function TestimonialsSection() {
  const [testimonialsList, setTestimonialsList] = useState<MultiTestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await frontendApi.getComponent("testimonial");
        const items = response?.data?.data || [];

        // Flatten multi values or parse them from blocks
        const parsedItems: MultiTestimonialItem[] = [];

        items.forEach((block: any) => {
          if (block.type === "multi" && block.value) {
            try {
              const parsed = JSON.parse(block.value);
              if (Array.isArray(parsed)) {
                parsed.forEach((item) => {
                  parsedItems.push({
                    image: item.image,
                    head: item.head || "Anonymous",
                    subtext: item.subtext || "",
                  });
                });
              }
            } catch (e) {
              console.error("Failed to parse testimonial multi JSON:", e);
            }
          }
        });

        setTestimonialsList(parsedItems);
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Do not render section if there are no testimonials or still loading empty
  if (!loading && testimonialsList.length === 0) {
    return null;
  }

  return (
    <Section className="bg-primary-lighter/20">
      <Container>
        <SectionHeading
          title="What Our Customers Say"
          subtitle="Real feedback from real shoppers"
          align="center"
        />
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{ 768: { slidesPerView: 3 } }}
        >
          {testimonialsList.map((t, idx) => (
            <SwiperSlide key={idx} className="h-auto">
              <div className="flex h-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-regular">
                <Quote className="text-primary-light size-8" />
                <div 
                  className="text-gray-secondary flex-1 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: `"${t.subtext}"` }}
                />
                <Rating value={5} />
                <div className="flex items-center gap-3">
                  <div className="size-10 shrink-0 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center">
                    {t.image ? (
                      <img 
                        src={getImageSrc(t.image)} 
                        alt={t.head} 
                        className="size-full object-cover" 
                      />
                    ) : (
                      <PlaceholderImage label={t.head} className="size-full" tone="primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-primary text-sm font-semibold">{t.head} </p>
                    <p className="text-gray-tertiary text-xs">Verified Customer</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </Section>
  );
}