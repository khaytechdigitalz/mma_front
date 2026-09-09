import { useState } from "react";
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
import { cn } from "@/lib/utils";
import { clearAuthToken } from "@/lib/auth";
import { logoutUser } from "@/api/customer";

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
  customer,
}: {
  active: AccountSection;
  customer?: CustomerSummary;
}) {
  const navigate = useNavigate();
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutUser();
    } catch (err) {
      // Even if the server call fails (expired token, offline, etc.) we still
      // clear the local session below - the user's intent to leave wins.
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
    <aside className="h-fit space-y-1 rounded-2xl border border-gray-300 p-4">
      <div className="mb-4 flex items-center gap-3 border-b border-gray-200 pb-4">
        <div className="bg-primary-lighter size-12 shrink-0 overflow-hidden rounded-full">
          <PlaceholderImage label={customer?.name || "Account"} className="size-full" tone="primary" />
        </div>
        <div className="min-w-0">
          <p className="text-gray-primary truncate text-sm font-semibold">
            {customer?.name || "My Account"}
          </p>
          <p className="text-gray-tertiary truncate text-xs">{customer?.email || ""}</p>
        </div>
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
