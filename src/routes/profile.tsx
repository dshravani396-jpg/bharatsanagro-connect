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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { STATES } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Bharatsanagro" },
      {
        name: "description",
        content:
          "Update your farmer profile details, location, preferred language and account password on Bharatsanagro.",
      },
      { property: "og:title", content: "My Profile — Bharatsanagro" },
      { property: "og:description", content: "Manage your farmer account details and password." },
    ],
  }),
  component: () => (
    <RequireRole role="farmer">
      <FarmerProfile />
    </RequireRole>
  ),
});

function FarmerProfile() {
  const { t, lang, setLang } = useI18n();
  const { user, profile, refresh } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("Maharashtra");
  const [district, setDistrict] = useState("");
  const [village, setVillage] = useState("");
  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name ?? "");
    setEmail(profile.email ?? "");
    setState(profile.state ?? "Maharashtra");
    setDistrict(profile.district ?? "");
    setVillage(profile.village ?? "");
  }, [profile]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        email: email.trim() || null,
        state,
        district: district.trim() || null,
        village: village.trim() || null,
        language: lang,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await refresh();
    toast.success(t("farmer.profileUpdated"));
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error(t("auth.invalidPassword"));
      return;
    }
    if (password !== confirm) {
      toast.error(t("auth.passwordMismatch"));
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error(error.message);
      return;
    }
    setPassword("");
    setConfirm("");
    toast.success(t("farmer.passwordUpdated"));
  }

  return (
    <PageShell>
      <div className="container-page space-y-6 py-10">
        <PageHeading title={t("farmer.profileTitle")} subtitle={profile?.mobile} />

        <form onSubmit={saveProfile} className="surface-card grid gap-4 p-6 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="p-name">{t("common.fullName")}</Label>
            <Input id="p-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-mobile">{t("common.mobile")}</Label>
            <Input id="p-mobile" value={profile?.mobile ?? ""} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-email">{t("common.email")}</Label>
            <Input id="p-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t("common.state")}</Label>
            <Select value={state} onValueChange={setState}>
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
            <Label htmlFor="p-district">{t("common.district")}</Label>
            <Input id="p-district" value={district} onChange={(e) => setDistrict(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-village">{t("common.village")}</Label>
            <Input id="p-village" value={village} onChange={(e) => setVillage(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t("farmer.languagePref")}</Label>
            <Select value={lang} onValueChange={(v) => setLang(v as typeof lang)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="mr">मराठी</SelectItem>
                <SelectItem value="hi">हिन्दी</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={saving}>
              {saving ? t("common.saving") : t("common.save")}
            </Button>
          </div>
        </form>

        <form onSubmit={changePassword} className="surface-card grid gap-4 p-6 sm:grid-cols-2">
          <h2 className="text-base font-semibold text-primary-deep sm:col-span-2">
            {t("farmer.changePassword")}
          </h2>
          <div className="space-y-2">
            <Label htmlFor="p-pass">{t("auth.newPassword")}</Label>
            <Input
              id="p-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-confirm">{t("common.confirmPassword")}</Label>
            <Input
              id="p-confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" variant="outline">
              {t("common.submit")}
            </Button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
