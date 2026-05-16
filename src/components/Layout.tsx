import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AUTH_EVENT, getCurrentUser, signOut } from "../lib/auth";
import { getEntitlementsEventName } from "../lib/entitlements";
import { SiteFooter } from "./SiteFooter";
import { DocumentWatermark } from "./decor/SvgDecor";

const nav = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/pricing", label: "Pricing" },
  { to: "/certification", label: "Certification" },
];

export function Layout() {
  const loc = useLocation();
  const [authVersion, setAuthVersion] = useState(0);
  const user = getCurrentUser();

  useEffect(() => {
    const refresh = () => setAuthVersion((value) => value + 1);
    window.addEventListener(AUTH_EVENT, refresh);
    window.addEventListener(getEntitlementsEventName(), refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(AUTH_EVENT, refresh);
      window.removeEventListener(getEntitlementsEventName(), refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  void authVersion;

  return (
    <div className="relative flex min-h-screen flex-col bg-mesh-soft">
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid-pattern opacity-[0.4]" />

      <header className="sticky top-0 z-50 w-full overflow-hidden border-b border-slate-200 bg-white/85 backdrop-blur-md">
        <DocumentWatermark className="pointer-events-none absolute -right-4 top-1/2 hidden h-36 w-28 -translate-y-1/2 text-slate-300 opacity-35 sm:block md:-right-2 md:h-44 md:w-36" />
        <div className="relative mx-auto flex w-full max-w-[90rem] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
          <Link to="/" className="group flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-sm">
              S
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900 transition group-hover:text-blue-600">
              SkillWrite
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  loc.pathname === n.to
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {n.label}
              </Link>
            ))}
            {user ? (
              <button
                type="button"
                onClick={() => void signOut()}
                className="ml-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                title={user.email}
              >
                {user.name.split(" ")[0]} · Sign out
              </button>
            ) : (
              <Link
                to="/login"
                className={`ml-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  loc.pathname === "/login"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-[90rem] flex-grow px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
        <Outlet />
      </main>

      <SiteFooter />
    </div>
  );
}
