import { createFileRoute } from "@tanstack/react-router";

import { PageHeading, PageShell } from "@/components/PageShell";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Bharatsanagro" },
      {
        name: "description",
        content:
          "How Bharatsanagro collects, stores and protects farmer and Agro Store information used for bookings and store pickup.",
      },
      { property: "og:title", content: "Privacy Policy — Bharatsanagro" },
      {
        property: "og:description",
        content: "Data handling practices for farmers and Agro Stores on Bharatsanagro.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { t } = useI18n();
  return (
    <PageShell>
      <div className="container-page space-y-6 py-10">
        <PageHeading title={t("privacy.title")} />
        <div className="surface-card p-6">
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {t("privacy.body")}
          </p>
        </div>
      </div>
    </PageShell>
  );
}
