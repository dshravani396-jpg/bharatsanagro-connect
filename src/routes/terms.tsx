import { createFileRoute } from "@tanstack/react-router";

import { PageHeading, PageShell } from "@/components/PageShell";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — Bharatsanagro" },
      {
        name: "description",
        content:
          "Terms for using Bharatsanagro: bookings are reservations collected at the Agro Store, and no delivery service is provided.",
      },
      { property: "og:title", content: "Terms of Use — Bharatsanagro" },
      {
        property: "og:description",
        content: "Booking, pickup and account terms for farmers and Agro Stores.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const { t } = useI18n();
  return (
    <PageShell>
      <div className="container-page space-y-6 py-10">
        <PageHeading title={t("terms.title")} />
        <div className="surface-card p-6">
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {t("terms.body")}
          </p>
        </div>
      </div>
    </PageShell>
  );
}
