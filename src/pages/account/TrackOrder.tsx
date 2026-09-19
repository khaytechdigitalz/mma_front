// src/pages/account/TrackOrder.tsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Circle, PackageX, ArrowLeft, MapPinned, Phone, User, Truck, Map, Compass, Navigation } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { trackOrder } from "@/api/customer";
import { cn } from "@/lib/utils";

interface TrackingData {
  order_id: number;
  tracking_number: string;
  current_status: string;
  destination: {
    address: string;
    state: string | null;
    city: string | null;
    postal_code: string | null;
    country: string;
  };
  location: {
    latitude: string;
    longitude: string;
  };
  courier: {
    name: string;
    phone: string;
    status: string;
  };
  updated_at: string;
  steps?: { label: string; description?: string; timestamp?: string; completed: boolean }[];
}

interface Step {
  label: string;
  description?: string;
  timestamp?: string;
  completed: boolean;
}

const statusColors: Record<string, string> = {
  delivered: "bg-success-light text-success-dark-main",
  shipped: "bg-info-light text-info-dark",
  processing: "bg-warning-light text-warning-dark-main",
  pending: "bg-warning-light text-warning-dark-main",
  cancelled: "bg-error-lighter text-error-dark",
};

export function TrackOrder() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [tracking, setTracking] = useState<TrackingData | null>(null);
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
          const data = res?.data;
          if (data) {
            setTracking(data);
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

  // Fallback default steps if the backend doesn't return an explicit steps array yet
  const defaultSteps: Step[] = [
    { label: "Order Placed", description: "Your order has been received and confirmed.", completed: true },
    { label: "Processing & Packaging", description: "Items are being prepared for delivery.", completed: true },
    { label: "Dispatched", description: `Handed over to courier (${tracking?.courier?.name || "Delivery Partner"}).`, completed: tracking?.current_status === "shipped" || tracking?.current_status === "delivered" },
    { label: "Delivered", description: `Successfully delivered to ${tracking?.destination?.address || "destination"}.`, completed: tracking?.current_status === "delivered" },
  ];

  const steps = tracking?.steps && tracking.steps.length > 0 ? tracking.steps : defaultSteps;

  const lat = tracking?.location?.latitude || "6.5244";
  const lng = tracking?.location?.longitude || "3.3792";

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
                /* Skeleton Loader */
                <div className="space-y-6 animate-pulse">
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-2">
                        <div className="h-3 w-24 bg-gray-200 rounded"></div>
                        <div className="h-5 w-36 bg-gray-200 rounded"></div>
                        <div className="h-6 w-20 bg-gray-100 rounded-full mt-3"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 w-24 bg-gray-200 rounded"></div>
                        <div className="h-10 w-full bg-gray-100 rounded"></div>
                        <div className="h-3 w-32 bg-gray-100 rounded"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 w-24 bg-gray-200 rounded"></div>
                        <div className="h-4 w-32 bg-gray-100 rounded"></div>
                        <div className="h-4 w-28 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                  </div>

                  {/* Map Skeleton */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
                    <div className="h-5 w-44 bg-gray-200 rounded"></div>
                    <div className="h-72 w-full bg-gray-100 rounded-xl"></div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-6">
                    <div className="h-5 w-40 bg-gray-200 rounded"></div>
                    <div className="space-y-6">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex gap-4">
                          <div className="size-6 bg-gray-200 rounded-full shrink-0"></div>
                          <div className="space-y-2 flex-1">
                            <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                            <div className="h-3 w-2/3 bg-gray-100 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : error || !tracking ? (
                <div className="flex flex-col items-center gap-4 py-16 text-center bg-white rounded-2xl border border-gray-300 p-8">
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
                <div className="space-y-6">
                  {/* Top Overview Card */}
                  <div className="relative overflow-hidden rounded-2xl border border-gray-300 bg-white p-6">
                    <div className="pointer-events-none absolute -bottom-4 -right-4 text-primary-main opacity-[0.04]">
                      <Map className="size-36" />
                    </div>

                    <div className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <p className="text-gray-tertiary text-xs font-medium uppercase tracking-wider">Tracking Number</p>
                        <p className="text-gray-primary text-sm font-bold mt-1">{tracking.tracking_number}</p>
                        <div className="mt-3">
                          <span
                            className={cn(
                              "inline-block rounded-full px-3 py-1 text-xs font-medium capitalize",
                              statusColors[tracking.current_status?.toLowerCase()] || "bg-gray-100 text-gray-600",
                            )}
                          >
                            Status: {tracking.current_status}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-tertiary text-xs font-medium uppercase tracking-wider">Destination</p>
                        <p className="text-gray-secondary text-sm mt-1 flex items-start gap-1.5">
                          <MapPinned className="size-4 text-primary-main shrink-0 mt-0.5" />
                          <span>
                            {tracking.destination.address}
                            {tracking.destination.city ? `, ${tracking.destination.city}` : ""}
                            {tracking.destination.state ? `, ${tracking.destination.state}` : ""}
                            {`, ${tracking.destination.country}`}
                          </span>
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-tertiary text-xs font-medium uppercase tracking-wider">Assigned Courier</p>
                        <div className="mt-1 space-y-1 text-sm text-gray-secondary">
                          <p className="flex items-center gap-1.5 font-medium text-gray-primary">
                            <User className="size-4 text-primary-main" /> {tracking.courier?.name ?? "N/A"}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Phone className="size-3.5 text-gray-tertiary" /> 
                            <a href={`tel:${tracking.courier?.phone}`} className="hover:text-primary-main transition-colors">
                              {tracking.courier?.phone ?? "N/A"}
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Dispatch Map Card */}
                  <div className="rounded-2xl border border-gray-300 bg-white p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <h3 className="text-gray-primary text-base font-bold flex items-center gap-2">
                        <Navigation className="size-5 text-primary-main" /> Live Dispatch Location
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-gray-secondary bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                        <Compass className="size-3.5 text-primary-main" />
                        <span>Lat: {lat}, Lng: {lng}</span>
                      </div>
                    </div>

                    <div className="relative h-80 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                      {/* Google Maps Embed using coordinates */}
                      <iframe
                        title="Dispatch Live Map"
                        src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                        className="size-full border-0"
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />

                      {/* Pulsing Truck Marker Overlay */}
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="relative flex items-center justify-center">
                          {/* Pulsing rings */}
                          <span className="absolute size-16 rounded-full bg-primary-main opacity-30 animate-ping"></span>
                          <span className="absolute size-10 rounded-full bg-primary-main opacity-50 animate-pulse"></span>
                          
                          {/* Center Truck Marker Pin */}
                          <div className="relative z-10 flex size-10 items-center justify-center rounded-full bg-primary-main text-white shadow-lg">
                            <Truck className="size-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tracking Timeline Card */}
                  <div className="rounded-2xl border border-gray-300 bg-white p-6">
                    <h3 className="text-gray-primary text-base font-bold mb-6 flex items-center gap-2">
                      <Truck className="size-5 text-primary-main" /> Delivery Progress
                    </h3>
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
                          <span className="shrink-0 z-10 bg-white">
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
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}