import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { BookingDialog } from "@/components/BookingDialog";
import { PageHeading, PageShell } from "@/components/PageShell";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/catalog";
import { useProducts, type ProductWithStore } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>) => {
    const out: { category?: string; store?: string } = {};
    if (typeof search["category"] === "string") out.category = search["category"];
    if (typeof search["store"] === "string") out.store = search["store"];
    return out;
  },

  head: () => ({
    meta: [
      { title: "Agricultural Products — Bharatsanagro" },
      {
        name: "description",
        content:
          "Browse seeds, fertilizers, pesticides, irrigation and farm equipment available at Agro Stores near you and book for store pickup.",
      },
      { property: "og:title", content: "Agricultural Products — Bharatsanagro" },
      {
        property: "og:description",
        content: "Search and filter agro products by category, price and location.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { t } = useI18n();
  const { category, store } = Route.useSearch();
  const { data: products = [], isLoading } = useProducts();
  const [booking, setBooking] = useState<ProductWithStore | null>(null);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState(category ?? "all");
  const [availability, setAvailability] = useState("all");
  const [sort, setSort] = useState("new");
  const [location, setLocation] = useState("");

  const list = useMemo(() => {
    let rows = products.slice();
    if (store) rows = rows.filter((p) => p.store_id === store);
    if (cat !== "all") rows = rows.filter((p) => p.category === cat);
    if (availability !== "all") {
      const want = availability === "available";
      rows = rows.filter((p) => (p.is_available && p.quantity > 0) === want);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      rows = rows.filter((p) =>
        [p.name, p.brand, p.stores?.store_name].some((v) => v?.toLowerCase().includes(q)),
      );
    }
    if (location.trim()) {
      const l = location.trim().toLowerCase();
      rows = rows.filter((p) =>
        [p.stores?.district, p.stores?.state, p.stores?.pincode].some((v) =>
          v?.toLowerCase().includes(l),
        ),
      );
    }
    rows.sort((a, b) => {
      if (sort === "priceLow") return Number(a.price) - Number(b.price);
      if (sort === "priceHigh") return Number(b.price) - Number(a.price);
      if (sort === "name") return a.name.localeCompare(b.name);
      return b.created_at.localeCompare(a.created_at);
    });
    return rows;
  }, [products, store, cat, availability, query, location, sort]);

  return (
    <PageShell>
      <div className="container-page space-y-6 py-10">
        <PageHeading title={t("products.title")} subtitle={t("products.subtitle")} />

        <div className="surface-card grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Input
              placeholder={t("products.searchPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={t("common.search")}
            />
          </div>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger aria-label={t("products.filterCategory")}>
              <SelectValue placeholder={t("products.filterCategory")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.emoji} {t(`cat.${c.value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={availability} onValueChange={setAvailability}>
            <SelectTrigger aria-label={t("products.filterAvailability")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              <SelectItem value="available">{t("common.available")}</SelectItem>
              <SelectItem value="unavailable">{t("common.unavailable")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger aria-label={t("products.sort")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">{t("products.sortNew")}</SelectItem>
              <SelectItem value="priceLow">{t("products.sortPriceLow")}</SelectItem>
              <SelectItem value="priceHigh">{t("products.sortPriceHigh")}</SelectItem>
              <SelectItem value="name">{t("products.sortName")}</SelectItem>
            </SelectContent>
          </Select>
          <div className="lg:col-span-2">
            <Input
              placeholder={t("products.filterLocation")}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-label={t("products.filterLocation")}
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {t("products.count", { count: list.length })}
        </p>

        {isLoading ? (
          <p className="py-10 text-center text-muted-foreground">{t("common.loading")}</p>
        ) : list.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} onBook={setBooking} />
            ))}
          </div>
        ) : (
          <p className="py-10 text-center text-muted-foreground">{t("products.notFound")}</p>
        )}
      </div>
      <BookingDialog product={booking} onOpenChange={(o) => !o && setBooking(null)} />
    </PageShell>
  );
}
