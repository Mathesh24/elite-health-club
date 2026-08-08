"use client";

import { Globe, Send, CirclePlay, ArrowUp } from "lucide-react";
import { NAV_LINKS, CONTACT_INFO } from "@/lib/constants";
import Image from "next/image";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-light text-neutral-dark/70 border-t border-neutral-dark/10">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/logo1.png`}
              alt="Elite Health Club"
              width={160}
              height={40}
              className="mb-4 h-9 w-auto"
            />
            <a
              href={CONTACT_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block max-w-xs text-sm leading-relaxed transition-colors hover:text-brand"
            >
              {CONTACT_INFO.address}
            </a>
            <p className="mt-2 text-sm">{CONTACT_INFO.phone}</p>
            <p className="text-sm">{CONTACT_INFO.email}</p>
          </div>

          {/* Nav */}
          <div>
            <h4 className="mb-4 font-display text-lg font-semibold text-neutral-dark">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-4 font-display text-lg font-semibold text-neutral-dark">
              Follow Us
            </h4>
            <div className="flex gap-4">
              {[
                { Icon: Globe, label: "Instagram" },
                { Icon: Send, label: "Facebook" },
                { Icon: CirclePlay, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-dark/20 transition-colors hover:border-brand hover:text-brand"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
            <p className="mt-6 text-sm">{CONTACT_INFO.hours}</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-dark/10 pt-8 sm:flex-row">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} Elite Health Club. All rights
            reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-xs transition-colors hover:text-accent"
            aria-label="Back to top"
          >
            Back to top <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
