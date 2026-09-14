import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { StoreProvider } from "@/store/StoreContext";

import { Home } from "@/pages/Home";
import { Products } from "@/pages/Products";
import { ProductDetails } from "@/pages/ProductDetails";
import { Cart } from "@/pages/Cart";
import { Checkout } from "@/pages/Checkout";
import { VerifyPaystack } from "@/pages/(payment)/VerifyPaystack";
import { VendorList } from "@/pages/VendorList";
import { VendorProfile } from "@/pages/VendorProfile";
import { BlogList } from "@/pages/BlogList";
import { BlogDetails } from "@/pages/BlogDetails";
import { Faq } from "@/pages/Faq";
import { Contact } from "@/pages/Contact";
import { Wishlist } from "@/pages/Wishlist";
import { CompareList } from "@/pages/CompareList";
import { OrderSuccess } from "@/pages/OrderSuccess";
import { EmptyCartScreen } from "@/pages/EmptyCartScreen";
import { ComingSoon } from "@/pages/ComingSoon";
import { PrivacyPolicy } from "@/pages/PrivacyPolicy";
import { TermsAndConditions } from "@/pages/TermsAndConditions";
import { UserDashboard } from "@/pages/account/UserDashboard";
import { Orders } from "@/pages/account/Orders";
import { OrderDetails } from "@/pages/account/OrderDetails";
import { TrackOrder } from "@/pages/account/TrackOrder";
import { AddressBook } from "@/pages/account/AddressBook";
import { ProfileSettings } from "@/pages/account/ProfileSettings";
import { SecuritySettings } from "@/pages/account/SecuritySettings";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { Signup } from "@/pages/(auth)/Signup";
import { Login } from "@/pages/(auth)/Login";
import { OtpVerification } from "@/pages/(auth)/OtpVerification";
import { VerifyEmail } from "@/pages/(auth)/VerifyEmail";
import { PasswordLost } from "@/pages/(auth)/PasswordLost";
import { PasswordReset } from "@/pages/(auth)/PasswordReset";
import { PasswordResetSuccess } from "@/pages/(auth)/PasswordResetSuccess";
import { NotFound } from "@/pages/NotFound";

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="product-details-1" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="/checkout/verify-payment/paystack/:orderId" element={<VerifyPaystack />} />
            <Route path="vendor-list" element={<VendorList />} />
            <Route path="vendor-profile" element={<VendorProfile />} />
            <Route path="blog-list" element={<BlogList />} />
            <Route path="blog-details" element={<BlogDetails />} />
            <Route path="faq" element={<Faq />} />
            <Route path="contact" element={<Contact />} />
            <Route path="wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="compare-list" element={<CompareList />} />
            <Route path="order-success" element={<OrderSuccess />} />
            <Route path="empty-cart-screen" element={<EmptyCartScreen />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="term-and-conditions" element={<TermsAndConditions />} />
            <Route path="user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="my-orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="order-details" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
            <Route path="track-order" element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />
            <Route path="address-book" element={<ProtectedRoute><AddressBook /></ProtectedRoute>} />
            <Route path="profile-settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
            <Route path="security-settings" element={<ProtectedRoute><SecuritySettings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Full-page, header/footer-free routes */}
          <Route path="coming-soon" element={<ComingSoon />} />
          <Route path="signup" element={<Signup />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="login" element={<Login />} />
          <Route path="otp-verification" element={<OtpVerification />} />
          <Route path="password-lost" element={<PasswordLost />} />
          <Route path="password-reset" element={<PasswordReset />} />
          <Route path="password-reset-success" element={<PasswordResetSuccess />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
