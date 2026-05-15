import { cn } from "@/lib/utils";

const statusColors = {
  "Open": "bg-yellow-500/15 text-yellow-400",
  "In Progress": "bg-blue-500/15 text-blue-400",
  "Resolved": "bg-emerald-500/15 text-emerald-400",
  "Closed": "bg-muted text-muted-foreground",
  "Done": "bg-emerald-500/15 text-emerald-400",
  "To Do": "bg-muted text-muted-foreground",
  "Blocked": "bg-red-500/15 text-red-400",
  "Active": "bg-emerald-500/15 text-emerald-400",
  "Paused": "bg-yellow-500/15 text-yellow-400",
  "Planned": "bg-blue-500/15 text-blue-400",
};

const severityColors = {
  "Critical": "text-red-400",
  "Major": "text-orange-400",
  "Minor": "text-yellow-400",
  "Trivial": "text-muted-foreground",
};

export default function MiniTable({ columns, rows }) {
  const renderCell = (col, row) => {
    const val = row[col.key];
    if (col.key === "status") {
      return (
        <span className={cn("text-[11px] font-medium px-1.5 py-0.5 rounded", statusColors[val] || "bg-muted text-muted-foreground")}>
          {val}
        </span>
      );
    }
    if (col.key === "severity") {
      return <span className={cn("text-[12px] font-medium", severityColors[val] || "")}>{val}</span>;
    }
    if (col.key === "id") {
      return <span className="font-mono text-[11px] text-muted-foreground">{val}</span>;
    }
    return <span className="text-[12px]">{val}</span>;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-y-auto max-h-[480px]">
        <table className="w-full">
          <thead className="sticky top-0 bg-card z-10">
            <tr className="border-b border-border">
              {columns.map(col => (
                <th key={col.key} className="px-3 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                {columns.map(col => (
                  <td key={col.key} className="px-3 py-2">
                    {renderCell(col, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}