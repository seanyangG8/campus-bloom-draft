import { ReactNode } from "react";
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <AppHeader />
      <main
        className={cn(
          "pt-14 min-h-screen transition-all duration-200",
          sidebarCollapsed ? "pl-16" : "pl-60"
        )}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
