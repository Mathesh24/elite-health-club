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
    <div className={cn("mx-auto mb-16 max-w-2xl text-center", className)}>
      <h2
        className={cn(
          "font-display text-4xl font-bold tracking-tight sm:text-5xl",
          light ? "text-white" : "text-neutral-dark"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed",
            light ? "text-white/70" : "text-neutral-dark/60"
          )}
        >
          {subtitle}
        </p>
      )}
      <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-accent" />
    </div>
  );
}
