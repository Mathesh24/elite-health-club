import { getMembershipPlan } from "@/lib/membership-plans";
import {
  fetchRazorpayOrder,
  fetchRazorpayPayment,
  RazorpayConfigurationError,
  RazorpayRequestError,
  verifyRazorpayPaymentSignature,
} from "@/lib/razorpay.server";

export const runtime = "nodejs";

type VerificationBody = {
  planId?: unknown;
  orderId?: unknown;
  paymentId?: unknown;
  signature?: unknown;
};

function isBoundedString(value: unknown, maximumLength: number): value is string {
  return (
    typeof value === "string" && value.length > 0 && value.length <= maximumLength
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VerificationBody;
    const plan = getMembershipPlan(body.planId);

    if (
      !plan ||
      !isBoundedString(body.orderId, 100) ||
      !isBoundedString(body.paymentId, 100) ||
      !isBoundedString(body.signature, 128)
    ) {
      return Response.json(
        { error: "The payment verification details are incomplete." },
        { status: 400 }
      );
    }

    const signatureIsValid = verifyRazorpayPaymentSignature({
      orderId: body.orderId,
      paymentId: body.paymentId,
      signature: body.signature,
    });

    if (!signatureIsValid) {
      return Response.json(
        { error: "Payment signature verification failed." },
        { status: 400 }
      );
    }

    const [order, payment] = await Promise.all([
      fetchRazorpayOrder(body.orderId),
      fetchRazorpayPayment(body.paymentId),
    ]);

    const orderMatchesPlan =
      order.id === body.orderId &&
      order.amount === plan.amountPaise &&
      order.currency === "INR" &&
      order.notes?.plan_id === plan.id;
    const paymentMatchesOrder =
      payment.id === body.paymentId &&
      payment.order_id === order.id &&
      payment.amount === order.amount &&
      payment.currency === order.currency;

    if (!orderMatchesPlan || !paymentMatchesOrder) {
      return Response.json(
        { error: "The verified payment does not match this membership plan." },
        { status: 400 }
      );
    }

    const captured = payment.status === "captured";

    return Response.json(
      {
        verified: true,
        captured,
        mode: "test",
        status: payment.status,
        orderId: order.id,
        paymentId: payment.id,
        plan: {
          id: plan.id,
          name: plan.name,
        },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json({ error: "Invalid request." }, { status: 400 });
    }

    if (error instanceof RazorpayConfigurationError) {
      console.error("Razorpay configuration error:", error.message);
      return Response.json(
        { error: "Test payments are not configured on the server." },
        { status: 503 }
      );
    }

    if (error instanceof RazorpayRequestError) {
      console.error("Razorpay verification lookup failed:", error.message);
      return Response.json(
        { error: "Razorpay could not confirm the payment status." },
        { status: 502 }
      );
    }

    console.error("Unexpected payment verification error:", error);
    return Response.json(
      { error: "Unable to verify the test payment." },
      { status: 500 }
    );
  }
}
