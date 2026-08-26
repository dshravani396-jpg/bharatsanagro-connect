import { CheckCircle2, Mail, Phone } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactSection() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !details.trim()) return;
    setSubmitted(true);
  }

  return (
    <section className="container-page pb-16" id="contact">
      <div className="mb-4 flex items-center gap-2">
        <Mail className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-semibold text-primary-deep">Contact Us</h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="surface-card p-6">
          <h3 className="text-base font-semibold text-primary-deep">Get in touch</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Share your details and our team will reach out to you.
          </p>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              <span className="text-primary-deep">98765 43210</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 shrink-0 text-primary" />
              <span className="text-primary-deep">contact@bharatsanagro.com</span>
            </div>
          </div>
        </div>

        <div className="surface-card p-6">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="mt-4 text-base font-medium text-primary-deep">
                Thank you! We received your details and will contact you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-1 block text-sm font-medium text-primary-deep"
                >
                  Name
                </label>
                <Input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="contact-mobile"
                  className="mb-1 block text-sm font-medium text-primary-deep"
                >
                  Mobile Number
                </label>
                <Input
                  id="contact-mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="contact-details"
                  className="mb-1 block text-sm font-medium text-primary-deep"
                >
                  Add Your Product Details
                </label>
                <Textarea
                  id="contact-details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Add Your Product Details..."
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
