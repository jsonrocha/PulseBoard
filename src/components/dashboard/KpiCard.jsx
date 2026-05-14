import { cn } from "@/lib/utils";

export default function KpiCard({ label, value, change, changeLabel, icon: Icon, color }) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        {Icon && (
          <div className={cn("h-7 w-7 rounded-md flex items-center justify-center", color || "bg-primary/10")}>
            <Icon className={cn("h-3.5 w-3.5", color ? "text-current" : "text-primary")} />
          </div>
        )}
      </div>
      <div className="text-2xl font-bold font-mono tracking-tight text-foreground">{value}</div>
      {(change !== undefined) && (
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className={cn(
            "text-[11px] font-mono font-medium",
            isNeutral ? "text-muted-foreground" : isPositive ? "text-emerald-400" : "text-red-400"
          )}>
            {isPositive ? "+" : ""}{change}%
          </span>
          {changeLabel && <span className="text-[11px] text-muted-foreground">{changeLabel}</span>}
        </div>
      )}
    </div>
  );
}