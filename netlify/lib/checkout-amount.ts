import type { MembershipPlan } from "../../src/lib/membership-plans";
// Use the advertised price for the session, widget, verification and receipt
// in both environments. Sandbox mode changes the provider, never the price.
export function checkoutAmount(plan: MembershipPlan) {
  return plan.totalAmountRupees;
}
