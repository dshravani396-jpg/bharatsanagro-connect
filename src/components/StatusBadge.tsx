import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const TONE: Record<BookingStatus, string> = {
  pending: "bg-warning/15 text-warning-foreground border-warning/40",
  confirmed: "bg-info/15 text-info border-info/40",
  ready: "bg-primary/15 text-primary border-primary/40",
  collected: "bg-success/15 text-success border-success/40",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  const { t } = useI18n();
  return (
    <Badge variant="outline" className={cn("rounded-full font-medium", TONE[status])}>
      {t(`status.${status}`)}
    </Badge>
  );
}
