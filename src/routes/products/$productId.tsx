import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import { useState } from "react";

import productPlaceholder from "@/assets/product-placeholder.jpg";
import { BookingDialog } from "@/components/BookingDialog";
import { PageShell } from "@/components/PageShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice, translatedContent } from "@/lib/catalog";
import { useProduct, type ProductWithStore } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/products/$productId")({
  head: () => ({
    meta: [
      { title: "Product Details — Bharatsanagro" },
      {
        name: "description",
        content:
          "See price, availability, packaging details and store location for this agricultural product, then book it for pickup.",
      },
      { property: "og:title", content: "Product Details — Bharatsanagro" },
      {
        property: "og:description",
        content: "Product price, stock, expiry details and the Agro Store that stocks it.",
      },
    ],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { t } = useI18n();
  const { productId } = Route.useParams();
  const { data: product, isLoading } = useProduct(productId);
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

  if (!product) {
    return (
      <PageShell>
        <div className="container-page py-20 text-center">
          <h1 className="text-2xl font-semibold text-primary-deep">{t("products.notFound")}</h1>
          <Button asChild className="mt-6">
            <Link to="/products">{t("nav.products")}</Link>
          </Button>
        </div>
      </PageShell>
    );
  }

  const inStock = product.is_available && product.quantity > 0;

  return (
    <PageShell>
      <div className="container-page space-y-6 py-10">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back")}
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-2">
          <img
            src={product.image_url || productPlaceholder}
            alt={product.name}
            width={1200}
            height={900}
            className="surface-card h-64 w-full object-cover sm:h-96"
          />

          <div className="space-y-5">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="rounded-full">
                  {t(`cat.${product.category}`)}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    inStock
                      ? "rounded-full border-success/40 bg-success/10 text-success"
                      : "rounded-full border-destructive/30 bg-destructive/10 text-destructive"
                  }
                >
                  {inStock ? t("common.available") : t("common.unavailable")}
                </Badge>
              </div>
              <h1 className="mt-3 text-2xl font-semibold text-primary-deep sm:text-3xl">
                {translatedContent(t, "prod", product.name)}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("common.brand")}: {product.brand || "—"}
              </p>
            </div>

            <p className="text-2xl font-semibold text-primary">{formatPrice(product.price)}</p>

            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-muted/60 p-3">
                <dt className="text-xs text-muted-foreground">{t("products.availableQty")}</dt>
                <dd className="font-medium">
                  {product.quantity} {product.unit}
                </dd>
              </div>
              <div className="rounded-xl bg-muted/60 p-3">
                <dt className="text-xs text-muted-foreground">{t("products.mfgDate")}</dt>
                <dd className="font-medium">{formatDate(product.mfg_date)}</dd>
              </div>
              <div className="rounded-xl bg-muted/60 p-3">
                <dt className="text-xs text-muted-foreground">{t("products.expiryDate")}</dt>
                <dd className="font-medium">{formatDate(product.expiry_date)}</dd>
              </div>
              <div className="rounded-xl bg-muted/60 p-3">
                <dt className="text-xs text-muted-foreground">{t("common.rating")}</dt>
                <dd className="flex items-center gap-1.5 font-medium">
                  <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                  {product.stores?.rating}
                </dd>
              </div>
            </dl>

            {product.description ? (
              <div>
                <h2 className="text-base font-semibold text-primary-deep">
                  {t("products.description")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
              </div>
            ) : null}

            <div className="surface-card p-4">
              <h2 className="text-base font-semibold text-primary-deep">
                {t("products.storeInfo")}
              </h2>
              <p className="mt-2 text-sm font-medium">{translatedContent(t, "storename", product.stores?.store_name)}</p>
              <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {product.stores?.address}, {product.stores?.district}, {translatedContent(t, "state", product.stores?.state)}{" "}
                {product.stores?.pincode}
              </p>
              {product.stores ? (
                <Button asChild variant="outline" size="sm" className="mt-3">
                  <Link to="/stores/$storeId" params={{ storeId: product.stores.id }}>
                    {t("common.viewStore")}
                  </Link>
                </Button>
              ) : null}
            </div>

            <p className="rounded-xl border border-primary/25 bg-primary/5 p-3 text-xs text-primary-deep">
              {t("products.collectNote")}
            </p>

            <Button size="lg" className="w-full" disabled={!inStock} onClick={() => setBooking(product)}>
              {t("products.bookProduct")}
            </Button>
          </div>
        </div>
      </div>
      <BookingDialog product={booking} onOpenChange={(o) => !o && setBooking(null)} />
    </PageShell>
  );
}
