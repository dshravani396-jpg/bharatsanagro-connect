import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Menu, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { BrandLogo } from "@/components/BrandLogo";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

type NavItem = { to: string; labelKey: string };

const GUEST_NAV: NavItem[] = [
  { to: "/", labelKey: "nav.home" },
  { to: "/products", labelKey: "nav.products" },
  { to: "/stores", labelKey: "nav.stores" },
  { to: "/how-it-works", labelKey: "nav.howItWorks" },
  { to: "/about", labelKey: "nav.about" },
  { to: "/contact", labelKey: "nav.contact" },
];

const FARMER_NAV: NavItem[] = [
  { to: "/dashboard", labelKey: "nav.home" },
  { to: "/products", labelKey: "nav.products" },
  { to: "/stores", labelKey: "nav.stores" },
  { to: "/bookings", labelKey: "nav.myBookings" },
  { to: "/profile", labelKey: "nav.profile" },
];

const STORE_NAV: NavItem[] = [
  { to: "/store/dashboard", labelKey: "nav.dashboard" },
  { to: "/store/products", labelKey: "nav.products" },
  { to: "/store/bookings", labelKey: "nav.bookings" },
  { to: "/store/profile", labelKey: "nav.storeProfile" },
];

export function SiteHeader() {
  const { t } = useI18n();
  const { session, role, profile, store, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const nav = role === "store" ? STORE_NAV : role === "farmer" ? FARMER_NAV : GUEST_NAV;
  const displayName = role === "store" ? store?.store_name : profile?.full_name;

  async function handleSignOut() {
    await signOut();
    toast.success(t("auth.loggedOut"));
    void navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
      <div className="container-page grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3">
        <BrandLogo
          to={role === "store" ? "/store/dashboard" : role === "farmer" ? "/dashboard" : "/"}
        />

        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "bg-accent text-accent-foreground" }}
                className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          <LanguageSelector />

          {session ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label={t("nav.notifications")}>
                    <Bell className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>{t("nav.notifications")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>{t("nav.noNotifications")}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label={t("nav.profile")}>
                    <UserIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">{displayName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={role === "store" ? "/store/profile" : "/profile"}>
                      {role === "store" ? t("nav.storeProfile") : t("nav.profile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="outline" size="sm">
                <Link to="/auth">{t("nav.login")}</Link>
              </Button>
            </div>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label={t("nav.menu")}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm">
              <SheetTitle className="sr-only">{t("nav.menu")}</SheetTitle>
              <div className="flex flex-col gap-1 p-4 pt-10">
                {nav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    activeProps={{ className: "bg-accent text-accent-foreground" }}
                    className="rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-accent"
                  >
                    {t(item.labelKey)}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-2">
                  {session ? (
                    <Button variant="outline" onClick={handleSignOut} className="justify-start">
                      <LogOut className="mr-2 h-4 w-4" />
                      {t("nav.logout")}
                    </Button>
                  ) : (
                    <Button asChild variant="outline" onClick={() => setOpen(false)}>
                      <Link to="/auth">{t("nav.login")}</Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
