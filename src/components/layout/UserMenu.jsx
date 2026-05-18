import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

function getInitials(name, email) {
  if (name && name.trim()) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return (email?.[0] ?? "?").toUpperCase();
}

export default function UserMenu() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const handleSignOut = () => {
    base44.auth.logout();
  };

  const initials = user ? getInitials(user.full_name, user.email) : "?";
  const role = user?.role ?? "user";
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="h-8 w-8 rounded-full bg-secondary border border-border flex items-center justify-center text-[12px] font-semibold text-foreground hover:bg-secondary/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="User menu"
        >
          {initials}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <div className="px-3 py-2.5 space-y-1">
          <p className="text-[12px] text-muted-foreground truncate">{user?.email ?? "—"}</p>
          <Badge variant="secondary" className="text-[10px] capitalize">{roleLabel}</Badge>
        </div>
        <DropdownMenuSeparator />
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors rounded-sm"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}