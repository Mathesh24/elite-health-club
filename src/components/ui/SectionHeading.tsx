import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  light?: boolean;
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mx-auto mb-10 max-w-2xl text-center sm:mb-12", className)}>
      <h2
        className={cn(
          "font-display text-4xl font-bold tracking-tight sm:text-5xl",
          light
            ? "text-white"
            : "bg-gradient-to-r from-[#0E4D49] via-[#157070] to-[#3C9088] bg-clip-text text-transparent"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-3 text-base leading-relaxed sm:text-lg",
            light ? "text-white/70" : "text-neutral-dark/60"
          )}
        >
          {subtitle}
        </p>
      )}
      <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-accent sm:w-16" />
    </div>
  );
}
