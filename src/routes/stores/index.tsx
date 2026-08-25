import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { PageHeading, PageShell } from "@/components/PageShell";
import { StoreCard } from "@/components/StoreCard";
import { Input } from "@/components/ui/input";
import { useStores } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/stores/")({
  head: () => ({
    meta: [
      { title: "Agro Store Directory — Bharatsanagro" },
      {
        name: "description",
        content:
          "Find verified Agro Stores across India by district, pincode or name, see their product range, ratings and opening hours.",
      },
      { property: "og:title", content: "Agro Store Directory — Bharatsanagro" },
      {
        property: "og:description",
        content: "Verified Agro Stores with product categories, ratings and opening hours.",
      },
    ],
  }),
  component: StoresPage,
});

function StoresPage() {
  const { t } = useI18n();
  const { data: stores = [], isLoading } = useStores();
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    if (!query.trim()) return stores;
    const q = query.trim().toLowerCase();
    return stores.filter((s) =>
      [s.store_name, s.district, s.state, s.pincode, s.address].some((v) =>
        v?.toLowerCase().includes(q),
      ),
    );
  }, [stores, query]);

  return (
    <PageShell>
      <div className="container-page space-y-6 py-10">
        <PageHeading title={t("stores.title")} subtitle={t("stores.subtitle")} />

        <Input
          placeholder={t("stores.searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={t("common.search")}
          className="max-w-xl"
        />

        {isLoading ? (
          <p className="py-10 text-center text-muted-foreground">{t("common.loading")}</p>
        ) : list.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((s) => {
              const available = (s.products ?? []).filter((p) => p.is_available);
              return (
                <StoreCard
                  key={s.id}
                  store={s}
                  productCount={available.length}
                  categories={[...new Set(available.map((p) => p.category))]}
                />
              );
            })}
          </div>
        ) : (
          <p className="py-10 text-center text-muted-foreground">{t("stores.notFound")}</p>
        )}
      </div>
    </PageShell>
  );
}
