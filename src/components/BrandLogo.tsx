import { Link } from "@tanstack/react-router";

import logo from "@/assets/logo.jpg.asset.json";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={logo.url}
      alt="Bharatsanagro"
      className={cn("h-11 w-11 rounded-full object-cover", className)}
    />
  );
}

export function BrandLogo({
  to = "/",
  size = "md",
  tone = "dark",
  showTagline = true,
}: {
  to?: string;
  size?: "sm" | "md" | "lg";
  tone?: "dark" | "light";
  showTagline?: boolean;
}) {
  const { t } = useI18n();
  const mark = size === "lg" ? "h-14 w-14" : size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const name =
    size === "lg" ? "text-2xl sm:text-3xl" : size === "sm" ? "text-base" : "text-lg sm:text-xl";

  const content = (
    <span className="flex min-w-0 items-center gap-2 sm:gap-3">
      <LogoMark className={cn(mark, "shrink-0 ring-1 ring-border")} />
      <span className="flex min-w-0 flex-col leading-tight">
        <span
          className={cn(
            "truncate font-semibold tracking-tight",
            name,
            tone === "light" ? "text-primary-foreground" : "text-primary-deep",
          )}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t("brand.name")}
        </span>
        {showTagline ? (
          <span
            className={cn(
              "truncate text-[11px] sm:text-xs",
              tone === "light" ? "text-primary-foreground/80" : "text-muted-foreground",
            )}
          >
            {t("brand.tagline")}
          </span>
        ) : null}
      </span>
    </span>
  );

  return (
    <Link to={to} className="flex min-w-0 items-center">
      {content}
    </Link>
  );
}
