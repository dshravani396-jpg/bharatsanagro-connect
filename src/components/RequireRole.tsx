import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useAuth, type Role } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { t } = useI18n();
  const { loading, session, role: currentRole } = useAuth();

  if (loading) {
    return (
      <PageShell>
        <div className="container-page py-20 text-center text-muted-foreground">
          {t("common.loading")}
        </div>
      </PageShell>
    );
  }

  if (!session || currentRole !== role) {
    return (
      <PageShell>
        <div className="container-page py-20 text-center">
          <h1 className="text-2xl font-semibold text-primary-deep">{t("guest.modalTitle")}</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {t("guest.modalBody")}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/auth">{t("nav.login")}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/products">{t("guest.continueBrowsing")}</Link>
            </Button>
          </div>
        </div>
      </PageShell>
    );
  }

  return <>{children}</>;
}
