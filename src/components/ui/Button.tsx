"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  href?: string;
  external?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-accent text-neutral-dark font-semibold hover:bg-accent/90 shadow-lg shadow-accent/20",
  ghost:
    "border border-white/30 text-white hover:bg-white/10",
  outline:
    "border-2 border-brand text-brand hover:bg-brand hover:text-white",
};

export default function Button({
  variant = "primary",
  className,
  href,
  external = false,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full px-7 py-3 text-sm tracking-wide transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer",
    variantStyles[variant],
    className
  );

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
