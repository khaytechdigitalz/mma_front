import { useState } from "react";
import { Phone, Mail, MapPin, Send, Clock, Navigation } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";

const inputClass =
  "border-gray-tertiary/32 h-12 w-full rounded-xl border px-4 text-sm focus:outline-0 focus:border-primary-main focus:ring-2 focus:ring-primary-main/20 transition-all";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const contactAddress = "1 Iwebo Lane, Ogbe quarters, King square, Benin city, NG";
  // Encoded URL for Google Maps embedded iframe
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    contactAddress
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} title="Contact Us" />

      <Section>
        <Container>
          {/* Top Info Cards */}
          <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                icon: Phone,
                title: "Call Us",
                value: "+234 90 55585420",
                href: "tel:+2349055585420",
              },
              {
                icon: Mail,
                title: "Email Us",
                value: "support@marketmyartonline.com",
                href: "mailto:support@marketmyartonline.com",
              },
              {
                icon: MapPin,
                title: "Visit Us",
                value: contactAddress,
                href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  contactAddress
                )}`,
              },
            ].map(({ icon: Icon, title, value, href }) => (
              <a
                key={title}
                href={href}
                target={title === "Visit Us" ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="group rounded-2xl border border-gray-200 bg-white p-6 text-center transition-all hover:border-primary-main/40 hover:shadow-md"
              >
                <span className="bg-primary-lighter/40 text-primary-main mx-auto mb-4 flex size-12 items-center justify-center rounded-full transition-transform group-hover:scale-110">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-gray-primary mb-1 text-base font-bold">{title}</h3>
                <p className="text-gray-secondary text-sm leading-relaxed group-hover:text-primary-main transition-colors">
                  {value}
                </p>
              </a>
            ))}
          </div>

          {/* Contact Form + Google Map Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch">
            {/* Contact Form Column */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between">
              <div>
                <h2 className="text-gray-primary mb-2 text-xl font-bold tracking-tight">Send us a message</h2>
                <p className="text-gray-500 text-xs mb-6">
                  Have a question or feedback? Fill out the form below and our team will get back to you shortly.
                </p>

                {submitted ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                    <p className="text-emerald-800 text-sm font-semibold mb-1">
                      Thanks for reaching out!
                    </p>
                    <p className="text-emerald-600 text-xs">
                      We've received your message and will respond within 24 business hours.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setSubmitted(false)}
                      className="mt-4 text-xs font-bold py-2 rounded-lg"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSubmitted(true);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-gray-secondary mb-1 block text-xs font-medium">Your Name</label>
                        <input required placeholder="John Doe" className={inputClass} />
                      </div>
                      <div>
                        <label className="text-gray-secondary mb-1 block text-xs font-medium">Email Address</label>
                        <input required type="email" placeholder="name@example.com" className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-secondary mb-1 block text-xs font-medium">Subject</label>
                      <input required placeholder="How can we help?" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-gray-secondary mb-1 block text-xs font-medium">Message</label>
                      <textarea
                        required
                        placeholder="Write your message here..."
                        rows={5}
                        className="border-gray-tertiary/32 w-full rounded-xl border p-4 text-sm focus:outline-0 focus:border-primary-main focus:ring-2 focus:ring-primary-main/20 transition-all"
                      />
                    </div>
                    <Button type="submit" icon={<Send className="size-4" />} className="w-full sm:w-auto py-3 px-6 rounded-xl font-bold">
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </div>

            {/* Embedded Google Map Column */}
            <div className="flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
              <div className="p-4 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-primary-main" />
                  <span className="text-gray-primary text-xs font-bold">Our Location</span>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-main hover:underline"
                >
                  <Navigation className="size-3" />
                  Get Directions
                </a>
              </div>

              {/* Responsive Google Maps Iframe */}
              <div className="relative w-full h-80 lg:h-full min-h-[320px] bg-gray-100">
                <iframe
                  title="Office Location Map"
                  width="100%"
                  height="100%"
                  className="border-0 size-full"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapEmbedUrl}
                />
              </div>

              {/* Working Hours Footer */}
              <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center gap-3">
                <Clock className="size-4 text-gray-400 shrink-0" />
                <div className="text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">Business Hours: </span>
                  Mon - Fri: 8:00 AM - 6:00 PM (WAT)
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}