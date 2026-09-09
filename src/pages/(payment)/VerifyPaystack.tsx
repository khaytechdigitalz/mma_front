import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { paymentsApi } from "@/api/payments";

export function VerifyPaystack() {
  const { orderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  
  // Paystack appends both reference and trxref; grab either one
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  const [loading, setLoading] = useState(true);
  const [verifiedData, setVerifiedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyPayment() {
      if (!orderId || !reference) {
        setError(`Invalid verification parameters. Missing order ID (${orderId || 'none'}) or transaction reference.`);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Calls POST /payment/verify-paystack/[orderId] with reference in body
        const res = await paymentsApi.verifyPaystackOrder(orderId, reference);
        
        if (res?.status) {
          setVerifiedData(res.data);
        } else {
          setError(res?.message || "Payment verification failed.");
        }
      } catch (err: any) {
        console.error("Verification error:", err);
        setError(err.response?.data?.message || err.message || "An error occurred while verifying your payment.");
      } finally {
        setLoading(false);
      }
    }

    verifyPayment();
  }, [orderId, reference]);

  if (loading) {
    return (
      <Section className="py-24">
        <Container>
          <div className="mx-auto flex max-w-lg flex-col items-center gap-4 text-center">
            <Loader2 className="text-primary-main size-12 animate-spin" />
            <h2 className="text-gray-primary text-xl font-bold">Verifying your payment...</h2>
            <p className="text-gray-secondary text-sm">Please wait while we securely confirm your transaction with Paystack.</p>
          </div>
        </Container>
      </Section>
    );
  }

  if (error) {
    return (
      <Section className="py-24">
        <Container>
          <div className="mx-auto flex max-w-lg flex-col items-center gap-4 text-center">
            <span className="flex size-20 items-center justify-center rounded-full bg-red-100 text-red-600">
              <XCircle className="size-10" />
            </span>
            <h1 className="text-gray-primary text-2xl font-bold md:text-32">
              Payment Verification Failed
            </h1>
            <p className="text-gray-secondary">
              {error}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link to="/cart">
                <Button variant="outline">Return to Cart</Button>
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
            Order <span className="font-semibold text-gray-primary">{verifiedData?.order_no || orderId}</span> has been confirmed and is being processed.
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