import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRole } from "@/lib/demo-data";
import { RoleBadge } from "@/components/ui/role-badge";

export function AppHeader() {
  const { currentRole, setCurrentRole, sidebarCollapsed } = useApp();

  const roles: UserRole[] = ['admin', 'tutor', 'student', 'parent'];

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-14 bg-background border-b border-border flex items-center justify-between px-6 transition-all duration-200",
        sidebarCollapsed ? "left-16" : "left-60"
      )}
    >
      {/* Search */}
      <div className="relative max-w-sm flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-9 h-8 text-sm bg-transparent border-transparent hover:border-border focus-visible:border-border"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Role Switcher (Demo) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 h-8 text-xs">
              <span className="text-muted-foreground">Demo:</span>
              <RoleBadge role={currentRole} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Switch Role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {roles.map((role) => (
              <DropdownMenuItem
                key={role}
                onClick={() => setCurrentRole(role)}
                className={cn(role === currentRole && "bg-muted")}
              >
                <RoleBadge role={role} />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full" />
        </Button>
      </div>
    </header>
  );
}
