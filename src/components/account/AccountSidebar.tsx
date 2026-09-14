// src/components/account/AccountSidebar.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  User,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { cn, getImageSrc } from "@/lib/utils";
import { clearAuthToken } from "@/lib/auth";
import { logoutUser, fetchProfile } from "@/api/customer";

export type AccountSection =
  | "dashboard"
  | "orders"
  | "wishlist"
  | "addresses"
  | "profile"
  | "security";

const NAV_ITEMS: Array<{ id: AccountSection; label: string; href: string; icon: typeof Package }> = [
  { id: "dashboard", label: "Dashboard", href: "/user-dashboard", icon: LayoutDashboard },
  { id: "orders", label: "My Orders", href: "/my-orders", icon: Package },
  { id: "wishlist", label: "My Wishlist", href: "/wishlist", icon: Heart },
  { id: "addresses", label: "Address Book", href: "/address-book", icon: MapPin },
  { id: "profile", label: "Profile Settings", href: "/profile-settings", icon: User },
  { id: "security", label: "Security Settings", href: "/security-settings", icon: ShieldCheck },
];

interface CustomerSummary {
  name?: string;
  email?: string;
  avatar?: string | null;
}

export function AccountSidebar({
  active,
  customer: initialCustomer,
}: {
  active: AccountSection;
  customer?: CustomerSummary;
}) {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerSummary | undefined>(initialCustomer);
  const [loading, setLoading] = useState(!initialCustomer);
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    // If customer data wasn't provided via props, fetch it independently
    if (!initialCustomer) {
      let cancelled = false;
      fetchProfile()
        .then((res) => {
          if (!cancelled && res?.data) {
            setCustomer({
              name: res.data.name,
              email: res.data.email,
              avatar: res.data.avatar,
            });
          }
        })
        .catch((err) => console.error("Failed to load account sidebar profile", err))
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => {
        cancelled = true;
      };
    } else {
      setCustomer(initialCustomer);
      setLoading(false);
    }
  }, [initialCustomer]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutUser();
    } catch (err) {
      console.error("Server logout failed, clearing local session anyway", err);
    } finally {
      clearAuthToken();
      setLoggingOut(false);
      setConfirmingLogout(false);
      toast.success("You have been logged out");
      navigate("/login", { replace: true });
    }
  };

  return (
    <aside className="h-fit space-y-1 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
      {/* User Info Header with Skeleton Support */}
      <div className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4">
        {loading ? (
          <div className="flex items-center gap-3 w-full animate-pulse">
            <div className="size-12 shrink-0 rounded-full bg-gray-200"></div>
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="h-4 w-28 bg-gray-200 rounded"></div>
              <div className="h-3 w-36 bg-gray-100 rounded"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-primary-lighter size-12 shrink-0 overflow-hidden rounded-full ring-1 ring-gray-100">
              {customer?.avatar ? (
                <img
                  src={getImageSrc(customer.avatar)}
                  alt={customer?.name || "Account"}
                  className="size-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholder.png";
                  }}
                />
              ) : (
                <PlaceholderImage label={customer?.name || "Account"} className="size-full" tone="primary" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-gray-primary truncate text-sm font-semibold">
                {customer?.name || "My Account"}
              </p>
              <p className="text-gray-tertiary truncate text-xs">{customer?.email || ""}</p>
            </div>
          </>
        )}
      </div>

      {NAV_ITEMS.map(({ id, label, href, icon: Icon }) => (
        <Link
          key={id}
          to={href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
            active === id
              ? "bg-primary-main/10 text-primary-main font-medium"
              : "text-gray-secondary hover:bg-primary-main/5 hover:text-primary-main",
          )}
        >
          <Icon className="size-4" /> {label}
        </Link>
      ))}

      <button
        type="button"
        onClick={() => setConfirmingLogout(true)}
        className="text-error-dark flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-error-lighter/20"
      >
        <LogOut className="size-4" /> Log Out
      </button>

      <ConfirmModal
        open={confirmingLogout}
        title="Log out of your account?"
        description="You'll need to sign in again to access your orders, wishlist, and account settings."
        confirmLabel="Log Out"
        cancelLabel="Stay Signed In"
        tone="danger"
        loading={loggingOut}
        onConfirm={handleLogout}
        onCancel={() => setConfirmingLogout(false)}
      />
    </aside>
  );
}