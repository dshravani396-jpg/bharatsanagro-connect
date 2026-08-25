import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, MapPin, Phone, Star } from "lucide-react";
import { useState } from "react";

import storePlaceholder from "@/assets/store-placeholder.jpg";
import { BookingDialog } from "@/components/BookingDialog";
import { PageShell } from "@/components/PageShell";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore, useStoreProducts, type ProductWithStore } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/stores/$storeId")({
  head: () => ({
    meta: [
      { title: "Agro Store Profile — Bharatsanagro" },
      {
        name: "description",
        content:
          "View an Agro Store profile with address, opening hours, rating and the full list of products available for booking.",
      },
      { property: "og:title", content: "Agro Store Profile — Bharatsanagro" },
      {
        property: "og:description",
        content: "Store address, opening hours and available agricultural products.",
      },
    ],
  }),
  component: StoreDetail,
});

function StoreDetail() {
  const { t } = useI18n();
  const { storeId } = Route.useParams();
  const { data: store, isLoading } = useStore(storeId);
  const { data: products = [] } = useStoreProducts(storeId);
  const [booking, setBooking] = useState<ProductWithStore | null>(null);

  if (isLoading) {
    return (
      <PageShell>
        <p className="container-page py-20 text-center text-muted-foreground">
          {t("common.loading")}
        </p>
      </PageShell>
    );
  }

  if (!store) {
    return (
      <PageShell>
        <div className="container-page py-20 text-center">
          <h1 className="text-2xl font-semibold text-primary-deep">{t("stores.notFound")}</h1>
          <Button asChild className="mt-6">
            <Link to="/stores">{t("nav.stores")}</Link>
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="container-page space-y-6 py-10">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/stores">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back")}
          </Link>
        </Button>

        <div className="surface-card overflow-hidden">
          <img
            src={store.image_url || storePlaceholder}
            alt={store.store_name}
            width={1600}
            height={600}
            className="h-48 w-full object-cover sm:h-64"
          />
          <div className="space-y-3 p-5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold text-primary-deep">{store.store_name}</h1>
              <Badge
                variant="outline"
                className={
                  store.is_open
                    ? "rounded-full border-success/40 bg-success/10 text-success"
                    : "rounded-full border-muted-foreground/30 bg-muted text-muted-foreground"
                }
              >
                {store.is_open ? t("common.open") : t("common.closed")}
              </Badge>
            </div>
            <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              <p className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-warning text-warning" />
                {store.rating}
              </p>
              <p className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {t("stores.openingHours")}: {store.opening_hours}
              </p>
              <p className="flex items-start gap-1.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                {store.address}, {store.district}, {store.state} {store.pincode}
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="h-4 w-4" />
                {store.mobile}
              </p>
            </div>
            {store.description ? (
              <div>
                <h2 className="text-base font-semibold text-primary-deep">{t("stores.about")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{store.description}</p>
              </div>
            ) : null}
          </div>
        </div>

        <h2 className="text-xl font-semibold text-primary-deep">
          {t("stores.productCount", { count: products.length })}
        </h2>
        {products.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={{ ...p, stores: store }} onBook={setBooking} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">{t("store.noProducts")}</p>
        )}
      </div>
      <BookingDialog product={booking} onOpenChange={(o) => !o && setBooking(null)} />
    </PageShell>
  );
}
