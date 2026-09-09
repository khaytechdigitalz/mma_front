// src/pages/account/TrackOrder.tsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle2, Circle, PackageX, ArrowLeft } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { trackOrder, type TrackingStep } from "@/api/customer";
import { cn } from "@/lib/utils";

export function TrackOrder() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [steps, setSteps] = useState<TrackingStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError(true);
      return;
    }

    let cancelled = false;
    trackOrder(id)
      .then((res) => {
        if (!cancelled) {
          const list = res?.data?.steps || res?.data || [];
          if (Array.isArray(list) && list.length > 0) {
            setSteps(list);
          } else {
            setError(true);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load tracking info", err);
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div>
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "My Orders", href: "/my-orders" }, { label: "Track Order" }]}
        title="Track My Order"
      />
      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
            <AccountSidebar active="orders" />

            <div>
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="text-gray-tertiary size-8 animate-spin" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                  <PackageX className="text-gray-tertiary size-16" />
                  <h2 className="text-gray-primary text-lg font-bold">Tracking info unavailable</h2>
                  <p className="text-gray-secondary text-sm">
                    We couldn't find tracking details for this order right now.
                  </p>
                  {id && (
                    <Link
                      to={`/order-details?id=${id}`}
                      className="text-primary-main flex items-center gap-1.5 text-sm font-semibold hover:underline"
                    >
                      <ArrowLeft className="size-4" /> Back to Order Details
                    </Link>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-300 p-6">
                  <ol className="space-y-0">
                    {steps.map((step, i) => (
                      <li key={i} className="relative flex gap-4 pb-8 last:pb-0">
                        {i < steps.length - 1 && (
                          <span
                            className={cn(
                              "absolute top-6 left-[11px] h-full w-0.5",
                              step.completed ? "bg-primary-main" : "bg-gray-200",
                            )}
                          />
                        )}
                        <span className="shrink-0">
                          {step.completed ? (
                            <CheckCircle2 className="text-primary-main size-6" />
                          ) : (
                            <Circle className="text-gray-tertiary size-6" />
                          )}
                        </span>
                        <div>
                          <p
                            className={cn(
                              "text-sm font-semibold",
                              step.completed ? "text-gray-primary" : "text-gray-tertiary",
                            )}
                          >
                            {step.label}
                          </p>
                          {step.description && (
                            <p className="text-gray-secondary mt-1 text-sm">{step.description}</p>
                          )}
                          {step.timestamp && (
                            <p className="text-gray-tertiary mt-1 text-xs">{step.timestamp}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
