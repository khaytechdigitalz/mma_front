import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-primary-main text-6xl font-extrabold">404</h1>
      <h2 className="text-gray-primary text-xl font-bold">Page not found</h2>
      <p className="text-gray-secondary max-w-sm">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
