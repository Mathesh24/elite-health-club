"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { plans } from "@/lib/constants";
import { cn } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";

export default function Membership() {
  const [annual, setAnnual] = useState(false);

  return (
    <section
      id="plans"
      className="bg-light py-24"
      aria-label="Membership plans"
    >
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection>
          <SectionHeading
            title="Choose Your Plan"
            subtitle="Members only Club nestled in the serene surroundings ,it’s a lifestyle destination for families who value togetherness, leisure and exclusivity."
          />
        </AnimatedSection>

        {/* Toggle */}
        <AnimatedSection>
          <div className="mb-14 flex items-center justify-center gap-3">
            <span
              className={cn(
                "text-sm font-medium",
                !annual ? "text-neutral-dark" : "text-neutral-dark/50"
              )}
            >
              Monthly
            </span>
            <button
              onClick={() => setAnnual((v) => !v)}
              className={cn(
                "relative h-7 w-12 rounded-full transition-colors",
                annual ? "bg-brand" : "bg-neutral-dark/20"
              )}
              aria-label="Toggle annual billing"
            >
              <motion.div
                layout
                className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md"
                style={{ left: annual ? "calc(100% - 1.625rem)" : "0.125rem" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span
              className={cn(
                "text-sm font-medium",
                annual ? "text-neutral-dark" : "text-neutral-dark/50"
              )}
            >
              Annual{" "}
              <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-semibold text-accent">
                Save ~20%
              </span>
            </span>
          </div>
        </AnimatedSection>

        {/* Cards */}
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <AnimatedSection key={plan.name} delay={i * 0.12}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-2xl bg-white p-8 transition-shadow duration-200",
                  plan.highlighted
                    ? "scale-[1.03] border-2 border-brand shadow-xl"
                    : "border border-neutral-dark/10 shadow-md hover:shadow-lg"
                )}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}

                <h3 className="font-display text-2xl font-bold text-neutral-dark">
                  {plan.name}
                </h3>

                <div className="mt-4 flex items-baseline gap-1">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={annual ? "a" : "m"}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="font-display text-4xl font-bold text-brand"
                    >
                      ${annual ? plan.annualPrice : plan.monthlyPrice}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-sm text-neutral-dark/50">
                    /{annual ? "year" : "month"}
                  </span>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-neutral-dark/70"
                    >
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0 text-brand"
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.highlighted ? "primary" : "outline"}
                  className="mt-8 w-full"
                  href="#contact"
                >
                  Get Started
                </Button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
