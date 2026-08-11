import { getMembershipPlan } from "@/lib/membership-plans";
import {
  createRazorpayOrder,
  getRazorpayTestCredentials,
  RazorpayConfigurationError,
  RazorpayRequestError,
} from "@/lib/razorpay.server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { planId?: unknown };
    const plan = getMembershipPlan(body.planId);

    if (!plan) {
      return Response.json(
        { error: "Select a valid membership plan." },
        { status: 400 }
      );
    }

    const order = await createRazorpayOrder({
      planId: plan.id,
      planName: plan.name,
      amountPaise: plan.amountPaise,
    });
    const { keyId } = getRazorpayTestCredentials();

    return Response.json(
      {
        mode: "test",
        keyId,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
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
      console.error("Razorpay order creation failed:", error.message);
      return Response.json(
        { error: "Razorpay could not create the test order. Please try again." },
        { status: 502 }
      );
    }

    console.error("Unexpected test order error:", error);
    return Response.json(
      { error: "Unable to start the test payment." },
      { status: 500 }
    );
  }
}
