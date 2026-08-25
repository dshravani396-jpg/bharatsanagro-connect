import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Package, Search, Store as StoreIcon, User as UserIcon } from "lucide-react";

import { PageHeading, PageShell } from "@/components/PageShell";
import { RequireRole } from "@/components/RequireRole";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/catalog";
import { useMyBookings } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Farmer Dashboard — Bharatsanagro" },
      {
        name: "description",
        content:
          "Your farmer dashboard: search products, find nearby Agro Stores and track your latest bookings.",
      },
      { property: "og:title", content: "Farmer Dashboard — Bharatsanagro" },
      { property: "og:description", content: "Track bookings and find agro inputs near you." },
    ],
  }),
  component: () => (
    <RequireRole role="farmer">
      <FarmerDashboard />
    </RequireRole>
  ),
});

function FarmerDashboard() {
  const { t } = useI18n();
  const { user, profile } = useAuth();
  const { data: bookings = [] } = useMyBookings(user?.id);

  const actions = [
    { to: "/products" as const, icon: Search, key: "farmer.searchProducts" },
    { to: "/stores" as const, icon: StoreIcon, key: "farmer.findStores" },
    { to: "/bookings" as const, icon: Package, key: "farmer.myBookings" },
    { to: "/profile" as const, icon: UserIcon, key: "farmer.myProfile" },
  ];

  return (
    <PageShell>
      <div className="container-page space-y-8 py-10">
        <PageHeading
          title={`${t("farmer.welcome")}${profile?.full_name ? `, ${profile.full_name}` : ""}`}
          subtitle={t("farmer.welcomeSub")}
        />

        {profile?.district || profile?.village ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            {[profile.village, profile.district, profile.state].filter(Boolean).join(", ")}
          </p>
        ) : null}

        <section>
          <h2 className="text-lg font-semibold text-primary-deep">{t("farmer.quickActions")}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {actions.map(({ to, icon: Icon, key }) => (
              <Link
                key={to}
                to={to}
                className="surface-card flex items-center gap-3 p-5 transition-shadow hover:shadow-lift"
              >
                <Icon className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm font-medium text-primary-deep">{t(key)}</span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-primary-deep">{t("booking.myTitle")}</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/bookings">{t("booking.viewBookings")}</Link>
            </Button>
          </div>
          {bookings.length ? (
            <ul className="mt-4 grid gap-3">
              {bookings.slice(0, 4).map((b) => (
                <li key={b.id} className="surface-card flex flex-wrap items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-primary-deep">
                      {b.product_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {b.booking_code} · {formatDate(b.created_at)} · {formatPrice(b.total_price)}
                    </p>
                  </div>
                  <StatusBadge status={b.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">{t("booking.empty")}</p>
          )}
        </section>
      </div>
    </PageShell>
  );
}
