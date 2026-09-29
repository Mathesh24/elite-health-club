"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Clock3, Loader2, Lock, X, XCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  formatRupees,
  MEMBERSHIP_PLANS,
  type MembershipPlanId,
} from "@/lib/membership-plans";

// Membership checkout: collects contact details, asks our Netlify function for
// a Zoho payment session, opens Zoho's checkout widget, then has the server
// confirm the payment with Zoho before showing success.
// Widget docs: https://www.zoho.com/in/payments/developerdocs/web-integration/integrate-widget/

const WIDGET_SRC = "https://static.zohocdn.com/zpay/zpay-js/v1/zpayments.js";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type ZPaymentsInstance = {
  requestPaymentMethod: (options: Record<string, unknown>) => Promise<{
    payment_id?: string | number;
  }>;
  close: () => Promise<void>;
};

declare global {
  interface Window {
    ZPayments?: new (config: {
      account_id: string;
      domain: "IN";
      otherOptions: { api_key: string; is_test_mode?: boolean };
    }) => ZPaymentsInstance;
  }
}

let widgetScript: Promise<void> | null = null;

function loadWidgetScript() {
  if (window.ZPayments) return Promise.resolve();
  widgetScript ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = WIDGET_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      widgetScript = null;
      script.remove();
      reject(new Error("Could not load the payment widget"));
    };
    document.head.appendChild(script);
  });
  return widgetScript;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${BASE_PATH}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as T & {
    error?: string;
  };
  if (!response.ok) {
    throw new Error(data.error ?? "Something went wrong. Please try again.");
  }
  return data;
}

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name"),
  email: z.email("Please enter a valid email"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9][0-9\s-]{6,18}$/, "Please enter a valid phone number"),
  acceptedTerms: z.literal(true, {
    error: "Please accept the terms to continue",
  }),
  website: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type CreateResponse = {
  sessionId: string;
  reference: string;
  amount: number;
  description: string;
  widget: { accountId: string; apiKey: string; testMode: boolean };
};

type VerifyResponse = {
  status: "paid" | "pending" | "failed";
  reference?: string;
  paymentId: string;
};

type Stage =
  | { kind: "form" }
  | { kind: "processing"; message: string }
  | { kind: "paid"; reference: string; paymentId: string }
  | { kind: "pending"; reference: string; paymentId: string }
  | { kind: "failed"; message: string };

