import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Shield, RefreshCw, Database, MessageSquare, Loader2, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { ROCHA_FIXTURES } from "@/lib/rochaFixtures";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const queryClient = useQueryClient();

  const isTestEnv = import.meta.env.VITE_BASE44_DATA_ENV === 'dev';

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

  const handleSeedClick = () => {
    if (!isTestEnv) {
      toast.error("Seed Test Data is only available in test mode. Toggle Test Data in App Settings to use this.");
      return;
    }
    setConfirmOpen(true);
  };

  const handleSeedConfirm = async () => {
    setSeeding(true);
    try {
      // Delete all existing snapshots
      const existing = await base44.entities.BoardSnapshot.list("-created_date", 200);
      await Promise.all(existing.map(s => base44.entities.BoardSnapshot.delete(s.id)));

      // Insert Rocha LLC fixtures
      await base44.entities.BoardSnapshot.bulkCreate(
        ROCHA_FIXTURES.map(f => ({ ...f, fetched_at: new Date().toISOString() }))
      );

      await queryClient.invalidateQueries({ queryKey: ['admin-snapshots'] });
      await queryClient.invalidateQueries({ queryKey: ['board-snapshots'] });
      toast.success("Rocha LLC test data seeded successfully.");
    } catch (err) {
      toast.error(`Seed failed: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

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
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSeedClick}
              disabled={seeding}
              className="gap-1.5 text-[12px] text-muted-foreground border border-border hover:text-foreground"
            >
              <FlaskConical className={`h-3.5 w-3.5 ${seeding ? "animate-pulse" : ""}`} />
              {seeding ? "Seeding…" : "Seed Test Data"}
            </Button>
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
      </div>

      {/* Seed confirmation dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Seed Test Data?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace any existing test data with the fictional <strong>Rocha LLC</strong> dataset.
              All current BoardSnapshot records will be deleted and 3 new fixtures will be inserted. Proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSeedConfirm}>Seed Test Data</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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