import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

import { PageHeading, PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How Bharatsanagro Works — Book and Collect" },
      {
        name: "description",
        content:
          "Search products, pick a nearby Agro Store, book online and collect from the store. Bharatsanagro does not deliver — you collect directly.",
      },
      { property: "og:title", content: "How Bharatsanagro Works — Book and Collect" },
      {
        property: "og:description",
        content: "Four simple steps from search to store pickup for Indian farmers.",
      },
    ],
  }),
  component: HowItWorks,
});

function HowItWorks() {
  const { t } = useI18n();
  const steps = [1, 2, 3, 4] as const;

  return (
    <PageShell>
      <div className="container-page space-y-8 py-10">
        <PageHeading title={t("nav.howItWorks")} subtitle={t("home.heroSubtitle")} />
        <div className="grid gap-4 sm:grid-cols-2">
          {steps.map((n) => (
            <div key={n} className="surface-card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {n}
              </span>
              <h2 className="mt-3 text-lg font-semibold text-primary-deep">{t(`home.step${n}`)}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t(`home.step${n}Desc`)}</p>
            </div>
          ))}
        </div>
        <p className="flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/5 p-4 text-sm font-medium text-primary-deep">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
          {t("home.noDelivery")}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/products">{t("home.exploreProducts")}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/stores">{t("home.findStores")}</Link>
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
