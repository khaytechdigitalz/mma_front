import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function EmptyCartScreen() {
  return (
    <Section className="py-24">
      <Container>
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
          <span className="bg-primary-lighter text-primary-main flex size-24 items-center justify-center rounded-full">
            <ShoppingCart className="size-12" />
          </span>
          <h1 className="text-gray-primary text-2xl font-bold">Your cart is empty</h1>
          <p className="text-gray-secondary">
            Looks like you haven't added anything to your cart yet. Explore our
            products and find something you love.
          </p>
          <Link to="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
