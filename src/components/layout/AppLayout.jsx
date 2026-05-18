import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import UserMenu from "./UserMenu";
import { base44 } from "@/api/base44Client";

const isTestEnvGlobal = (() => {
  try {
    const params = new URLSearchParams(window.location.search);
    // Base44 preview UI uses base44_data_env=dev, share links use "share" in URL
    if (params.get("base44_data_env") === "dev") return true;
    if (params.get("data_env") === "dev") return true;
    if (window.location.href.includes("share")) return true;
    return false;
  } catch { return false; }
})();

export default function AppLayout() {
  const isTestEnv = isTestEnvGlobal;

  return (
    <div className="flex min-h-screen bg-background font-sans">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 flex items-center justify-end px-5 border-b border-border bg-background sticky top-0 z-20">
          {isTestEnv && (
            <span className="mr-auto ml-2 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-widest bg-red-500/20 text-red-400 border border-red-500/40">
              TEST MODE
            </span>
          )}
          <UserMenu />
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}