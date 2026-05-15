import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Shield, RefreshCw, Database, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: chatQueries = [], isLoading: loadingQueries } = useQuery({
    queryKey: ["admin-chat-queries"],
    queryFn: () => base44.entities.ChatQuery.list("-created_date", 50),
  });

  const { data: snapshots = [], isLoading: loadingSnapshots } = useQuery({
    queryKey: ["admin-snapshots"],
    queryFn: () => base44.entities.BoardSnapshot.list("-created_date", 100),
  });

  const isAdmin = user?.role === "admin";

  if (!isAdmin && user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Shield className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">Admin access required</p>
          <p className="text-[12px] text-muted-foreground mt-1">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await base44.functions.invoke('syncMondayBoards', {});
      const { synced = [], errors = [] } = res.data;
      await queryClient.invalidateQueries({ queryKey: ['admin-snapshots'] });
      await queryClient.invalidateQueries({ queryKey: ['board-snapshots'] });
      if (errors.length > 0) {
        toast.warning(`Synced ${synced.length} board(s). ${errors.length} failed: ${errors.map(e => e.board_id).join(', ')}`);
      } else {
        toast.success(`Synced ${synced.length} board(s) successfully.`);
      }
    } catch (err) {
      toast.error(`Sync failed: ${err.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="p-6 max-w-[1400px] space-y-6">
      <div>
        <h1 className="text-lg font-bold tracking-tight text-foreground">Admin Panel</h1>
        <p className="text-[12px] text-muted-foreground mt-0.5">System overview and query logs</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center">
            <Database className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Board Snapshots</div>
            <div className="text-xl font-bold font-mono text-foreground mt-0.5">
              {loadingSnapshots ? "—" : snapshots.length}
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Chat Queries</div>
            <div className="text-xl font-bold font-mono text-foreground mt-0.5">
              {loadingQueries ? "—" : chatQueries.length}
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Monday Sync</div>
            <div className="text-[12px] text-muted-foreground mt-1">Trigger a full board refresh</div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="gap-1.5 text-[12px]"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Syncing…" : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Chat queries table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-foreground">All Chat Queries</h2>
          <Badge variant="secondary" className="text-[10px] font-mono">
            {chatQueries.length} records
          </Badge>
        </div>
        {loadingQueries ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : chatQueries.length === 0 ? (
          <div className="text-center py-12 text-[12px] text-muted-foreground">
            No queries yet. Go to Ask PulseBoard to try it out.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-40">User</th>
                  <th className="px-4 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Question</th>
                  <th className="px-4 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-32">Date</th>
                </tr>
              </thead>
              <tbody>
                {chatQueries.map((q) => (
                  <tr key={q.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-2.5 text-[12px] font-mono text-muted-foreground">{q.user_email}</td>
                    <td className="px-4 py-2.5 text-[12px] text-foreground max-w-md truncate">{q.question}</td>
                    <td className="px-4 py-2.5 text-[11px] font-mono text-muted-foreground">
                      {q.created_date ? format(new Date(q.created_date), "MMM d, HH:mm") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}