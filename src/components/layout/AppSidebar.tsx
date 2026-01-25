import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";
import { NavLink } from "@/components/NavLink";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  UserCheck,
  Calendar, 
  FileText, 
  MessageSquare, 
  Settings,
  BarChart3,
  GraduationCap,
  Home,
  Trophy,
  Bell,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Building2,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoleBadge } from "@/components/ui/role-badge";
import { UserRole } from "@/lib/demo-data";

interface NavItem {
  label: string;
  href: string;
  icon: any;
}

const roleNavItems: Record<UserRole, NavItem[]> = {
  admin: [
    { label: 'Dashboard', href: '/app', icon: LayoutDashboard },
    { label: 'Courses', href: '/app/courses', icon: BookOpen },
    { label: 'Students', href: '/app/students', icon: GraduationCap },
    { label: 'Parents', href: '/app/parents', icon: Users },
    { label: 'Cohorts', href: '/app/cohorts', icon: UserCheck },
    { label: 'Timetable', href: '/app/timetable', icon: Calendar },
    { label: 'Invoices', href: '/app/invoices', icon: FileText },
    { label: 'Messages', href: '/app/messages', icon: MessageSquare },
    { label: 'Reports', href: '/app/reports', icon: BarChart3 },
    { label: 'Settings', href: '/app/settings', icon: Settings },
  ],
  tutor: [
    { label: 'Today', href: '/app', icon: Home },
    { label: 'Courses', href: '/app/courses', icon: BookOpen },
    { label: 'Cohorts', href: '/app/cohorts', icon: UserCheck },
    { label: 'Assessments', href: '/app/assessments', icon: GraduationCap },
    { label: 'Submissions', href: '/app/submissions', icon: FileText },
    { label: 'Messages', href: '/app/messages', icon: MessageSquare },
  ],
  student: [
    { label: 'Home', href: '/app', icon: Home },
    { label: 'My Courses', href: '/app/courses', icon: BookOpen },
    { label: 'Timetable', href: '/app/timetable', icon: Calendar },
    { label: 'Progress', href: '/app/progress', icon: Trophy },
    { label: 'Announcements', href: '/app/announcements', icon: Bell },
  ],
  parent: [
    { label: 'Home', href: '/app', icon: Home },
    { label: 'Timetable', href: '/app/timetable', icon: Calendar },
    { label: 'Progress', href: '/app/progress', icon: BarChart3 },
    { label: 'Invoices', href: '/app/invoices', icon: CreditCard },
    { label: 'Messages', href: '/app/messages', icon: MessageSquare },
  ],
};

export function AppSidebar() {
  const navigate = useNavigate();
  const { currentRole, currentUser, currentCentre, centres, setCurrentCentre, sidebarCollapsed, setSidebarCollapsed } = useApp();
  const navItems = roleNavItems[currentRole];

  const handleSignOut = () => {
    navigate('/');
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 flex flex-col",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Centre Branding */}
      <div className="p-4 border-b border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn(
              "flex items-center gap-3 w-full hover:bg-sidebar-accent rounded-lg p-2 transition-colors",
              sidebarCollapsed && "justify-center"
            )}>
              <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center flex-shrink-0">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div className="text-left flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight">{currentCentre.name}</p>
                  <p className="text-xs text-sidebar-foreground/60">Switch centre</p>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Switch Centre</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {centres.map((centre) => (
              <DropdownMenuItem
                key={centre.id}
                onClick={() => setCurrentCentre(centre)}
                className={cn(centre.id === currentCentre.id && "bg-accent")}
              >
                <Building2 className="mr-2 h-4 w-4" />
                {centre.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/app'}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
              sidebarCollapsed && "justify-center px-2"
            )}
            activeClassName="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Menu */}
      <div className="p-3 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn(
              "flex items-center gap-3 w-full hover:bg-sidebar-accent rounded-lg p-2 transition-colors",
              sidebarCollapsed && "justify-center"
            )}>
              <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center flex-shrink-0">
                <UserIcon className="h-4 w-4" />
              </div>
              {!sidebarCollapsed && (
                <div className="text-left flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{currentUser.name}</p>
                  <RoleBadge role={currentRole} className="mt-0.5" />
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/app/settings')}>
              <UserIcon className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/app/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-md hover:bg-muted"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>
    </aside>
  );
}
