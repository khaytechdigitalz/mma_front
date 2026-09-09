import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ScrollToTopButton } from "@/components/layout/ScrollToTop";
import { useStore } from "@/store/StoreContext";
import { LogoWatermark } from "@/components/ui/Logo";

export function Layout() {
  const location = useLocation();
  const { cartOpen, setCartOpen } = useStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col relative bg-slate-50/50 overflow-x-hidden">
      {/* Background Watermark Layer - a single tiled CSS background sharing
          one cached logo fetch, so it covers the full page length without
          re-requesting the logo per tile. */}
      <LogoWatermark />

      {/* Main Content Layout Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pb-16 xl:pb-0">
          <Outlet />
        </main>
        <Footer />

        <MobileMenu />
        <CartDrawer cartOpen={cartOpen} setCartOpen={setCartOpen} />
        <MobileBottomNav />
        <ScrollToTopButton />
      </div>
    </div>
  );
}