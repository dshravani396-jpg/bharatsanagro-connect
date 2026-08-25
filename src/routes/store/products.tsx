import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeading, PageShell } from "@/components/PageShell";
import { RequireRole } from "@/components/RequireRole";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { CATEGORIES, formatPrice, unitLabel } from "@/lib/catalog";
import { useStoreProducts, type Product } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/store/products")({
  head: () => ({
    meta: [
      { title: "Manage Products — Bharatsanagro Store" },
      {
        name: "description",
        content:
          "Add, edit and remove your Agro Store product listings, update stock, pricing and availability for farmers.",
      },
      { property: "og:title", content: "Manage Products — Bharatsanagro Store" },
      { property: "og:description", content: "Full control over your store's product catalogue." },
    ],
  }),
  component: () => (
    <RequireRole role="store">
      <StoreProducts />
    </RequireRole>
  ),
});

type Draft = {
  id?: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  quantity: string;
  unit: string;
  mfg_date: string;
  expiry_date: string;
  description: string;
  image_url: string;
  is_available: boolean;
};

const EMPTY: Draft = {
  name: "",
  brand: "",
  category: "seeds",
  price: "",
  quantity: "",
  unit: "unit",
  mfg_date: "",
  expiry_date: "",
  description: "",
  image_url: "",
  is_available: true,
};

function StoreProducts() {
  const { t } = useI18n();
  const { store } = useAuth();
  const { data: products = [], isLoading } = useStoreProducts(store?.id);
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  function edit(p: Product) {
    setDraft({
      id: p.id,
      name: p.name,
      brand: p.brand ?? "",
      category: p.category,
      price: String(p.price),
      quantity: String(p.quantity),
      unit: p.unit ?? "unit",
      mfg_date: p.mfg_date ?? "",
      expiry_date: p.expiry_date ?? "",
      description: p.description ?? "",
      image_url: p.image_url ?? "",
      is_available: p.is_available,
    });
  }

  async function save() {
    if (!draft || !store) return;
    if (!draft.name.trim()) {
      toast.error(t("common.required"));
      return;
    }
    setSaving(true);
    const payload = {
      store_id: store.id,
      name: draft.name.trim(),
      brand: draft.brand.trim() || null,
      category: draft.category,
      price: Number(draft.price || 0),
      quantity: Number(draft.quantity || 0),
      unit: draft.unit.trim() || "unit",
      mfg_date: draft.mfg_date || null,
      expiry_date: draft.expiry_date || null,
      description: draft.description.trim() || null,
      image_url: draft.image_url.trim() || null,
      is_available: draft.is_available,
    };
    const { error } = draft.id
      ? await supabase.from("products").update(payload).eq("id", draft.id)
      : await supabase.from("products").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await queryClient.invalidateQueries();
    setDraft(null);
    toast.success(t("store.productSaved"));
  }

  async function remove(id: string) {
    if (!window.confirm(t("store.deleteConfirm"))) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    await queryClient.invalidateQueries();
    toast.success(t("store.productDeleted"));
  }

  async function toggle(p: Product) {
    const { error } = await supabase
      .from("products")
      .update({ is_available: !p.is_available })
      .eq("id", p.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    await queryClient.invalidateQueries();
  }

  return (
    <PageShell>
      <div className="container-page space-y-6 py-10">
        <PageHeading
          title={t("store.myProducts")}
          subtitle={store?.store_name ?? ""}
          action={
            <Button onClick={() => setDraft({ ...EMPTY })}>
              <Plus className="mr-2 h-4 w-4" />
              {t("store.addProduct")}
            </Button>
          }
        />

        {isLoading ? (
          <p className="py-10 text-center text-muted-foreground">{t("common.loading")}</p>
        ) : products.length ? (
          <ul className="grid gap-3">
            {products.map((p) => (
              <li key={p.id} className="surface-card flex flex-wrap items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-primary-deep">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t(`cat.${p.category}`)} · {formatPrice(p.price)} · {p.quantity} {unitLabel(t, p.unit)}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    p.is_available
                      ? "rounded-full border-success/40 bg-success/10 text-success"
                      : "rounded-full border-muted-foreground/30 bg-muted text-muted-foreground"
                  }
                >
                  {p.is_available ? t("common.available") : t("common.unavailable")}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => toggle(p)}>
                    {p.is_available ? t("store.markUnavailable") : t("store.markAvailable")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t("common.edit")}
                    onClick={() => edit(p)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t("common.delete")}
                    onClick={() => remove(p.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-10 text-center text-muted-foreground">{t("store.noProducts")}</p>
        )}
      </div>

      <Dialog open={Boolean(draft)} onOpenChange={(o) => !o && setDraft(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{draft?.id ? t("store.editProduct") : t("store.addProduct")}</DialogTitle>
          </DialogHeader>
          {draft ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="sp-name">{t("store.productName")}</Label>
                <Input
                  id="sp-name"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sp-brand">{t("common.brand")}</Label>
                <Input
                  id="sp-brand"
                  value={draft.brand}
                  onChange={(e) => setDraft({ ...draft, brand: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("common.category")}</Label>
                <Select
                  value={draft.category}
                  onValueChange={(v) => setDraft({ ...draft, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.emoji} {t(`cat.${c.value}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sp-price">{t("common.price")}</Label>
                <Input
                  id="sp-price"
                  type="number"
                  min={0}
                  value={draft.price}
                  onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sp-qty">{t("common.quantity")}</Label>
                <Input
                  id="sp-qty"
                  type="number"
                  min={0}
                  value={draft.quantity}
                  onChange={(e) => setDraft({ ...draft, quantity: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sp-unit">{t("common.unit")} ({t("common.optional")})</Label>
                <Input
                  id="sp-unit"
                  value={draft.unit}
                  onChange={(e) => setDraft({ ...draft, unit: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sp-mfg">{t("products.mfgDate")}</Label>
                <Input
                  id="sp-mfg"
                  type="date"
                  value={draft.mfg_date}
                  onChange={(e) => setDraft({ ...draft, mfg_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sp-exp">{t("products.expiryDate")}</Label>
                <Input
                  id="sp-exp"
                  type="date"
                  value={draft.expiry_date}
                  onChange={(e) => setDraft({ ...draft, expiry_date: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="sp-image">{t("store.productImage")}</Label>
                <Input
                  id="sp-image"
                  placeholder="https://"
                  value={draft.image_url}
                  onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="sp-desc">{t("products.description")}</Label>
                <Textarea
                  id="sp-desc"
                  rows={3}
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3 sm:col-span-2">
                <Switch
                  id="sp-available"
                  checked={draft.is_available}
                  onCheckedChange={(v) => setDraft({ ...draft, is_available: v })}
                />
                <Label htmlFor="sp-available">{t("store.availabilityStatus")}</Label>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDraft(null)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? t("common.saving") : t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
