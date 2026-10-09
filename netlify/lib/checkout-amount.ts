import type { MembershipPlan } from "../../src/lib/membership-plans";
import type { ZohoEnvironment } from "./config";

// Zoho's UPI sandbox simulates successful payments at amounts <= Rs. 500.
// Keep the same amount in the session, widget, verification, and event log.
export function checkoutAmount(plan: MembershipPlan, environment: ZohoEnvironment) {
  return environment === "sandbox" ? 100 : plan.totalAmountRupees;
}
