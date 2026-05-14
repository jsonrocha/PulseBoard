import { Megaphone, DollarSign, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import KpiCard from "./KpiCard";
import BoardSection from "./BoardSection";
import MiniTable from "./MiniTable";
import { marketingKpis, campaignsByChannel, leadsOverTime, campaignItems } from "@/lib/mockData";

const icons = [Megaphone, DollarSign, Users];

const mktColumns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Campaign" },
  { key: "channel", label: "Channel" },
  { key: "status", label: "Status" },
  { key: "spend", label: "Spend" },
  { key: "leads", label: "Leads" },
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

export default function MarketingSection() {
  return (
    <BoardSection title="Marketing Campaigns" subtitle="board_id: 4821041">
      <div className="grid grid-cols-3 gap-3">
        {marketingKpis.map((kpi, i) => (
          <KpiCard key={kpi.label} {...kpi} icon={icons[i]} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Spend & Leads by Channel</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={campaignsByChannel} barGap={2}>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(215, 14%, 50%)" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "hsl(215, 14%, 50%)" }} axisLine={false} tickLine={false} width={36} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "hsl(215, 14%, 50%)" }} axisLine={false} tickLine={false} width={24} />
              <Tooltip content={<CustomTooltip />} />
              <Bar yAxisId="left" dataKey="spend" fill="hsl(217, 91%, 60%)" radius={[2, 2, 0, 0]} name="Spend ($)" />
              <Bar yAxisId="right" dataKey="leads" fill="hsl(160, 60%, 45%)" radius={[2, 2, 0, 0]} name="Leads" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Leads & Spend Trend (6 weeks)</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={leadsOverTime}>
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(215, 14%, 50%)" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "hsl(215, 14%, 50%)" }} axisLine={false} tickLine={false} width={24} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "hsl(215, 14%, 50%)" }} axisLine={false} tickLine={false} width={36} />
              <Tooltip content={<CustomTooltip />} />
              <Line yAxisId="left" type="monotone" dataKey="leads" stroke="hsl(160, 60%, 45%)" dot={false} name="Leads" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="spend" stroke="hsl(217, 91%, 60%)" dot={false} name="Spend ($)" strokeWidth={2} />
              <Legend iconType="circle" iconSize={6} formatter={(v) => <span className="text-[11px] text-muted-foreground">{v}</span>} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <MiniTable columns={mktColumns} rows={campaignItems} />
    </BoardSection>
  );
}