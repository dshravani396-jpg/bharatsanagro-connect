import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import authHero from "@/assets/auth-hero.jpg";
import { BrandLogo } from "@/components/BrandLogo";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { isValidMobile, mobileToEmail, useAuth } from "@/lib/auth";
import { STATES, generateOtp } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: search.tab === "register" ? ("register" as const) : ("login" as const),
  }),
  head: () => ({
    meta: [
      { title: "Login or Register — Bharatsanagro" },
      {
        name: "description",
        content:
          "Sign in with your mobile number or create a Farmer or Agro Store account on Bharatsanagro.",
      },
      { property: "og:title", content: "Login or Register — Bharatsanagro" },
      {
        property: "og:description",
        content: "Farmer and Agro Store accounts for booking agricultural products in India.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const { refresh } = useAuth();

  const [mode, setMode] = useState<"login" | "register">(tab);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  // login
  const [loginMobile, setLoginMobile] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // register
  const [regRole, setRegRole] = useState<"farmer" | "store">("farmer");
  const [fullName, setFullName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("Maharashtra");
  const [district, setDistrict] = useState("");
  const [village, setVillage] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [gst, setGst] = useState("");
  const [license, setLicense] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [expectedOtp, setExpectedOtp] = useState<string | null>(null);

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

  function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidMobile(mobile)) {
      toast.error(t("auth.invalidMobile"));
      return;
    }
    if (password.length < 6) {
      toast.error(t("auth.invalidPassword"));
      return;
    }
    if (password !== confirmPassword) {
      toast.error(t("auth.passwordMismatch"));
      return;
    }
    if (regRole === "farmer" ? !fullName.trim() : !storeName.trim()) {
      toast.error(t("common.required"));
      return;
    }
    const code = generateOtp();
    setExpectedOtp(code);
    toast.success(`${t("auth.otpSent")} · ${code}`);
  }

  async function verifyAndCreate(e: React.FormEvent) {
    e.preventDefault();
    if (otp !== expectedOtp) {
      toast.error(t("auth.invalidOtp"));
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: mobileToEmail(mobile),
      password,
      options: { data: { mobile, role: regRole } },
    });
    if (error || !data.user) {
      setBusy(false);
      toast.error(error?.message ?? t("auth.mobileExists"));
      return;
    }

    const userId = data.user.id;
    await supabase.from("user_roles").insert({ user_id: userId, role: regRole });

    if (regRole === "farmer") {
      await supabase.from("profiles").insert({
        id: userId,
        full_name: fullName.trim(),
        mobile,
        email: email.trim() || null,
        state,
        district: district.trim() || null,
        village: village.trim() || null,
      });
    } else {
      await supabase.from("profiles").insert({
        id: userId,
        full_name: fullName.trim() || storeName.trim(),
        mobile,
        email: email.trim() || null,
        state,
        district: district.trim() || null,
      });
      await supabase.from("stores").insert({
        owner_id: userId,
        store_name: storeName.trim(),
        owner_name: fullName.trim(),
        mobile,
        email: email.trim() || null,
        state,
        district: district.trim() || null,
        address: address.trim() || null,
        pincode: pincode.trim() || null,
        gst_number: gst.trim() || null,
        license_details: license.trim() || null,
      });
    }

    await refresh();
    setBusy(false);
    toast.success(t("auth.accountCreated"));
    void navigate({ to: regRole === "store" ? "/store/dashboard" : "/dashboard" });
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

          <Tabs
            value={mode}
            onValueChange={(v) => {
              setMode(v as "login" | "register");
              setExpectedOtp(null);
            }}
            className="mt-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t("auth.login")}</TabsTrigger>
              <TabsTrigger value="register">{t("auth.create")}</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
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
            </TabsContent>

            <TabsContent value="register" className="mt-6">
              <h1 className="text-xl font-semibold text-primary-deep">{t("auth.create")}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{t("auth.createSubtitle")}</p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {(["farmer", "store"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRegRole(r)}
                    className={`rounded-xl border p-3 text-left transition-colors ${
                      regRole === r
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <span className="block text-sm font-semibold text-primary-deep">
                      {t(`auth.${r}`)}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {t(`auth.${r}Desc`)}
                    </span>
                  </button>
                ))}
              </div>

              {expectedOtp ? (
                <form onSubmit={verifyAndCreate} className="mt-5 space-y-4">
                  <h2 className="text-base font-semibold text-primary-deep">
                    {t("auth.otpTitle")}
                  </h2>
                  <p className="text-sm text-muted-foreground">{t("auth.otpDesc")}</p>
                  <Input
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    aria-label={t("auth.otpTitle")}
                  />
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy ? t("common.saving") : t("auth.verify")}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      const code = generateOtp();
                      setExpectedOtp(code);
                      toast.success(`${t("auth.otpSent")} · ${code}`);
                    }}
                  >
                    {t("auth.resend")}
                  </Button>
                </form>
              ) : (
                <form onSubmit={sendOtp} className="mt-5 space-y-4">
                  {regRole === "store" ? (
                    <div className="space-y-2">
                      <Label htmlFor="store-name">{t("auth.storeName")}</Label>
                      <Input
                        id="store-name"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                      />
                    </div>
                  ) : null}
                  <div className="space-y-2">
                    <Label htmlFor="full-name">
                      {regRole === "store" ? t("auth.ownerName") : t("common.fullName")}
                    </Label>
                    <Input
                      id="full-name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-mobile">{t("common.mobile")}</Label>
                    <Input
                      id="reg-mobile"
                      inputMode="numeric"
                      placeholder={t("auth.mobilePlaceholder")}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">
                      {t("common.email")} ({t("common.optional")})
                    </Label>
                    <Input
                      id="reg-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
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
                      <Label htmlFor="reg-district">{t("common.district")}</Label>
                      <Input
                        id="reg-district"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                      />
                    </div>
                  </div>
                  {regRole === "farmer" ? (
                    <div className="space-y-2">
                      <Label htmlFor="reg-village">{t("common.village")}</Label>
                      <Input
                        id="reg-village"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="reg-address">{t("common.address")}</Label>
                        <Input
                          id="reg-address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="reg-pincode">{t("common.pincode")}</Label>
                          <Input
                            id="reg-pincode"
                            inputMode="numeric"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-gst">
                            {t("auth.gst")} ({t("common.optional")})
                          </Label>
                          <Input id="reg-gst" value={gst} onChange={(e) => setGst(e.target.value)} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-license">
                          {t("auth.license")} ({t("common.optional")})
                        </Label>
                        <Input
                          id="reg-license"
                          value={license}
                          onChange={(e) => setLicense(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">{t("common.password")}</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-confirm">{t("common.confirmPassword")}</Label>
                      <Input
                        id="reg-confirm"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    {t("auth.sendOtp")}
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-8 rounded-xl border border-primary/25 bg-primary/5 p-4">
            <h2 className="text-sm font-semibold text-primary-deep">{t("auth.guestTitle")}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{t("auth.guestDesc")}</p>
            <Button asChild variant="outline" size="sm" className="mt-3">
              <Link to="/products">{t("auth.guestCta")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
