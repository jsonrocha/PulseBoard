import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import UserMenu from "./UserMenu";

const isTestEnv = (() => {
  try {
    const url = new URLSearchParams(window.location.search);
    if (url.get("data_env") === "dev") return true;
    return localStorage.getItem("base44_data_env") === "dev";
  } catch { return false; }
})();

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background font-sans">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 flex items-center justify-end px-5 border-b border-border bg-background sticky top-0 z-20">
          <UserMenu />
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      {isTestEnv && (
        <div className="fixed bottom-0 right-0 w-40 h-40 pointer-events-none overflow-hidden z-50">
          <div
            className="absolute bottom-6 right-[-36px] w-48 py-1.5 text-center font-bold text-[13px] tracking-widest uppercase rotate-[-45deg] origin-center"
            style={{ background: "rgba(220,38,38,0.75)", color: "rgba(255,255,255,0.95)", letterSpacing: "0.2em" }}
          >
            TEST
          </div>
        </div>
      )}
    </div>
  );
}