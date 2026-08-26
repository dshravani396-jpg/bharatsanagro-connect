import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import authHero from "@/assets/auth-hero.jpg";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { isValidAadhaar, isValidMobile, useAuth } from "@/lib/auth";
import { generateOtp } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";

const OTP_LENGTH = 4;

export const Route = createFileRoute("/auth")({
  // `tab` is still accepted so any old bookmark keeps resolving, but
  // self-registration has been removed and the value is ignored.
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
        content: "Sign in to Bharatsanagro with your mobile number, Aadhaar number and OTP.",
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

  const [mobile, setMobile] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [otp, setOtp] = useState("");
  const [expectedOtp, setExpectedOtp] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function issueOtp() {
    // TODO: replace with a server-issued code. Supabase does this via
    // supabase.auth.signInWithOtp({ phone }), which needs an SMS provider
    // configured in the Supabase dashboard. Until then the code is generated
    // here and shown on screen so the screen can be exercised - which is why
    // completeSignIn() below deliberately refuses to sign anyone in.
    const code = generateOtp().slice(0, OTP_LENGTH);
    setExpectedOtp(code);
    setOtp("");
    toast.success(`${t("auth.otpSent")} · ${code}`);
  }

  function handleGenerateOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidMobile(mobile)) {
      toast.error(t("auth.invalidMobile"));
      return;
    }
    if (!isValidAadhaar(aadhaar)) {
      toast.error(t("auth.invalidAadhaar"));
      return;
    }
    issueOtp();
  }

  /**
   * The single place real authentication has to be wired in.
   *
   * The password field was removed, so there is no credential left for
   * supabase.auth.signInWithPassword(). Completing this needs either
   * Supabase phone OTP (signInWithOtp / verifyOtp with an SMS provider) or a
   * server endpoint that checks the code and issues a session.
   *
   * It refuses rather than guessing, because a code generated in the browser
   * proves nothing: accepting it would let anyone sign in as anyone.
   */
  async function completeSignIn() {
    setBusy(true);
    await Promise.resolve();
    setBusy(false);
    toast.error(t("auth.otpNotConfigured"));
    return false;
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== OTP_LENGTH || otp !== expectedOtp) {
      toast.error(t("auth.invalidOtp"));
      return;
    }
    const signedIn = await completeSignIn();
    if (!signedIn) return;
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

            <form onSubmit={handleGenerateOtp} className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-mobile">{t("common.mobile")}</Label>
                <Input
                  id="login-mobile"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  placeholder={t("auth.mobilePlaceholder")}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  disabled={Boolean(expectedOtp)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-aadhaar">{t("auth.aadhaar")}</Label>
                <Input
                  id="login-aadhaar"
                  inputMode="numeric"
                  maxLength={12}
                  placeholder={t("auth.aadhaarPlaceholder")}
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
                  disabled={Boolean(expectedOtp)}
                />
              </div>

              {expectedOtp ? null : (
                <Button type="submit" className="w-full">
                  {t("auth.generateOtp")}
                </Button>
              )}
            </form>

            {expectedOtp ? (
              <form onSubmit={handleVerify} className="mt-6 space-y-4 border-t pt-6">
                <div className="space-y-2">
                  <Label htmlFor="login-otp">{t("auth.otpTitle")}</Label>
                  <p className="text-sm text-muted-foreground">{t("auth.otpBlockDesc")}</p>
                  <InputOTP
                    id="login-otp"
                    maxLength={OTP_LENGTH}
                    value={otp}
                    onChange={setOtp}
                    containerClassName="justify-center pt-1"
                  >
                    <InputOTPGroup className="gap-2">
                      {Array.from({ length: OTP_LENGTH }, (_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="h-12 w-12 rounded-md border text-lg font-semibold"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button type="submit" className="w-full" disabled={busy || otp.length !== OTP_LENGTH}>
                  {busy ? t("common.saving") : t("auth.verify")}
                </Button>

                <div className="flex items-center justify-between gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={issueOtp}>
                    {t("auth.resend")}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setExpectedOtp(null);
                      setOtp("");
                    }}
                  >
                    {t("auth.changeDetails")}
                  </Button>
                </div>
              </form>
            ) : null}

            <p className="mt-4 text-xs text-muted-foreground">{t("auth.forgotHelp")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
