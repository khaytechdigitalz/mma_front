import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, Loader2 } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Logo } from "@/components/ui/Logo";
import { Accordion } from "@/components/ui/Accordion";
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@/components/ui/BrandIcons";
import { useStore } from "@/store/StoreContext";
import {apiClient} from "@/lib/axios"; // Adjust to your actual axios instance import path

interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

export function MobileMenu() {
  const { mobileMenuOpen, setMobileMenuOpen } = useStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);

  const close = () => setMobileMenuOpen(false);

  // Fetch categories dynamically when mobile menu opens
  useEffect(() => {
    if (mobileMenuOpen && categories.length === 0) {
      const fetchCategories = async () => {
        try {
          setCategoriesLoading(true);
          const response = await apiClient.get("/front/categories"); // Adjust to your actual categories endpoint
          if (response.data?.status && response.data?.data) {
            setCategories(response.data.data);
          } else if (Array.isArray(response.data)) {
            setCategories(response.data);
          }
        } catch (error) {
          console.error("Failed to load categories for mobile menu", error);
        } finally {
          setCategoriesLoading(false);
        }
      };

      fetchCategories();
    }
  }, [mobileMenuOpen, categories.length]);

  return (
    <Drawer open={mobileMenuOpen} onClose={close} side="left" widthClassName="max-w-sm">
      <div className="border-gray-tertiary/24 flex items-center justify-between border-b px-5 py-4">
        <Logo />
      </div>
      <div className="p-5">
        <Accordion
          defaultOpenId="shop"
          items={[
            {
              id: "home",
              title: "Home",
              content: (
                <Link onClick={close} to="/" className="text-primary-main text-sm font-medium">
                  Go to homepage
                </Link>
              ),
            },
            {
              id: "shop",
              title: "Shop",
              content: (
                <ul className="space-y-3">
                  {[
                    ["Product Details", "/product-details-1"],
                    ["Wishlist", "/wishlist"],
                    ["Cart", "/cart"],
                    ["Compare", "/compare-list"],
                  ].map(([label, href]) => (
                    <li key={href}>
                      <Link onClick={close} to={href} className="text-gray-secondary hover:text-primary-main text-sm">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              id: "sellers",
              title: "Sellers",
              content: (
                <ul className="space-y-3">
                  <li>
                    <Link onClick={close} to="/vendor-list" className="text-gray-secondary hover:text-primary-main text-sm">
                      All Vendors
                    </Link>
                  </li> 
                </ul>
              ),
            },
            {
              id: "categories",
              title: "Categories",
              content: categoriesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="size-6 animate-spin text-gray-secondary" />
                </div>
              ) : categories.length === 0 ? (
                <p className="text-gray-secondary text-xs">No categories available.</p>
              ) : (
                <ul className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                  {categories.map((c) => (
                    <li key={c.id}>
                      <Link
                        onClick={close}
                        to={`/products?category_id=${c.id}`}
                        className="text-gray-secondary hover:text-primary-main text-sm line-clamp-1 block"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              id: "pages",
              title: "Pages",
              content: (
                <ul className="space-y-3">
                  {[
                    ["FAQ", "/faq"],
                    ["Contact Us", "/contact"],
                    ["User Dashboard", "/user-dashboard"],
                    ["Privacy Policy", "/privacy-policy"],
                    ["Terms & Conditions", "/term-and-conditions"],
                  ].map(([label, href]) => (
                    <li key={href}>
                      <Link onClick={close} to={href} className="text-gray-secondary hover:text-primary-main text-sm">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ),
            },
          ]}
        />
 

        <div className="mt-6 rounded-xl border border-gray-300 p-4">
          <Link to="/login" onClick={close}>
            <button
              className="bg-primary-main text-success-light mb-3 w-full cursor-pointer rounded-full py-2.5 text-sm font-medium"
            >
              Account Login
            </button>
          </Link>
          <div className="text-gray-secondary flex items-center gap-2 text-sm">
            <Phone className="size-4" /> (480) 555-0103
          </div>
          <div className="text-gray-secondary mt-2 flex items-center gap-2 text-sm">
            <Mail className="size-4" /> help@company.com
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-gray-primary mb-3 text-sm font-bold">Follow us</h4>
          <div className="flex items-center gap-3">
            {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="text-gray-secondary hover:text-primary-main hover:border-primary-main flex size-9 items-center justify-center rounded-full border border-gray-300"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
}