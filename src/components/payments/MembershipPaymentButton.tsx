"use client";

import { useState } from "react";
import { CheckCircle2, CircleAlert, CreditCard, LoaderCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import {
  formatRupeesFromPaise,
  MEMBERSHIP_PLANS,
  type MembershipPlanId,
} from "@/lib/membership-plans";

type PaymentState =
  | { status: "idle" }
  | { status: "loading"; message: string }
  | { status: "cancelled"; message: string }
  | { status: "error"; message: string }
  | {
      status: "verified";
      message: string;
      paymentId: string;
      captured: boolean;
    };

type CheckoutSuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id: string;
  handler: (response: CheckoutSuccess) => void | Promise<void>;
  notes: Record<string, string>;
  theme: { color: string };
  modal: { ondismiss: () => void };
};

type RazorpayCheckout = {
  open: () => void;
  on: (
    event: "payment.failed",
    handler: (response: { error?: { description?: string } }) => void
  ) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayCheckout;
  }
}

type CreateOrderResponse = {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  plan: { id: MembershipPlanId; name: string };
  error?: string;
};

type VerifyPaymentResponse = {
  verified?: boolean;
  captured?: boolean;
  status?: string;
  paymentId?: string;
  error?: string;
};

let checkoutScriptPromise: Promise<void> | null = null;

function loadRazorpayCheckout() {
  if (window.Razorpay) {
    return Promise.resolve();
  }

  if (checkoutScriptPromise) {
    return checkoutScriptPromise;
  }

  checkoutScriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      checkoutScriptPromise = null;
      reject(new Error("Unable to load Razorpay Checkout."));
    };
    document.body.appendChild(script);
  });

  return checkoutScriptPromise;
}

async function readJsonResponse<T extends { error?: string }>(response: Response) {
  const data = (await response.json().catch(() => ({}))) as T;

  if (!response.ok) {
    throw new Error(data.error || "The test payment request failed.");
  }

  return data;
}

export default function MembershipPaymentButton({
  planId,
  featured = false,
}: {
  planId: MembershipPlanId;
  featured?: boolean;
}) {
  const [paymentState, setPaymentState] = useState<PaymentState>({
    status: "idle",
  });
  const plan = MEMBERSHIP_PLANS[planId];
  const busy = paymentState.status === "loading";

  const startPayment = async () => {
    setPaymentState({
      status: "loading",
      message: "Creating a secure Razorpay test order…",
    });

    try {
      const [order] = await Promise.all([
        fetch("/api/payments/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId }),
        }).then((response) => readJsonResponse<CreateOrderResponse>(response)),
        loadRazorpayCheckout(),
      ]);

      if (!window.Razorpay) {
        throw new Error("Razorpay Checkout did not load. Please try again.");
      }

      let checkoutCompleted = false;
      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Elite Health Club",
        description: `${order.plan.name} — TEST MODE`,
        image: "/logo1.png",
        order_id: order.orderId,
        notes: {
          plan_id: order.plan.id,
          environment: "test",
        },
        theme: { color: "#166534" },
        modal: {
          ondismiss: () => {
            if (!checkoutCompleted) {
              setPaymentState({
                status: "cancelled",
                message: "Test checkout closed. No payment was made.",
              });
            }
          },
        },
        handler: async (response) => {
          checkoutCompleted = true;
          setPaymentState({
            status: "loading",
            message: "Verifying the test payment on the server…",
          });

          try {
            const verification = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                planId,
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            }).then((result) =>
              readJsonResponse<VerifyPaymentResponse>(result)
            );

            if (!verification.verified || !verification.paymentId) {
              throw new Error("Razorpay returned an unverified payment.");
            }

            setPaymentState({
              status: "verified",
              captured: Boolean(verification.captured),
              paymentId: verification.paymentId,
              message: verification.captured
                ? "Test payment verified and captured. No real money was charged."
                : `Payment signature verified; Razorpay status is ${verification.status || "pending"}.`,
            });
          } catch (error) {
            setPaymentState({
              status: "error",
              message:
                error instanceof Error
                  ? error.message
                  : "Unable to verify the test payment.",
            });
          }
        },
      });

      checkout.on("payment.failed", (response) => {
        checkoutCompleted = true;
        setPaymentState({
          status: "error",
          message:
            response.error?.description ||
            "The Razorpay test payment failed. Try the success scenario next.",
        });
      });

      setPaymentState({
        status: "loading",
        message: "Complete the simulated payment in Razorpay Checkout…",
      });
      checkout.open();
    } catch (error) {
      setPaymentState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to open the test payment.",
      });
    }
  };

  return (
    <div className="mt-7 space-y-3">
      <Button
        type="button"
        variant="primary"
        className="w-full disabled:cursor-not-allowed disabled:opacity-60"
        disabled={busy}
        onClick={startPayment}
      >
        {busy ? (
          <LoaderCircle
            size={17}
            className="mr-2 animate-spin"
            aria-hidden="true"
          />
        ) : (
          <CreditCard size={17} className="mr-2" aria-hidden="true" />
        )}
        {busy
          ? "Opening Test Checkout…"
          : `Test Pay ${formatRupeesFromPaise(plan.amountPaise)}`}
      </Button>

      <Button
        href="#contact"
        variant={featured ? "ghost" : "outline"}
        className="w-full"
      >
        Enquire Instead
      </Button>

      {paymentState.status !== "idle" && (
        <div
          role={paymentState.status === "error" ? "alert" : "status"}
          aria-live="polite"
          className={`rounded-xl border px-4 py-3 text-left text-xs leading-relaxed ${
            paymentState.status === "verified"
              ? paymentState.captured
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border-amber-300 bg-amber-50 text-amber-800"
              : paymentState.status === "error"
                ? "border-red-300 bg-red-50 text-red-700"
                : featured
                  ? "border-white/20 bg-white/10 text-white/80"
                  : "border-neutral-dark/10 bg-light text-neutral-dark/70"
          }`}
        >
          <div className="flex items-start gap-2">
            {paymentState.status === "verified" ? (
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            ) : paymentState.status === "error" ? (
              <CircleAlert size={16} className="mt-0.5 shrink-0" />
            ) : null}
            <div>
              <p>{paymentState.message}</p>
              {paymentState.status === "verified" && (
                <p className="mt-1 break-all font-mono">
                  Test payment: {paymentState.paymentId}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
