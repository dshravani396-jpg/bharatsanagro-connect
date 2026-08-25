import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ClipboardList, Package, PackageCheck } from "lucide-react";

import { PageHeading, PageShell } from "@/components/PageShell";
import { RequireRole } from "@/components/RequireRole";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/catalog";
import { useStoreBookings, useStoreProducts } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/store/dashboard")({
  head: () => ({
    meta: [
      { title: "Store Dashboard — Bharatsanagro" },
      {
        name: "description",
        content:
          "Agro Store dashboard with product counts, new farmer bookings and pickup status at a glance.",
      },
      { property: "og:title", content: "Store Dashboard — Bharatsanagro" },
      { property: "og:description", content: "Manage products and farmer bookings in one place." },
    ],
  }),
  component: () => (
    <RequireRole role="store">
      <StoreDashboard />
    </RequireRole>
  ),
});

function StoreDashboard() {
  const { t } = useI18n();
  const { store } = useAuth();
  const { data: products = [] } = useStoreProducts(store?.id);
  const { data: bookings = [] } = useStoreBookings(store?.id);

  const stats = [
    { icon: Package, label: t("store.totalProducts"), value: products.length },
    {
      icon: PackageCheck,
      label: t("store.availableProducts"),
      value: products.filter((p) => p.is_available && p.quantity > 0).length,
    },
    {
      icon: ClipboardList,
      label: t("store.newBookings"),
      value: bookings.filter((b) => b.status === "pending").length,
    },
    {
      icon: CheckCircle2,
      label: t("store.completedBookings"),
      value: bookings.filter((b) => b.status === "collected").length,
    },
  ];

  return (
    <PageShell>
      <div className="container-page space-y-8 py-10">
        <PageHeading
          title={`${t("store.welcome")}${store?.store_name ? `, ${store.store_name}` : ""}`}
          subtitle={t("store.welcomeSub")}
          action={
            <Button asChild>
              <Link to="/store/products">{t("store.addProduct")}</Link>
            </Button>
          }
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="surface-card p-5">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-3 text-2xl font-semibold text-primary-deep">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <section>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-primary-deep">{t("store.farmerBookings")}</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/store/bookings">{t("nav.bookings")}</Link>
            </Button>
          </div>
          {bookings.length ? (
            <ul className="mt-4 grid gap-3">
              {bookings.slice(0, 5).map((b) => (
                <li key={b.id} className="surface-card flex flex-wrap items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-primary-deep">
                      {b.product_name} × {b.quantity}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {b.farmer_name} · {b.farmer_mobile} · {formatDate(b.created_at)} ·{" "}
                      {formatPrice(b.total_price)}
                    </p>
                  </div>
                  <StatusBadge status={b.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">{t("store.noBookings")}</p>
          )}
        </section>
      </div>
    </PageShell>
  );
}
