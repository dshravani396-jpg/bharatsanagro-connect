import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Package, Star } from "lucide-react";

import storePlaceholder from "@/assets/store-placeholder.jpg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Store } from "@/lib/auth";
import { translatedContent } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";

export function StoreCard({
  store,
  categories = [],
  productCount = 0,
}: {
  store: Store;
  categories?: string[];
  productCount?: number;
}) {
  const { t } = useI18n();

  return (
    <article className="surface-card flex flex-col overflow-hidden transition-shadow hover:shadow-lift">
      <Link to="/stores/$storeId" params={{ storeId: store.id }}>
        <img
          src={store.image_url || storePlaceholder}
          alt={translatedContent(t, "storename", store.store_name)}
          loading="lazy"
          width={1200}
          height={800}
          className="h-40 w-full object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 truncate text-base font-semibold text-primary-deep">
            {translatedContent(t, "storename", store.store_name)}
          </h3>
          <Badge
            variant="outline"
            className={
              store.is_open
                ? "shrink-0 rounded-full border-success/40 bg-success/10 text-success"
                : "shrink-0 rounded-full border-muted-foreground/30 bg-muted text-muted-foreground"
            }
          >
            {store.is_open ? t("common.open") : t("common.closed")}
          </Badge>
        </div>

        <div className="space-y-1.5 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 shrink-0 fill-warning text-warning" />
            {store.rating}
          </p>
          <p className="flex items-start gap-1.5">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-2">
              {translatedContent(t, "address", store.address)}, {translatedContent(t, "district", store.district)}, {translatedContent(t, "state", store.state)} {store.pincode}
            </span>
          </p>
          <p className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            {translatedContent(t, "hours", store.opening_hours)}
          </p>
          <p className="flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5 shrink-0" />
            {t("stores.productCount", { count: productCount })}
          </p>
        </div>

        {categories.length ? (
          <div className="flex flex-wrap gap-1.5">
            {categories.slice(0, 4).map((c) => (
              <Badge key={c} variant="secondary" className="rounded-full text-[11px]">
                {t(`cat.${c}`)}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="mt-auto grid grid-cols-2 gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/stores/$storeId" params={{ storeId: store.id }}>
              {t("common.viewStore")}
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/products" search={{ store: store.id }}>
              {t("common.viewProducts")}
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
