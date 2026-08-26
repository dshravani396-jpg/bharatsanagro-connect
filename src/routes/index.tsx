import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, MapPin, ShieldCheck, Sprout, Star, Store as StoreIcon } from "lucide-react";
import { useState } from "react";

import heroImage from "@/assets/auth-hero.jpg";
import { BookingDialog } from "@/components/BookingDialog";
import { ContactSection } from "@/components/ContactSection";
import { PageShell } from "@/components/PageShell";
import { ProductCard } from "@/components/ProductCard";
import { ReviewsSection } from "@/components/ReviewsSection";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/catalog";
import { useProducts, type ProductWithStore } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bharatsanagro — Farmer to Agro Store Booking Platform" },
      {
        name: "description",
        content:
          "Discover agricultural products at Agro Stores near you, book online and collect directly from the store. शेतकऱ्याची प्रगती, देशाची समृद्धी.",
      },
      { property: "og:title", content: "Bharatsanagro — Farmer to Agro Store Booking Platform" },
      {
        property: "og:description",
        content: "Book seeds, fertilizers and equipment from nearby Agro Stores across India.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { t } = useI18n();
  const { data: products = [] } = useProducts();
  const [booking, setBooking] = useState<ProductWithStore | null>(null);

  const steps = [1, 2, 3, 4] as const;
  const trust = [
    { icon: ShieldCheck, key: 1 },
    { icon: MapPin, key: 2 },
    { icon: Sprout, key: 3 },
    { icon: StoreIcon, key: 4 },
  ];

  return (
    <PageShell>
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImage}
          alt="Indian farmer walking through green agricultural fields near an agro store"
          width={1600}
          height={1104}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-primary-deep/75" />
        <div className="container-page relative py-20 text-center sm:py-28">
          <h1
            className="mx-auto max-w-3xl text-3xl font-semibold text-primary-foreground sm:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("brand.tagline")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-primary-foreground/85 sm:text-lg">
            {t("home.heroSubtitle")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/products">{t("home.exploreProducts")}</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/stores">{t("home.findStores")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <h2 className="text-2xl font-semibold text-primary-deep">{t("home.categoriesTitle")}</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.value}
              to="/products"
              search={{ category: c.value }}
              className="surface-card flex flex-col gap-2 p-5 transition-shadow hover:shadow-lift"
            >
              <span className="text-3xl">{c.emoji}</span>
              <span className="text-sm font-medium text-primary-deep">{t(`cat.${c.value}`)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 py-14">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-primary-deep">{t("home.howTitle")}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((n) => (
              <div key={n} className="surface-card p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {n}
                </span>
                <h3 className="mt-3 text-base font-semibold text-primary-deep">
                  {t(`home.step${n}`)}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{t(`home.step${n}Desc`)}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm font-medium text-primary-deep">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
            {t("home.noDelivery")}
          </p>
        </div>
      </section>

      <section className="container-page py-14">
        <h2 className="text-2xl font-semibold text-primary-deep">{t("home.trustTitle")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map(({ icon: Icon, key }) => (
            <div key={key} className="surface-card p-5">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 text-base font-semibold text-primary-deep">
                {t(`home.trust${key}`)}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{t(`home.trust${key}Desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {products.length ? (
        <section className="container-page pb-14">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-primary-deep">{t("home.featured")}</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/products">{t("nav.products")}</Link>
            </Button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} onBook={setBooking} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="container-page pb-16">
        <div className="mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 fill-warning text-warning" />
          <h2 className="text-2xl font-semibold text-primary-deep">{t("review.title")}</h2>
        </div>
        <ReviewsSection />
      </section>

      <ContactSection />

      <BookingDialog product={booking} onOpenChange={(o) => !o && setBooking(null)} />
    </PageShell>
  );
}
