import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatPrice, translatedContent } from "@/lib/catalog";
import type { ProductWithStore } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export function BookingDialog({
  product,
  onOpenChange,
}: {
  product: ProductWithStore | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useI18n();
  const { user, role, profile } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [qty, setQty] = useState(1);
  const [saving, setSaving] = useState(false);

  const open = Boolean(product);
  const canBook = Boolean(user) && role === "farmer";

  async function submit() {
    if (!product || !user) return;
    if (qty < 1 || qty > product.quantity) {
      toast.error(t("booking.quantityError"));
      return;
    }
    setSaving(true);
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        farmer_id: user.id,
        farmer_name: profile?.full_name ?? "",
        farmer_mobile: profile?.mobile ?? "",
        product_id: product.id,
        store_id: product.store_id,
        product_name: product.name,
        quantity: qty,
        total_price: Number(product.price) * qty,
      })
      .select("booking_code")
      .single();
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await queryClient.invalidateQueries();
    onOpenChange(false);
    setQty(1);
    toast.success(`${t("booking.success")} · ${t("booking.id")}: ${data.booking_code}`);
    void navigate({ to: "/bookings" });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {canBook ? (
          <>
            <DialogHeader>
              <DialogTitle>{t("booking.title")}</DialogTitle>
              <DialogDescription>{product?.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-xl bg-muted/60 p-3 text-sm">
                <p className="font-medium">{translatedContent(t, "storename", product?.stores?.store_name)}</p>
                <p className="text-muted-foreground">
                  {translatedContent(t, "address", product?.stores?.address)}, {translatedContent(t, "district", product?.stores?.district)}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-qty">{t("common.quantity")}</Label>
                <Input
                  id="booking-qty"
                  type="number"
                  min={1}
                  max={product?.quantity ?? 1}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                />
              </div>
              <p className="text-sm">
                {t("booking.total")}:{" "}
                <span className="font-semibold text-primary">
                  {formatPrice(Number(product?.price ?? 0) * qty)}
                </span>
              </p>
              <p className="rounded-xl border border-primary/25 bg-primary/5 p-3 text-xs text-primary-deep">
                {t("products.collectNote")}
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {t("common.cancel")}
              </Button>
              <Button onClick={submit} disabled={saving}>
                {saving ? t("common.saving") : t("products.bookProduct")}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t("guest.modalTitle")}</DialogTitle>
              <DialogDescription>{t("guest.modalBody")}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Button onClick={() => navigate({ to: "/auth" })}>{t("nav.login")}</Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/auth", search: { tab: "register" } })}
              >
                {t("auth.createFarmer")}
              </Button>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                {t("guest.continueBrowsing")}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
