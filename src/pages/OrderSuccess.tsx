import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function OrderSuccess() {
  const orderId = `#ST-${Math.floor(10000 + Math.random() * 89999)}`;

  return (
    <Section className="py-24">
      <Container>
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4 text-center">
          <span className="bg-success-light text-success-dark-main flex size-20 items-center justify-center rounded-full">
            <CheckCircle2 className="size-10" />
          </span>
          <h1 className="text-gray-primary text-2xl font-bold md:text-32">
            Your order has been placed!
          </h1>
          <p className="text-gray-secondary">
            Order {orderId} has been confirmed and is being prepared for shipping.
            A confirmation email is on its way to you.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link to="/user-dashboard">
              <Button variant="outline">Track Order</Button>
            </Link>
            <Link to="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
