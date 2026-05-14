import { cn } from "@/lib/utils";

export default function BoardSection({ title, subtitle, children, className }) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-baseline gap-3">
        <h2 className="text-sm font-semibold text-foreground tracking-tight">{title}</h2>
        {subtitle && <span className="text-[11px] font-mono text-muted-foreground">{subtitle}</span>}
      </div>
      {children}
    </section>
  );
}