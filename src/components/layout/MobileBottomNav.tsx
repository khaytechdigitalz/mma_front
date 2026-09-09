import { NavLink } from "react-router-dom";
import { Home, Package, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Home", to: "/", icon: Home },
  { label: "My Order", to: "/my-orders", icon: Package },
  { label: "Wishlist", to: "/wishlist", icon: Heart },
  { label: "Account", to: "/user-dashboard", icon: User },
];

export function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-gray-300 bg-white pb-[env(safe-area-inset-bottom)] xl:hidden">
      {tabs.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={label}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            cn(
              "relative flex flex-col items-center gap-1 py-3 text-[11px]",
              isActive ? "text-primary-main" : "text-gray-tertiary",
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="bg-primary-main absolute top-0 h-0.5 w-8 rounded-full" />
              )}
              <Icon className="size-5" />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
