import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, MessageSquare, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import PulseLogo from "@/components/PulseLogo";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/ask", label: "Ask PulseBoard", icon: MessageSquare },
  { path: "/admin", label: "Admin", icon: Shield },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col bg-background transition-all duration-200",
        collapsed ? "w-14" : "w-56"
      )}
    >
      {/* Header — always shows logo + title */}
      <div className="px-3 h-14 flex items-center gap-2.5 flex-shrink-0 border-b border-border overflow-hidden">
        <PulseLogo size={28} className="flex-shrink-0" />
        {!collapsed && (
          <span className="font-semibold text-sm tracking-tight text-foreground truncate">PulseBoard</span>
        )}
      </div>

      {/* Nav + collapse toggle row */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center rounded-md text-[13px] font-medium transition-colors",
                collapsed ? "justify-center px-0 py-2" : "gap-2.5 px-3 py-2",
                active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      {/* Footer — collapse toggle + version */}
      <div className={cn("px-2 py-3 border-t border-border space-y-0.5")}>
        <button
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "w-full flex items-center rounded-md text-[13px] font-medium transition-colors",
            collapsed ? "justify-center px-0 py-2" : "gap-2.5 px-3 py-2",
            "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-border"
          )}
        >
          {collapsed
            ? <ChevronRight className="h-4 w-4 flex-shrink-0" />
            : <><ChevronLeft className="h-4 w-4 flex-shrink-0" /><span>Collapse</span></>
          }
        </button>
        {!collapsed && <div className="text-[11px] text-muted-foreground font-mono px-3 pt-1">v0.1.0</div>}
      </div>
    </aside>
  );
}