export default function MembershipCheckout({
  planId,
  label,
  variant = "primary",
  className,
}: {
  planId: MembershipPlanId;
  label: string;
  variant?: "primary" | "outline";
  className?: string;
}) {
  const plan = MEMBERSHIP_PLANS[planId];
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>({ kind: "form" });
  const [formError, setFormError] = useState<string | null>(null);
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const busy = stage.kind === "processing";

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, busy]);

  const openDialog = () => {
    setStage({ kind: "form" });
    setFormError(null);
    setOpen(true);
  };

  const onSubmit = async (values: FormValues) => {
    if (values.website) return;
    setFormError(null);
    setStage({ kind: "processing", message: "Preparing secure checkout…" });

    let session: CreateResponse;
    try {
      [session] = await Promise.all([
        postJson<CreateResponse>("/api/payments/create", {
          planId,
          name: values.name,
          email: values.email,
          phone: values.phone,
          acceptedTerms: values.acceptedTerms,
        }),
        loadWidgetScript(),
      ]);
    } catch (error) {
      setFormError((error as Error).message);
      setStage({ kind: "form" });
      return;
    }

    if (!window.ZPayments) {
      setFormError("The payment widget didn't load. Please try again.");
      setStage({ kind: "form" });
      return;
    }

    const instance = new window.ZPayments({
      account_id: session.widget.accountId,
      domain: "IN",
      otherOptions: {
        api_key: session.widget.apiKey,
        is_test_mode: session.widget.testMode,
      },
    });

    let paymentId: string;
    try {
      setStage({ kind: "processing", message: "Complete your payment in the secure window…" });
      const result = await instance.requestPaymentMethod({
        amount: String(session.amount),
        currency_code: "INR",
        currency_symbol: "₹",
        payments_session_id: session.sessionId,
        business: "Elite Health Club",
        description: session.description,
        reference_number: session.reference,
        address: {
          name: values.name,
          email: values.email,
          phone: values.phone.replace(/[\s-]/g, ""),
        },
      });
      if (!result.payment_id) throw new Error("No payment id returned");
      paymentId = String(result.payment_id);
    } catch (error) {
      const code = (error as { code?: string }).code;
      setFormError(
        code === "widget_closed"
          ? "Payment was cancelled. You can try again whenever you're ready."
          : "The payment didn't go through. If any amount was debited, it will be refunded automatically. Please try again."
      );
      setStage({ kind: "form" });
      return;
    } finally {
      await instance.close().catch(() => undefined);
    }

    setStage({ kind: "processing", message: "Confirming your payment…" });
    try {
      const verification = await postJson<VerifyResponse>(
        "/api/payments/verify",
        { paymentId, sessionId: session.sessionId }
      );
      if (verification.status === "paid") {
        setStage({ kind: "paid", reference: session.reference, paymentId });
      } else if (verification.status === "pending") {
        setStage({ kind: "pending", reference: session.reference, paymentId });
      } else {
        setStage({
          kind: "failed",
          message: `We couldn't confirm this payment. If money was debited, it will be refunded automatically, or contact us quoting payment ID ${paymentId}.`,
        });
      }
    } catch {
      setStage({ kind: "pending", reference: session.reference, paymentId });
    }
  };

  const inputClass =
    "w-full rounded-lg border border-neutral-dark/15 bg-white px-4 py-3 text-sm text-neutral-dark placeholder:text-neutral-dark/30 transition-colors focus:border-brand focus:outline-none";

  return (
    <>
      <Button
        type="button"
        variant={variant}
        className={className}
        onClick={openDialog}
      >
        {label}
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-neutral-dark/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={(event) => {
            if (event.target === event.currentTarget && !busy) setOpen(false);
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 text-neutral-dark shadow-2xl outline-none sm:rounded-3xl sm:p-8"
          >
            {!busy && (
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 rounded-full p-2 text-neutral-dark/50 transition-colors hover:bg-neutral-dark/5 hover:text-neutral-dark"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            )}

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand">
              Membership checkout
            </p>
            <h3 id={titleId} className="pr-8 font-display text-2xl font-bold">
              {plan.name}
            </h3>
            <div className="mt-4 flex items-baseline justify-between rounded-2xl bg-light px-5 py-4">
              <span className="text-sm text-neutral-dark/60">
                {plan.termYears} years · incl. 18% GST
              </span>
              <span className="font-display text-2xl font-bold text-brand">
                {formatRupees(plan.totalAmountRupees)}
              </span>
            </div>

            {stage.kind === "paid" && (
              <Outcome
                icon={<CheckCircle size={40} className="text-brand" />}
                title="Welcome to Elite Health Club!"
                body={`Your payment is confirmed. A confirmation email is on its way, and our team will contact you shortly to complete onboarding.`}
                reference={stage.reference}
                paymentId={stage.paymentId}
                onClose={() => setOpen(false)}
              />
            )}

            {stage.kind === "pending" && (
              <Outcome
                icon={<Clock3 size={40} className="text-accent" />}
                title="Payment received — confirming"
                body="We're waiting for final confirmation from the payment provider. You'll get an email once it's confirmed; there's no need to pay again."
                reference={stage.reference}
                paymentId={stage.paymentId}
                onClose={() => setOpen(false)}
              />
            )}

            {stage.kind === "failed" && (
              <Outcome
                icon={<XCircle size={40} className="text-red-500" />}
                title="Payment not confirmed"
                body={stage.message}
                onClose={() => setOpen(false)}
              />
            )}

            {(stage.kind === "form" || stage.kind === "processing") && (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 space-y-4"
                noValidate
              >
                <fieldset disabled={busy} className="space-y-4">
                  <Field label="Full name" error={errors.name?.message}>
                    <input
                      {...register("name")}
                      autoComplete="name"
                      className={cn(inputClass, errors.name && "border-red-400")}
                    />
                  </Field>
                  <Field label="Email" error={errors.email?.message}>
                    <input
                      {...register("email")}
                      type="email"
                      autoComplete="email"
                      className={cn(inputClass, errors.email && "border-red-400")}
                    />
                  </Field>
                  <Field label="Phone" error={errors.phone?.message}>
                    <input
                      {...register("phone")}
                      type="tel"
                      autoComplete="tel"
                      placeholder="+91"
                      className={cn(inputClass, errors.phone && "border-red-400")}
                    />
                  </Field>

                  <input
                    {...register("website")}
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  <label className="flex items-start gap-3 text-sm leading-relaxed text-neutral-dark/70">
                    <input
                      {...register("acceptedTerms")}
                      type="checkbox"
                      className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-brand)]"
                    />
                    <span>
                      I agree to the{" "}
                      <a href={`${BASE_PATH}/terms/`} target="_blank" className="text-brand underline">
                        Terms
                      </a>
                      ,{" "}
                      <a href={`${BASE_PATH}/refund-policy/`} target="_blank" className="text-brand underline">
                        Refund Policy
                      </a>{" "}
                      and{" "}
                      <a href={`${BASE_PATH}/privacy-policy/`} target="_blank" className="text-brand underline">
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                  {errors.acceptedTerms && (
                    <p className="text-xs text-red-500">
                      {errors.acceptedTerms.message}
                    </p>
                  )}
                </fieldset>

                {formError && (
                  <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    {formError}
                  </p>
                )}

                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      {stage.kind === "processing" ? stage.message : ""}
                    </span>
                  ) : (
                    `Pay ${formatRupees(plan.totalAmountRupees)}`
                  )}
                </Button>
                <p className="flex items-center justify-center gap-1.5 text-xs text-neutral-dark/45">
                  <Lock size={12} /> Secure payment by Zoho Payments · UPI, cards &amp; net banking
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-neutral-dark/80">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}

function Outcome({
  icon,
  title,
  body,
  reference,
  paymentId,
  onClose,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  reference?: string;
  paymentId?: string;
  onClose: () => void;
}) {
  return (
    <div className="mt-6 text-center" role="status">
      <div className="mb-3 flex justify-center">{icon}</div>
      <h4 className="font-display text-xl font-bold">{title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-neutral-dark/65">{body}</p>
      {(reference || paymentId) && (
        <dl className="mt-4 space-y-1 rounded-xl bg-light px-4 py-3 text-left text-xs text-neutral-dark/70">
          {reference && (
            <div className="flex justify-between gap-4">
              <dt>Reference</dt>
              <dd className="font-mono">{reference}</dd>
            </div>
          )}
          {paymentId && (
            <div className="flex justify-between gap-4">
              <dt>Payment ID</dt>
              <dd className="font-mono">{paymentId}</dd>
            </div>
          )}
        </dl>
      )}
      <Button type="button" variant="outline" className="mt-6 w-full" onClick={onClose}>
        Close
      </Button>
    </div>
  );
}
