import { useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { REVIEW_CATEGORIES, formatDate } from "@/lib/catalog";
import { useReviews } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function ReviewsSection() {
  const { t } = useI18n();
  const { user, profile, store, role } = useAuth();
  const { data: reviews = [] } = useReviews();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState<string>("website_usability");
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!user) {
      toast.error(t("review.loginRequired"));
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      author_name: (role === "store" ? store?.store_name : profile?.full_name) ?? "",
      rating,
      category,
      comment: comment.trim() || null,
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setComment("");
    await queryClient.invalidateQueries({ queryKey: ["reviews"] });
    toast.success(t("review.thanks"));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="surface-card p-6">
        <h3 className="text-base font-semibold text-primary-deep">{t("review.question")}</h3>
        <div className="mt-4 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n}`}
              onClick={() => setRating(n)}
              className="p-1"
            >
              <Star
                className={cn(
                  "h-7 w-7",
                  n <= rating ? "fill-warning text-warning" : "text-muted-foreground/40",
                )}
              />
            </button>
          ))}
        </div>
        <div className="mt-4 space-y-3">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder={t("review.category")} />
            </SelectTrigger>
            <SelectContent>
              {REVIEW_CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {t(c.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            placeholder={t("review.comment")}
          />
          <Button onClick={submit} disabled={saving} className="w-full">
            {saving ? t("common.saving") : t("review.submit")}
          </Button>
          {!user ? (
            <p className="text-xs text-muted-foreground">{t("review.loginRequired")}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("review.empty")}</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="surface-card p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-primary-deep">
                  {r.author_name || "Bharatsanagro user"}
                </p>
                <span className="flex shrink-0 items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  {r.rating}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {t(`review.cat.${r.category === "product_availability" ? "availability" : r.category === "store_experience" ? "store" : r.category === "booking_experience" ? "booking" : "website"}`)}{" "}
                · {formatDate(r.created_at)}
              </p>
              {r.comment ? <p className="mt-2 text-sm">{r.comment}</p> : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
