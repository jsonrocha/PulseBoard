import { Clock } from "lucide-react";
import BugTrackerSection from "@/components/dashboard/BugTrackerSection";
import SprintSection from "@/components/dashboard/SprintSection";
import MarketingSection from "@/components/dashboard/MarketingSection";

export default function Dashboard() {
  return (
    <div className="p-6 max-w-[1400px] space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-[12px] text-muted-foreground mt-0.5">Aggregated view across Monday.com boards</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
          <Clock className="h-3 w-3" />
          Last synced: 14 May 2026, 09:32 UTC
        </div>
      </div>

      <BugTrackerSection />
      <SprintSection />
      <MarketingSection />
    </div>
  );
}