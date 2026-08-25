import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import authHero from "@/assets/auth-hero.jpg";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { isValidMobile, mobileToEmail, useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  // `tab` is still accepted so any old bookmark or link keeps resolving,
  // but self-registration has been removed and the value is ignored.
  validateSearch: (search: Record<string, unknown>) => {
    const out: { tab?: "login" | "register" } = {};
    if (search["tab"] === "register") out.tab = "register";
    else if (search["tab"] === "login") out.tab = "login";
    return out;
  },

  head: () => ({
    meta: [
      { title: "Login — Bharatsanagro" },
      {
        name: "description",
        content: "Sign in to Bharatsanagro with your mobile number and password.",
      },
      { property: "og:title", content: "Login — Bharatsanagro" },
      {
        property: "og:description",
        content: "Farmer and Agro Store sign-in for booking agricultural products in India.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { refresh } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loginMobile, setLoginMobile] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidMobile(loginMobile)) {
      toast.error(t("auth.invalidMobile"));
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: mobileToEmail(loginMobile),
      password: loginPassword,
    });
    setBusy(false);
    if (error) {
      toast.error(t("auth.loginFailed"));
      return;
    }
    await refresh();
    toast.success(t("auth.welcomeBack"));
    void navigate({ to: "/" });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src={authHero}
          alt="Indian agricultural fields at golden hour"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-primary-deep/70" />
        <div className="relative flex h-full flex-col justify-end p-10">
          <h2 className="text-2xl font-semibold text-primary-foreground">{t("brand.tagline")}</h2>
          <p className="mt-2 max-w-sm text-sm text-primary-foreground/80">
            {t("home.heroSubtitle")}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <BrandLogo to="/" />

          <div className="mt-8">
            <h1 className="text-xl font-semibold text-primary-deep">{t("auth.login")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("auth.loginSubtitle")}</p>
            <form onSubmit={handleLogin} className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-mobile">{t("common.mobile")}</Label>
                <Input
                  id="login-mobile"
                  inputMode="numeric"
                  placeholder={t("auth.mobilePlaceholder")}
                  value={loginMobile}
                  onChange={(e) => setLoginMobile(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">{t("common.password")}</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.passwordPlaceholder")}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? t("common.loading") : t("auth.login")}
              </Button>
              <p className="text-xs text-muted-foreground">{t("auth.forgotHelp")}</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
