import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";

const inputClass =
  "border-gray-tertiary/32 h-12 w-full rounded-lg border px-4 text-sm focus:outline-0 focus:ring-1 focus:ring-primary-main";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} title="Contact Us" />
      <Section>
        <Container>
          <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { icon: Phone, title: "Call Us", value: "+1 (555) 666-77-88" },
              { icon: Mail, title: "Email Us", value: "help@company.com" },
              { icon: MapPin, title: "Visit Us", value: "2972 Westheimer Rd, Illinois" },
            ].map(({ icon: Icon, title, value }) => (
              <div key={title} className="rounded-2xl border border-gray-300 p-6 text-center">
                <span className="bg-primary-lighter text-primary-main mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-gray-primary mb-1 text-base font-bold">{title}</h3>
                <p className="text-gray-secondary text-sm">{value}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto max-w-2xl rounded-2xl border border-gray-300 p-8">
            <h2 className="text-gray-primary mb-6 text-xl font-bold">Send us a message</h2>
            {submitted ? (
              <p className="text-success-dark-main text-sm font-medium">
                Thanks for reaching out! We'll get back to you within 24 hours.
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input required placeholder="Your name" className={inputClass} />
                  <input required type="email" placeholder="Email address" className={inputClass} />
                </div>
                <input required placeholder="Subject" className={inputClass} />
                <textarea
                  required
                  placeholder="Your message"
                  rows={5}
                  className="border-gray-tertiary/32 w-full rounded-lg border p-4 text-sm focus:outline-0 focus:ring-1 focus:ring-primary-main"
                />
                <Button type="submit" icon={<Send className="size-4" />}>
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </Container>
      </Section>
    </div>
  );
}
