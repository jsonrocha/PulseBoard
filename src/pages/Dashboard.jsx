import { Clock, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";
import BugTrackerSection from "@/components/dashboard/BugTrackerSection";
import SprintSection from "@/components/dashboard/SprintSection";
import MarketingSection from "@/components/dashboard/MarketingSection";

const BOARD_IDS = {
  bugs: '18413113348',
  sprint: '18413113346',
  marketing: '18413113347',
};

export default function Dashboard() {
  const { data: snapshots = [], isLoading } = useQuery({
    queryKey: ['board-snapshots'],
    queryFn: () => base44.entities.BoardSnapshot.list('-fetched_at', 20),
    refetchInterval: 60_000,
  });

  const byBoard = {};
  snapshots.forEach(s => { byBoard[s.board_id] = s; });

  const lastSynced = snapshots.reduce((latest, s) => {
    if (!s.fetched_at) return latest;
    const d = new Date(s.fetched_at);
    return (!latest || d > latest) ? d : latest;
  }, null);

  return (
    <div className="p-6 max-w-[1400px] space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-[12px] text-muted-foreground mt-0.5">Aggregated view across monday.com boards</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Clock className="h-3 w-3" />
          )}
          {lastSynced
            ? `Last synced: ${format(lastSynced, "d MMM yyyy, h:mm a")} ${new Date().toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ').pop()}`
            : isLoading ? 'Loading…' : 'Never synced — use Admin → Refresh'}
        </div>
      </div>

      <BugTrackerSection snapshot={byBoard[BOARD_IDS.bugs]} />
      <SprintSection snapshot={byBoard[BOARD_IDS.sprint]} />
      <MarketingSection snapshot={byBoard[BOARD_IDS.marketing]} />
    </div>
  );
}