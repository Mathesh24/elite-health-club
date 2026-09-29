import { ArrowLeft } from "lucide-react";
import { CONTACT_INFO, LEGAL_INFO } from "@/lib/constants";

// Shared shell for the policy pages (terms, privacy, refunds).

export default function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <article className="bg-light px-6 pb-20 pt-12 sm:pt-16">
      <div className="mx-auto max-w-3xl">
        <a
          href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/`}
          className="mb-10 inline-flex items-center gap-2 text-sm text-neutral-dark/60 transition-colors hover:text-brand"
        >
          <ArrowLeft size={16} /> Back to Elite Health Club
        </a>
        <h1 className="font-display text-4xl font-bold tracking-tight text-neutral-dark sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-neutral-dark/50">
          Last updated: {lastUpdated}
        </p>

        <div className="legal-content mt-10 space-y-8 text-[15px] leading-relaxed text-neutral-dark/75">
          {children}
        </div>

        <section className="mt-12 rounded-2xl border border-neutral-dark/10 bg-white p-6 text-sm leading-relaxed text-neutral-dark/70">
          <h2 className="mb-2 font-display text-lg font-semibold text-neutral-dark">
            Contact us
          </h2>
          <p>{LEGAL_INFO.legalName}</p>
          <p>{CONTACT_INFO.address}</p>
          {LEGAL_INFO.gstin && <p>GSTIN: {LEGAL_INFO.gstin}</p>}
          <p className="mt-2">
            Email: {CONTACT_INFO.email} · Phone: {CONTACT_INFO.phone}
          </p>
        </section>
      </div>
    </article>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 font-display text-xl font-semibold text-neutral-dark">
        {heading}
      </h2>
      <div className="space-y-3 [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
        {children}
      </div>
    </section>
  );
}
