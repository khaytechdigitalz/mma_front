// src/components/Footer.tsx
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@/components/ui/BrandIcons";

const shopLinks = [
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog-list" },
  { label: "Contact", href: "/contact" },
];

const categoryLinks = ["Music", "Portery", "Home-Decor", "Art & Painting"];

export function Footer() {
  return (
    <footer className="bg-primary-lighter">
      {/* Newsletter strip */}
      <div className="bg-primary-main border-b border-gray-tertiary/20">
        <Container>
          <div className="flex flex-col items-center justify-between gap-5 py-8 lg:flex-row">
            <div>
              <h4 className="text-white text-lg font-bold">
                Subscribe to our newsletter
              </h4>
              <p className="text-white text-sm">
                Get the latest deals and updates straight to your inbox.
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full max-w-md gap-2"
            >
              <input
                type="email"
                required
                placeholder="Your email address"
                className="h-12 w-full rounded-full border border-gray-300 bg-white px-4 text-sm focus:outline-0"
              />
              <button
                type="submit"
                className="bg-primary-lighter text-success-light flex size-12 shrink-0 items-center justify-center rounded-full"
                aria-label="Subscribe"
              >
                <Send className="text-primary-main size-4" />
              </button>
            </form>
          </div>
        </Container>
      </div>

      {/* Footer nav */}
      <div className="pt-12 pb-8">
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-3">
              <div className="mb-5">
                <Logo />
              </div>
              <p className="text-gray-secondary mb-4 text-sm">
                From Our Trusted Store to Your Doorstep, Delivering Quality with
                Convenience.
              </p>
              <img
                src="/images/footer/download_app.png"
                alt="Download our mobile app"
                className="mb-5 h-6 w-auto object-contain"
              />
              <div className="flex items-center gap-3">
                {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="text-gray-primary hover:text-primary-main hover:border-primary-main flex size-9 items-center justify-center rounded-full border border-gray-300 bg-white"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-gray-primary mb-5 text-lg font-medium">Company</h4>
              <ul className="text-gray-secondary space-y-4 text-sm">
                {shopLinks.map((l) => (
                  <li key={l.label}>
                    <Link to={l.href} className="hover:text-primary-main transition hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-gray-primary mb-5 text-lg font-medium">Quick Links</h4>
              <ul className="text-gray-secondary space-y-4 text-sm">
                {categoryLinks.map((l) => (
                  <li key={l}>
                    <Link to="/products" className="hover:text-primary-main transition hover:underline">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-gray-primary mb-5 text-lg font-medium">Customer Services</h4>
              <ul className="space-y-4">
                <li className="text-gray-secondary flex items-center gap-2 text-sm">
                  <Phone className="size-4 shrink-0" /> +1 (555) 666-77-88
                </li>
                <li className="text-gray-secondary flex items-center gap-2 text-sm">
                  <Mail className="size-4 shrink-0" /> help@company.com
                </li>
                <li className="text-gray-secondary flex items-center gap-2 text-sm">
                  <MapPin className="size-4 shrink-0" /> 2972 Westheimer Rd. Santa
                  Ana, Illinois 85486
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {/* Footer bottom */}
      <div className="border-gray-tertiary/24 border-t py-6">
        <Container>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-gray-secondary text-sm">
              © {new Date().getFullYear()} Market My Art. All rights reserved.
            </p>
            <img
              src="/images/footer/payment-method.webp"
              alt="Secure payment methods"
              className="h-15 w-auto object-contain"
            />
          </div>
        </Container>
      </div>
    </footer>
  );
}