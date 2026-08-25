import { createFileRoute } from "@tanstack/react-router";

import { PageHeading, PageShell } from "@/components/PageShell";
import { ReviewsSection } from "@/components/ReviewsSection";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Bharatsanagro — Farmer First Agro Marketplace" },
      {
        name: "description",
        content:
          "Bharatsanagro connects Indian farmers with trusted local Agro Stores so quality inputs are always within reach. शेतकऱ्याची प्रगती, देशाची समृद्धी.",
      },
      { property: "og:title", content: "About Bharatsanagro" },
      {
        property: "og:description",
        content: "Our mission to strengthen farmers and local Agro Stores across India.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useI18n();

  return (
    <PageShell>
      <div className="container-page space-y-8 py-10">
        <PageHeading title={t("about.title")} subtitle={t("brand.tagline")} />
        <div className="surface-card space-y-4 p-6">
          <p className="text-sm leading-relaxed text-muted-foreground">{t("about.body")}</p>
          <h2 className="text-lg font-semibold text-primary-deep">{t("about.mission")}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{t("about.missionBody")}</p>
        </div>
        <section>
          <h2 className="mb-5 text-xl font-semibold text-primary-deep">{t("review.title")}</h2>
          <ReviewsSection />
        </section>
      </div>
    </PageShell>
  );
}
