import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

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

// Numeric columns — sort numerically, others alphabetically
const numericKeys = new Set(["id", "updated"]);

function compareValues(a, b, key) {
  const aVal = a[key] ?? "";
  const bVal = b[key] ?? "";
  if (numericKeys.has(key)) {
    const aNum = Number(aVal);
    const bNum = Number(bVal);
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
    // Fall back to date comparison for "updated"
    const aDate = new Date(aVal);
    const bDate = new Date(bVal);
    if (!isNaN(aDate) && !isNaN(bDate)) return aDate - bDate;
  }
  return String(aVal).localeCompare(String(bVal));
}

export default function MiniTable({ columns, rows }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => {
      const cmp = compareValues(a, b, sortKey);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [rows, sortKey, sortDir]);

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
    if (col.key === "name" && row.mondayUrl && /^\d+$/.test(String(row.id))) {
      return (
        <a
          href={row.mondayUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] transition-colors hover:text-primary hover:underline"
        >
          {val}
        </a>
      );
    }
    return <span className="text-[12px]">{val}</span>;
  };

  const SortIcon = ({ colKey }) => {
    if (sortKey !== colKey) return <ChevronsUpDown className="h-3 w-3 opacity-30" />;
    return sortDir === "asc"
      ? <ChevronUp className="h-3 w-3 text-primary" />
      : <ChevronDown className="h-3 w-3 text-primary" />;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-y-auto max-h-[480px]">
        <table className="w-full">
          <thead className="sticky top-0 bg-card z-10">
            <tr className="border-b border-border">
              {columns.map(col => (
                <th
                  key={col.key}
                  className="px-3 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => handleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    <SortIcon colKey={col.key} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, i) => (
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