import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeading, PageShell } from "@/components/PageShell";
import { RequireRole } from "@/components/RequireRole";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { BOOKING_STATUSES, formatDate, formatPrice, translatedContent, type BookingStatus } from "@/lib/catalog";
import { useStoreBookings } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/store/bookings")({
  head: () => ({
    meta: [
      { title: "Farmer Bookings — Bharatsanagro Store" },
      {
        name: "description",
        content:
          "Review farmer bookings for your Agro Store and move each one from pending to confirmed, ready and collected.",
      },
      { property: "og:title", content: "Farmer Bookings — Bharatsanagro Store" },
      { property: "og:description", content: "Confirm, prepare and complete farmer pickups." },
    ],
  }),
  component: () => (
    <RequireRole role="store">
      <StoreBookings />
    </RequireRole>
  ),
});

function StoreBookings() {
  const { t } = useI18n();
  const { store } = useAuth();
  const { data: bookings = [], isLoading } = useStoreBookings(store?.id);
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");

  const list = useMemo(
    () => (filter === "all" ? bookings : bookings.filter((b) => b.status === filter)),
    [bookings, filter],
  );

  async function setStatus(id: string, status: BookingStatus) {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["store-bookings"] });
    toast.success(t("booking.updated"));
  }

  return (
    <PageShell>
      <div className="container-page space-y-6 py-10">
        <PageHeading
          title={t("store.farmerBookings")}
          subtitle={translatedContent(t, "storename", store?.store_name)}
          action={
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-44" aria-label={t("common.status")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                {BOOKING_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {t(`status.${s}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />

        {isLoading ? (
          <p className="py-10 text-center text-muted-foreground">{t("common.loading")}</p>
        ) : list.length ? (
          <ul className="grid gap-4">
            {list.map((b) => (
              <li key={b.id} className="surface-card space-y-3 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-primary-deep">
                      {b.product_name} × {b.quantity}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {t("booking.id")}: {b.booking_code} · {formatDate(b.created_at)}
                    </p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>

                <div className="rounded-xl bg-muted/60 p-3 text-sm">
                  <p className="font-medium">
                    {t("store.farmerName")}: {b.farmer_name || "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {b.farmer_mobile} · {t("booking.total")}: {formatPrice(b.total_price)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {b.status === "pending" ? (
                    <>
                      <Button size="sm" onClick={() => setStatus(b.id, "confirmed")}>
                        {t("store.markConfirmed")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setStatus(b.id, "cancelled")}
                      >
                        {t("store.reject")}
                      </Button>
                    </>
                  ) : null}
                  {b.status === "confirmed" ? (
                    <Button size="sm" onClick={() => setStatus(b.id, "ready")}>
                      {t("store.markReady")}
                    </Button>
                  ) : null}
                  {b.status === "ready" ? (
                    <Button size="sm" onClick={() => setStatus(b.id, "collected")}>
                      {t("store.markCollected")}
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-10 text-center text-muted-foreground">{t("store.noBookings")}</p>
        )}
      </div>
    </PageShell>
  );
}
