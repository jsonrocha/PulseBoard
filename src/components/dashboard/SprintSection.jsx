import { Zap, BarChart3, ArrowLeftRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import KpiCard from "./KpiCard";
import BoardSection from "./BoardSection";
import MiniTable from "./MiniTable";
import { sprintKpis, sprintByStatus, sprintBurndown, sprintItems } from "@/lib/mockData";

const icons = [Zap, BarChart3, ArrowLeftRight];

const sprintColumns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Task" },
  { key: "points", label: "Pts" },
  { key: "status", label: "Status" },
  { key: "assignee", label: "Assignee" },
  { key: "type", label: "Type" },
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

export default function SprintSection() {
  return (
    <BoardSection title="Engineering Sprint 24" subtitle="board_id: 4821040">
      <div className="grid grid-cols-3 gap-3">
        {sprintKpis.map((kpi, i) => (
          <KpiCard key={kpi.label} {...kpi} icon={icons[i]} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Items by Status</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={sprintByStatus} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} stroke="none">
                {sprintByStatus.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={6} formatter={(v) => <span className="text-[11px] text-muted-foreground">{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Sprint Burndown</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={sprintBurndown}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(215, 14%, 50%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215, 14%, 50%)" }} axisLine={false} tickLine={false} width={24} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="ideal" stroke="hsl(215, 14%, 35%)" strokeDasharray="4 4" dot={false} name="Ideal" strokeWidth={1.5} />
              <Line type="monotone" dataKey="actual" stroke="hsl(217, 91%, 60%)" dot={false} name="Actual" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <MiniTable columns={sprintColumns} rows={sprintItems} />
    </BoardSection>
  );
}