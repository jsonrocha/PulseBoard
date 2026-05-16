import { Megaphone, Radio, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import KpiCard from "./KpiCard";
import BoardSection from "./BoardSection";
import MiniTable from "./MiniTable";
import { parseMarketing } from "@/lib/parseBoardData";

const icons = [Megaphone, Radio, Calendar];

const mktColumns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Campaign" },
  { key: "channel", label: "Channel" },
  { key: "status", label: "Status" },
  { key: "owner", label: "Owner" },
  { key: "updated", label: "Updated" },
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

const EmptyState = () => (
  <div className="bg-card border border-border rounded-lg p-8 text-center text-[12px] text-muted-foreground col-span-2">
    No data yet — click <span className="text-foreground font-medium">Refresh</span> in the Admin panel to sync.
  </div>
);

export default function MarketingSection({ snapshot }) {
  const items = (() => {
    try { return snapshot ? JSON.parse(snapshot.raw_items_json) : null; } catch { return null; }
  })();

  const parsed = items ? parseMarketing(items) : null;

  return (
    <BoardSection title="Marketing Campaigns" subtitle={`board_id: 18413113347${snapshot ? ` · ${items?.length ?? 0} items` : ''}`}>
      {parsed ? (
        <>
          <div className="grid grid-cols-3 gap-3">
            {parsed.kpis.map((kpi, i) => (
              <KpiCard key={kpi.label} {...kpi} icon={icons[i]} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Campaigns by Status</div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={parsed.statusChart} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} stroke="none">
                    {parsed.statusChart.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Legend iconType="circle" iconSize={6} formatter={(v) => <span className="text-[11px] text-muted-foreground">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Campaigns by Channel</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={parsed.channelChart} barGap={2}>
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(215, 14%, 50%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215, 14%, 50%)" }} axisLine={false} tickLine={false} width={24} />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Bar
                    dataKey="count"
                    radius={[2, 2, 0, 0]}
                    name="Count"
                    style={{ cursor: 'pointer' }}
                  >
                    {parsed.statusChart.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.fill}
                        className="recharts-bar-hover"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <MiniTable columns={mktColumns} rows={parsed.tableRows} />
        </>
      ) : (
        <div className="grid grid-cols-2 gap-3"><EmptyState /></div>
      )}
    </BoardSection>
  );
}