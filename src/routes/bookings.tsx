import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { PageHeading, PageShell } from "@/components/PageShell";
import { RequireRole } from "@/components/RequireRole";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/catalog";
import { useMyBookings } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/bookings")({
  head: () => ({
    meta: [
      { title: "My Bookings — Bharatsanagro" },
      {
        name: "description",
        content:
          "Track every product you booked, its status from pending to collected, and the Agro Store where you collect it.",
      },
      { property: "og:title", content: "My Bookings — Bharatsanagro" },
      { property: "og:description", content: "Booking codes, status and store pickup details." },
    ],
  }),
  component: () => (
    <RequireRole role="farmer">
      <MyBookings />
    </RequireRole>
  ),
});

function MyBookings() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { data: bookings = [], isLoading } = useMyBookings(user?.id);
  const queryClient = useQueryClient();

  async function cancel(id: string) {
    const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    toast.success(t("booking.cancelled"));
  }

  return (
    <PageShell>
      <div className="container-page space-y-6 py-10">
        <PageHeading title={t("booking.myTitle")} subtitle={t("booking.mySubtitle")} />

        {isLoading ? (
          <p className="py-10 text-center text-muted-foreground">{t("common.loading")}</p>
        ) : bookings.length ? (
          <ul className="grid gap-4">
            {bookings.map((b) => (
              <li key={b.id} className="surface-card space-y-3 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-primary-deep">
                      {b.product_name}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {t("booking.id")}: {b.booking_code}
                    </p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>

                <dl className="grid gap-2 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-xs text-muted-foreground">{t("common.quantity")}</dt>
                    <dd className="font-medium">{b.quantity}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">{t("booking.total")}</dt>
                    <dd className="font-medium text-primary">{formatPrice(b.total_price)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">{t("booking.date")}</dt>
                    <dd className="font-medium">{formatDate(b.created_at)}</dd>
                  </div>
                </dl>

                {b.stores ? (
                  <div className="rounded-xl bg-muted/60 p-3 text-sm">
                    <p className="font-medium">{b.stores.store_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {b.stores.address}, {b.stores.district}, {b.stores.state} ·{" "}
                      {b.stores.mobile}
                    </p>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  {b.stores ? (
                    <Button asChild variant="outline" size="sm">
                      <Link to="/stores/$storeId" params={{ storeId: b.store_id }}>
                        {t("common.viewStore")}
                      </Link>
                    </Button>
                  ) : null}
                  {b.status === "pending" || b.status === "confirmed" ? (
                    <Button variant="ghost" size="sm" onClick={() => cancel(b.id)}>
                      {t("booking.cancel")}
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-10 text-center">
            <p className="text-muted-foreground">{t("booking.empty")}</p>
            <Button asChild className="mt-5">
              <Link to="/products">{t("home.exploreProducts")}</Link>
            </Button>
          </div>
        )}
      </div>
    </PageShell>
  );
}
