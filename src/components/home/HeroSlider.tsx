// src/components/home/HeroSlider.tsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const slides = [


  {
    "eyebrow": "Exclusive Marketplace",
    "title": "Shop Trendsetting Products From Independent Sellers",
    "subtitle": "Explore unique art, fashion, and everyday essentials all in one place.",
    "cta": "Shop Now",
    "image": "/images/slider/hero-slide-3.png",
    "bgimage": "/images/slider/closeup-handsome-black-man-with-long-beard-laughing-having-fun-looking-carefree-standing.jpg",
    "href": "/products"
  },
  {
    "eyebrow": "Marketplace Finds",
    "title": "Discover Quality Goods From Trusted Local Sellers",
    "subtitle": "Get up to 40% off your first order from verified vendors near you.",
    "cta": "Explore Deals",
    "image": "/images/slider/sl1.png",
    "bgimage": "/images/slider/christmas-gift-boxes-various-colors-placed-shopping-cart.jpg",
    "href": "/products"
  },
  {
    "eyebrow": "New Arrivals",
    "title": "Unique Collections & Trendy Items, Added Daily",
    "subtitle": "Support independent creators while upgrading your everyday style.",
    "cta": "Explore Collection",
    "image": "/images/slider/hero-slide-2.png",
    "bgimage": "/images/slider/portrait-man-going-out-shopping-various-consumer-goods.jpg",
    "href": "/products"
  },

];

export function HeroSlider() {
  return (
    <section className="relative overflow-hidden w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, el: ".hero-pagination" }}
        loop
        className="w-full"
      >
        {slides.map((slide) => {
          const bgUrl = slide.bgimage;
          const slideImg = slide.image;

          return (
            <SwiperSlide key={slide.title}>
              {/* Full width background container covering both content and footer bar */}
              <div
                className="w-full bg-cover bg-center bg-no-repeat flex flex-col justify-between"
                style={{
                  backgroundImage: `url("${bgUrl}")`,
                }}
              >
                {/* Main Content Area */}
                <Container>
                  <div className="grid items-center gap-8 py-12 md:grid-cols-2 md:py-20 px-4 md:px-8">
                    <div>
                      <span className="bg-success-light text-gray-800 mb-4 inline-block rounded-full px-3 py-1 text-xs font-medium">
                        {slide.eyebrow}
                      </span>
                      <h1 className="text-gray-primary mb-4 text-3xl leading-tight font-extrabold md:text-5xl">
                        {slide.title}
                      </h1>
                      <p className="text-gray-secondary mb-6 max-w-md text-base">
                        {slide.subtitle}
                      </p>
                      <Link to={slide.href}>
                        <Button size="lg">{slide.cta}</Button>
                      </Link>
                    </div>
                    {/*
                    <div className="aspect-4/3 overflow-hidden rounded-2xl">
                      <img
                        src={slideImg}
                        alt={slide.title}
                        className="size-full object-cover"
                      />
                    </div>
                    */}
                  </div>
                </Container>

                {/* Trust badges footer bar inside the slide background */}
                <div className="py-4 border-t border-black/10 bg-black/5 backdrop-blur-[2px]">
                  <Container>
                    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm">
                      <span className="text-white flex items-center gap-2">
                        <Truck className="text-white size-5" /> Free delivery over $50
                      </span>
                      <span className="text-white flex items-center gap-2">
                        <Truck className="text-white size-5" /> Same-day delivery available
                      </span>
                      <span className="text-white flex items-center gap-2">
                        <Truck className="text-white size-5" /> 100+ trusted local vendors
                      </span>
                    </div>
                  </Container>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Pagination wrapper positioned neatly underneath */}
      <div className="hero-pagination my-4 flex justify-center gap-2" />
    </section>
  );
}