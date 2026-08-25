import { Link } from "@tanstack/react-router";
import { MapPin, Star, Store as StoreIcon } from "lucide-react";

import productPlaceholder from "@/assets/product-placeholder.jpg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, translatedContent, unitLabel } from "@/lib/catalog";
import type { ProductWithStore } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export function ProductCard({
  product,
  onBook,
}: {
  product: ProductWithStore;
  onBook: (product: ProductWithStore) => void;
}) {
  const { t } = useI18n();
  const inStock = product.is_available && product.quantity > 0;

  return (
    <article className="surface-card flex flex-col overflow-hidden transition-shadow hover:shadow-lift">
      <Link to="/products/$productId" params={{ productId: product.id }} className="block">
        <img
          src={product.image_url || productPlaceholder}
          alt={product.name}
          loading="lazy"
          width={900}
          height={700}
          className="h-40 w-full object-cover sm:h-44"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-primary-deep">{translatedContent(t, "prod", product.name)}</h3>
            <p className="truncate text-xs text-muted-foreground">
              {product.brand || "—"} · {t(`cat.${product.category}`)}
            </p>
          </div>
          <Badge
            variant="outline"
            className={
              inStock
                ? "shrink-0 rounded-full border-success/40 bg-success/10 text-success"
                : "shrink-0 rounded-full border-destructive/30 bg-destructive/10 text-destructive"
            }
          >
            {inStock ? t("common.available") : t("common.unavailable")}
          </Badge>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-lg font-semibold text-primary">{formatPrice(product.price)}</span>
          <span className="text-xs text-muted-foreground">
            {t("products.availableQty")}: {product.quantity} {unitLabel(t, product.unit)}
          </span>
        </div>

        <div className="space-y-1 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
          <p className="flex min-w-0 items-center gap-1.5 font-medium text-foreground">
            <StoreIcon className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate">{translatedContent(t, "storename", product.stores?.store_name)}</span>
          </p>
          <p className="flex min-w-0 items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {product.stores?.district}, {translatedContent(t, "state", product.stores?.state)}
            </span>
          </p>
          <p className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 shrink-0 fill-warning text-warning" />
            {product.stores?.rating}
          </p>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/products/$productId" params={{ productId: product.id }}>
              {t("common.viewDetails")}
            </Link>
          </Button>
          <Button size="sm" disabled={!inStock} onClick={() => onBook(product)}>
            {t("common.bookNow")}
          </Button>
        </div>
      </div>
    </article>
  );
}
