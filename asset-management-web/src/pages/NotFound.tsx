import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[color:var(--bg)] text-[color:var(--text-main)] overflow-hidden transition-colors duration-300">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[color:var(--color-aqua)] opacity-5 blur-[120px]" />
      </div>

      <div className="relative z-10 text-center space-y-6">
        <h1 className="text-8xl font-extrabold text-[color:var(--color-growth-green)] tracking-tight">404</h1>
        <h2 className="text-2xl font-bold">Page not found</h2>
        <p className="text-[color:var(--text-muted)] max-w-sm mx-auto">
          We can't seem to find the page you're looking for. It might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <div className="pt-4 flex justify-center">
          <Link to="/">
            <Button variant="primary">
              Go back home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
