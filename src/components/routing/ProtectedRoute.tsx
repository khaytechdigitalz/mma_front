import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";

/**
 * Gates customer-only pages (dashboard, orders, addresses, etc). Anyone
 * without a token is bounced to /login, and we remember where they were
 * headed so Login can send them straight back after signing in.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return <>{children}</>;
}
