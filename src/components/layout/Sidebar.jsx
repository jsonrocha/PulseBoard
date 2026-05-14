import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, MessageSquare, Shield, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/ask", label: "Ask PulseBoard", icon: MessageSquare },
  { path: "/admin", label: "Admin", icon: Shield },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-56 h-screen sticky top-0 flex flex-col bg-background border-r border-border">
      <div className="px-4 h-14 flex items-center gap-2.5 border-b border-border">
        <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
          <Activity className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-sm tracking-tight text-foreground">PulseBoard</span>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors",
                active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-border">
        <div className="text-[11px] text-muted-foreground font-mono">v0.1.0 · scaffold</div>
      </div>
    </aside>
  );
}