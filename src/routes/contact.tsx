import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeading, PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Bharatsanagro — Support for Farmers and Stores" },
      {
        name: "description",
        content:
          "Reach the Bharatsanagro team for help with bookings, store onboarding or product listings. Send us a message and we will respond soon.",
      },
      { property: "og:title", content: "Contact Bharatsanagro" },
      {
        property: "og:description",
        content: "Support for farmers and Agro Store owners using Bharatsanagro.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error(t("common.required"));
      return;
    }
    setName("");
    setMobile("");
    setMessage("");
    toast.success(t("contact.sent"));
  }

  return (
    <PageShell>
      <div className="container-page space-y-8 py-10">
        <PageHeading title={t("contact.title")} subtitle={t("contact.body")} />
        <div className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={submit} className="surface-card space-y-4 p-6">
            <div className="space-y-2">
              <Label htmlFor="contact-name">{t("contact.name")}</Label>
              <Input id="contact-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-mobile">{t("common.mobile")}</Label>
              <Input
                id="contact-mobile"
                inputMode="numeric"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message">{t("contact.message")}</Label>
              <Textarea
                id="contact-message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button type="submit">{t("contact.send")}</Button>
          </form>

          <div className="surface-card space-y-3 p-6 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              +91 98765 43210
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              support@bharatsanagro.in
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Pune, Maharashtra, India
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
