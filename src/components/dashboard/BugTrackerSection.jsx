import { Bug, AlertTriangle, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import KpiCard from "./KpiCard";
import BoardSection from "./BoardSection";
import MiniTable from "./MiniTable";
import { bugTrackerKpis, bugsBySeverity, bugsOverTime, bugItems } from "@/lib/mockData";

const icons = [Bug, AlertTriangle, Clock];

const bugColumns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Bug" },
  { key: "severity", label: "Severity" },
  { key: "status", label: "Status" },
  { key: "assignee", label: "Assignee" },
  { key: "age", label: "Age" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-md px-3 py-2 text-[11px] shadow-lg">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-muted-foreground">
          <span style={{ color: p.color }}>●</span> {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function BugTrackerSection() {
  return (
    <BoardSection title="Bug Tracker" subtitle="board_id: 4821039">
      <div className="grid grid-cols-3 gap-3">
        {bugTrackerKpis.map((kpi, i) => (
          <KpiCard key={kpi.label} {...kpi} icon={icons[i]} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Bugs by Severity</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={bugsBySeverity} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} stroke="none">
                {bugsBySeverity.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={6} formatter={(v) => <span className="text-[11px] text-muted-foreground">{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Opened vs Resolved (6 weeks)</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={bugsOverTime} barGap={2}>
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(215, 14%, 50%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215, 14%, 50%)" }} axisLine={false} tickLine={false} width={24} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="opened" fill="hsl(0, 72%, 55%)" radius={[2, 2, 0, 0]} name="Opened" />
              <Bar dataKey="resolved" fill="hsl(160, 60%, 45%)" radius={[2, 2, 0, 0]} name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <MiniTable columns={bugColumns} rows={bugItems} />
    </BoardSection>
  );
}