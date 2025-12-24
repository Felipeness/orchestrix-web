import { Outlet, Link, useLocation } from "react-router-dom";
import { clsx } from "clsx";

const navItems = [
  { path: "/", label: "Dashboard" },
  { path: "/workflows", label: "Workflows" },
  { path: "/settings", label: "Settings" },
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center">
          <div className="mr-8 flex items-center space-x-2">
            <span className="text-xl font-bold">Orchestrix</span>
          </div>
          <nav className="flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === item.path
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-6">
        <Outlet />
      </main>
    </div>
  );
}
