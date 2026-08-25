import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeading, PageShell } from "@/components/PageShell";
import { RequireRole } from "@/components/RequireRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { STATES } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/store/profile")({
  head: () => ({
    meta: [
      { title: "Store Profile — Bharatsanagro" },
      {
        name: "description",
        content:
          "Update your Agro Store details: name, owner, address, opening hours, licence information and open/closed status.",
      },
      { property: "og:title", content: "Store Profile — Bharatsanagro" },
      { property: "og:description", content: "Keep your store information accurate for farmers." },
    ],
  }),
  component: () => (
    <RequireRole role="store">
      <StoreProfile />
    </RequireRole>
  ),
});

function StoreProfile() {
  const { t } = useI18n();
  const { store, refresh } = useAuth();
  const [form, setForm] = useState({
    store_name: "",
    owner_name: "",
    email: "",
    state: "Maharashtra",
    district: "",
    address: "",
    pincode: "",
    gst_number: "",
    license_details: "",
    opening_hours: "",
    image_url: "",
    description: "",
    is_open: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!store) return;
    setForm({
      store_name: store.store_name ?? "",
      owner_name: store.owner_name ?? "",
      email: store.email ?? "",
      state: store.state ?? "Maharashtra",
      district: store.district ?? "",
      address: store.address ?? "",
      pincode: store.pincode ?? "",
      gst_number: store.gst_number ?? "",
      license_details: store.license_details ?? "",
      opening_hours: store.opening_hours ?? "",
      image_url: store.image_url ?? "",
      description: store.description ?? "",
      is_open: store.is_open,
    });
  }, [store]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!store) return;
    setSaving(true);
    const { error } = await supabase
      .from("stores")
      .update({
        store_name: form.store_name.trim(),
        owner_name: form.owner_name.trim(),
        email: form.email.trim() || null,
        state: form.state,
        district: form.district.trim() || null,
        address: form.address.trim() || null,
        pincode: form.pincode.trim() || null,
        gst_number: form.gst_number.trim() || null,
        license_details: form.license_details.trim() || null,
        opening_hours: form.opening_hours.trim() || null,
        image_url: form.image_url.trim() || null,
        description: form.description.trim() || null,
        is_open: form.is_open,
      })
      .eq("id", store.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await refresh();
    toast.success(t("store.profileUpdated"));
  }

  return (
    <PageShell>
      <div className="container-page space-y-6 py-10">
        <PageHeading title={t("store.profileTitle")} subtitle={store?.mobile} />

        <form onSubmit={save} className="surface-card grid gap-4 p-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="s-name">{t("auth.storeName")}</Label>
            <Input
              id="s-name"
              value={form.store_name}
              onChange={(e) => setForm({ ...form, store_name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-owner">{t("auth.ownerName")}</Label>
            <Input
              id="s-owner"
              value={form.owner_name}
              onChange={(e) => setForm({ ...form, owner_name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-email">{t("common.email")}</Label>
            <Input
              id="s-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-hours">{t("store.openingHours")}</Label>
            <Input
              id="s-hours"
              value={form.opening_hours}
              onChange={(e) => setForm({ ...form, opening_hours: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("common.state")}</Label>
            <Select value={form.state} onValueChange={(v) => setForm({ ...form, state: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-district">{t("common.district")}</Label>
            <Input
              id="s-district"
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="s-address">{t("common.address")}</Label>
            <Input
              id="s-address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-pincode">{t("common.pincode")}</Label>
            <Input
              id="s-pincode"
              inputMode="numeric"
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-gst">{t("auth.gst")}</Label>
            <Input
              id="s-gst"
              value={form.gst_number}
              onChange={(e) => setForm({ ...form, gst_number: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="s-license">{t("auth.license")}</Label>
            <Input
              id="s-license"
              value={form.license_details}
              onChange={(e) => setForm({ ...form, license_details: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="s-image">{t("store.storeImage")}</Label>
            <Input
              id="s-image"
              placeholder="https://"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="s-desc">{t("store.description")}</Label>
            <Textarea
              id="s-desc"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-3 sm:col-span-2">
            <Switch
              id="s-open"
              checked={form.is_open}
              onCheckedChange={(v) => setForm({ ...form, is_open: v })}
            />
            <Label htmlFor="s-open">{form.is_open ? t("common.open") : t("common.closed")}</Label>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={saving}>
              {saving ? t("common.saving") : t("common.save")}
            </Button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
