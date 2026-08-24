import { Link } from "@tanstack/react-router";

import { LanguageSelector } from "@/components/LanguageSelector";
import { LogoMark } from "@/components/BrandLogo";
import { useI18n } from "@/lib/i18n";

const LINKS = [
  { to: "/", labelKey: "nav.home" },
  { to: "/products", labelKey: "nav.products" },
  { to: "/stores", labelKey: "nav.stores" },
  { to: "/how-it-works", labelKey: "nav.howItWorks" },
  { to: "/about", labelKey: "nav.about" },
  { to: "/contact", labelKey: "nav.contact" },
  { to: "/privacy", labelKey: "privacy.title" },
  { to: "/terms", labelKey: "terms.title" },
];

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="mt-16 bg-primary-deep text-primary-foreground">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_auto]">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <LogoMark className="h-12 w-12 bg-card" />
            <div className="min-w-0">
              <p className="truncate text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                {t("brand.name")}
              </p>
              <p className="truncate text-sm text-primary-foreground/80">{t("brand.tagline")}</p>
            </div>
          </div>
          <p className="max-w-sm text-sm text-primary-foreground/70">{t("footer.tagline")}</p>
        </div>

        <nav className="grid grid-cols-2 gap-2 text-sm">
          {LINKS.map((link) => (
            <Link
              key={link.to + link.labelKey}
              to={link.to}
              className="text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="flex items-start">
          <LanguageSelector tone="light" />
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 py-5 text-center text-xs text-primary-foreground/70">
        {t("footer.rights")}
      </div>
    </footer>
  );
}
