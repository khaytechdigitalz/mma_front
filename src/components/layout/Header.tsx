// src/components/Header.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  ChevronDown,
  Menu,
  Phone,
  Globe,
  GitCompare,
  Loader2,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { Dropdown } from "@/components/ui/Dropdown";
import { useStore } from "@/store/StoreContext";
import { fetchCategories, type Category } from "@/api/categories";
import { fetchProducts } from "@/api/products";
import { cn, getImageSrc, formatCurrency } from "@/lib/utils";
import { isAuthenticated, clearAuthToken } from "@/lib/auth";
import { logoutUser } from "@/api/customer";
import { ConfirmModal } from "@/components/ui/ConfirmModal";



function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response: any = await fetchProducts({ search: query });
        const items = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
          ? response.data
          : response?.data?.data || [];

        setProducts(items);
      } catch (err) {
        console.error("Failed to fetch products", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  function submit() {
    navigate(`/products${query ? `?search=${encodeURIComponent(query)}` : ""}`);
    setFocused(false);
  }

  return (
    <div className={cn("relative", className)}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Search for the items"
        className="border-gray-tertiary/32 focus:ring-primary-main h-12 w-full rounded-full border px-4 py-3 pl-12 focus:outline-0"
      />
      <button
        onClick={submit}
        className="text-gray-tertiary absolute top-1/2 left-4 -translate-y-1/2 cursor-pointer"
        aria-label="Search"
      >
        <Search className="size-5" />
      </button>

      {focused && query.trim() && (
        <div className="shadow-light-2 border-gray-tertiary/24 absolute top-full right-0 left-0 z-50 mt-2 max-h-[380px] overflow-y-auto rounded-2xl border bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-gray-primary text-sm font-medium">Search Results</span>
            {loading && (
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <Loader2 className="size-3.5 animate-spin" />
                Searching...
              </span>
            )}
          </div>

          <div className="space-y-2">
            {loading && products.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-400">
                Finding products matching "{query}"...
              </div>
            ) : products.length > 0 ? (
              products.slice(0, 5).map((product) => (
                <div
                  key={product.id || product.slug}
                  onMouseDown={() => {
                    navigate(`/product-details-1?id=${product.id}`);
                    setFocused(false);
                  }}
                  className="hover:bg-primary-main/5 flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors"
                >
                  {product.thumbnail ? (
                    <div className="size-10 overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                      <img
                        src={getImageSrc(product.thumbnail)}
                        alt={product?.name || "Product"}
                        className="size-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-100 flex size-10 items-center justify-center rounded-lg flex-shrink-0">
                      <Search className="size-4 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.unit_price ? formatCurrency(product.unit_price) : ""}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-sm text-gray-500">
                No products found for "{query}".
              </div>
            )}

            <button
              onMouseDown={submit}
              className="text-primary-main hover:underline block w-full pt-2 text-center text-xs font-semibold cursor-pointer"
            >
              View all results for "{query}"
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const CURRENCIES = [
  { code: "NGN", symbol: "₦", label: "NGN (₦)" },
  { code: "USD", symbol: "$", label: "USD ($)" },
];

export function Header() {
  const { cartCount, compareList, wishlist, setCartOpen, setMobileMenuOpen } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Persist the customer's chosen currency so the rest of the app (e.g. price
  // conversion) can read it back later without asking again.
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    try {
      const stored = localStorage.getItem("base_currency");
      if (stored) {
        const parsed = JSON.parse(stored);
        const match = CURRENCIES.find((c) => c.code === parsed?.code);
        if (match) return match;
      }
    } catch (err) {
      console.error("Failed to read stored base_currency", err);
    }
    return CURRENCIES[0];
  });

  const handleSelectCurrency = (currency: (typeof CURRENCIES)[number], close: () => void) => {
    setSelectedCurrency(currency);
    localStorage.setItem("base_currency", JSON.stringify(currency));
    close();
  };

  // Check login state via the single centralized auth module.
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Re-check whenever the route changes (e.g. right after a login/logout navigation).
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, [location.pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutUser();
    } catch (err) {
      console.error("Server logout failed, clearing local session anyway", err);
    } finally {
      clearAuthToken();
      setIsLoggedIn(false);
      setLoggingOut(false);
      setConfirmingLogout(false);
      navigate("/login");
    }
  };

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetchCategories()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch((err) => {
        console.error("Failed to load categories", err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const primaryNav = useMemo(
    () => [
      { label: "Home", href: "/" },
      {
        label: "Shop",
        href: "/products",
        children: [
          { label: "All Products", href: "/products" },
          { label: "Wishlist", href: "/wishlist" },
          { label: "Cart", href: "/cart" },
        //  { label: "Compare", href: "/compare-list" },
        ],
      },
      {
        label: "Sellers",
        href: "/vendor-list",
      },
      {
        label: "Categories",
        href: "/products",
        children: categories
          .filter((c) => c.status === "active")
          .map((c) => ({ label: c.name, href: `/products?category_id=${c.id}` })),
      },
      {
        label: "Pages",
        href: "/faq",
        children: [
          { label: "FAQ", href: "/faq" },
          { label: "Privacy Policy", href: "/privacy-policy" },
          { label: "Terms & Conditions", href: "/term-and-conditions" },
        ],
      },
      {
        label: "Blog",
        href: "/blog-list",
      },
      { label: "Contact", href: "/contact" },
    ],
    [categories],
  );

  return (
    <header className="z-50 w-full">
      {/* Top bar */}
      <div className="bg-primary-main hidden py-3 xl:block">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <p className="flex items-center gap-2 text-sm text-white">
                <Phone className="size-4" />
                <span>Need Support? Call Us</span>
                <a
                  href="tel:+4805550103"
                  className="bg-success-light inline-flex h-5 items-center justify-center rounded-full px-2 text-xs font-normal text-gray-800"
                >
                  (480) 555-0103
                </a>
              </p>
              <div className="divide-primary-main-dark hidden divide-x lg:flex">
                <Dropdown
                  trigger={({ toggle }) => (
                    <button
                      onClick={toggle}
                      className="flex items-center gap-1.5 pr-5 text-sm text-white hover:opacity-80 cursor-pointer"
                    >
                      <Globe className="size-4" />
                      English
                      <ChevronDown className="size-4" />
                    </button>
                  )}
                >
                  {(close) => (
                    <div className="w-32 py-1">
                      {["English", "Español", "Français", "Deutsch"].map((l) => (
                        <button
                          key={l}
                          onClick={close}
                          className="hover:bg-primary-main/10 text-gray-secondary block w-full px-4 py-2 text-left text-sm cursor-pointer"
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  )}
                </Dropdown>
                <Dropdown
                  trigger={({ toggle }) => (
                    <button
                      onClick={toggle}
                      className="flex items-center gap-1.5 pl-5 text-sm text-white hover:opacity-80 cursor-pointer"
                    >
                      {selectedCurrency.label}
                      <ChevronDown className="size-4" />
                    </button>
                  )}
                >
                  {(close) => (
                    <div className="w-28 py-1">
                      {CURRENCIES.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => handleSelectCurrency(c, close)}
                          className={cn(
                            "hover:bg-primary-main/10 text-gray-secondary block w-full px-4 py-2 text-left text-sm cursor-pointer",
                            selectedCurrency.code === c.code && "text-primary-main font-medium",
                          )}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  )}
                </Dropdown>
              </div>
            </div>
            <div className="flex items-center gap-4.5">
              <Link to="/user-dashboard" className="hover:text-success-light text-sm text-white transition">
                My Account
              </Link>
              <Link to="/wishlist" className="hover:text-success-light text-sm text-white transition">
                My Wishlist
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Main row - desktop */}
      <div className="hidden w-full border-b border-gray-300 py-4 xl:block">
        <Container>
          <div className="flex items-center justify-between gap-5">
            <Logo />
            <SearchBar className="w-[520px]" />
            <div className="flex items-center gap-6">
              
              <Link
                to="/wishlist"
                className="text-gray-secondary hover:text-primary-main relative flex flex-col items-center text-xs"
              >
                <Heart className="size-6" />
                Wishlist
                {wishlist.length > 0 && (
                  <span className="bg-primary-main absolute -top-1 -right-2 flex size-4 items-center justify-center rounded-full text-[10px] text-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              
              {/* Account Dropdown Section */}
              <div className="group relative">
                <button className="flex items-center gap-2 text-left cursor-pointer">
                  <span className="bg-primary-lighter text-primary-main flex size-10 items-center justify-center rounded-full">
                    <User className="size-5" />
                  </span>
                  <span>
                    <span className="text-gray-secondary flex items-center gap-1 text-sm">
                      Account
                      <ChevronDown className="size-4 transition-transform group-hover:rotate-180" />
                    </span>
                    <span className="text-gray-primary block text-sm font-medium">
                      {isLoggedIn ? "Welcome back" : "Sign in / Sign up"}
                    </span>
                  </span>
                </button>
                <div className="shadow-light invisible absolute top-full right-0 z-50 mt-2 w-52 rounded-2xl border border-gray-300 bg-white p-3 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                  <ul className="space-y-1">
                    {isLoggedIn ? (
                      <>
                        <li>
                          <Link to="/user-dashboard">
                            <button className="hover:bg-primary-main/10 hover:text-primary-main text-gray-secondary flex items-center gap-2 w-full cursor-pointer rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors">
                              <LayoutDashboard className="size-4" />
                              Dashboard
                            </button>
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={() => setConfirmingLogout(true)}
                            className="hover:bg-red-50 hover:text-red-600 text-gray-secondary flex items-center gap-2 w-full cursor-pointer rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors"
                          >
                            <LogOut className="size-4" />
                            Logout
                          </button>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link to="/login">
                            <button className="hover:bg-primary-main/10 hover:text-primary-main text-gray-secondary flex items-center gap-2 w-full cursor-pointer rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors">
                              <LogIn className="size-4" />
                              Login
                            </button>
                          </Link>
                        </li>
                        <li>
                          <Link to="/signup">
                            <button className="hover:bg-primary-main/10 hover:text-primary-main text-gray-secondary flex items-center gap-2 w-full cursor-pointer rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors">
                              <UserPlus className="size-4" />
                              Signup
                            </button>
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCartOpen(true)}
                  className="bg-primary-main text-success-light relative inline-flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full"
                >
                  <ShoppingCart className="size-5" />
                  {cartCount > 0 && (
                    <span className="bg-success-light text-primary-main absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full text-[11px] font-bold">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button onClick={() => setCartOpen(true)} className="cursor-pointer text-left">
                  <span className="text-gray-secondary block text-sm">Cart</span>
                  <span className="text-gray-primary block text-sm font-medium">
                    {cartCount} Items
                  </span>
                </button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Primary nav - desktop */}
      <nav className="hidden border-b border-gray-300 bg-white xl:block">
        <Container>
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => (
              <li key={item.label} className="group relative">
                <Link
                  to={item.href}
                  className="text-gray-primary hover:text-primary-main flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium transition"
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown className="size-4 transition-transform group-hover:rotate-180" />
                  )}
                </Link>
                {item.children && item.children.length > 0 && (
                  <div className="shadow-light invisible absolute top-full left-0 z-50 min-w-52 -translate-y-2 rounded-xl border border-gray-200 bg-white p-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <ul className="space-y-0.5">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            to={child.href}
                            className="hover:bg-primary-main/10 hover:text-primary-main text-gray-secondary block rounded-lg px-4 py-2 text-sm"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      {/* Mobile header */}
      <div className="bg-primary-main border-b border-gray-300 bg-white px-5 py-4 xl:hidden">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-gray-primary flex size-11 items-center justify-center rounded-full border border-gray-300 cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <Logo />
          <button
            onClick={() => setCartOpen(true)}
            className="bg-primary-main text-success-light relative flex size-11 items-center justify-center rounded-full cursor-pointer"
            aria-label="Open cart"
          >
            <ShoppingCart className="size-5" />
            {cartCount > 0 && (
              <span className="bg-success-light text-primary-main absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full text-[11px] font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
        <SearchBar className="mt-4" />
      </div>

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
    </header>
  );
}