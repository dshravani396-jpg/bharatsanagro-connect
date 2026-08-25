import { useEffect, useState } from "react";

import logo from "@/assets/brand-logo.jpg";
import heroField from "@/assets/auth-hero.jpg";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const SPLASH_MS = 5000;
const FADE_MS = 600;

export function SplashScreen() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setFading(true), SPLASH_MS - FADE_MS);
    const hideTimer = window.setTimeout(() => setVisible(false), SPLASH_MS);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-600",
        fading ? "opacity-0" : "opacity-100",
      )}
    >
      <img
        src={heroField}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        width={1600}
        height={1104}
      />
      <div className="absolute inset-0 bg-primary-deep/85" />
      <div className="relative flex animate-in flex-col items-center gap-6 px-6 text-center fade-in duration-1000">
        <img
          src={logo}
          alt="Bharatsanagro"
          width={635}
          height={491}
          className="h-40 w-40 rounded-3xl bg-card object-contain p-2 shadow-lift sm:h-52 sm:w-52"
        />
        <p
          className="max-w-md text-lg font-medium text-primary-foreground sm:text-2xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t("brand.tagline")}
        </p>
        <div className="mt-2 h-1 w-32 overflow-hidden rounded-full bg-primary-foreground/25">
          <div className="h-full w-full origin-left animate-[splash-bar_5s_linear_forwards] bg-primary-foreground/80" />
        </div>
      </div>
      <style>{`@keyframes splash-bar { from { transform: scaleX(0) } to { transform: scaleX(1) } }`}</style>
    </div>
  );
}
