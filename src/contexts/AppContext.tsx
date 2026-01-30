import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserRole, Centre, User, demoCentres, demoUsers, CentreTheme, centreThemes } from '@/lib/demo-data';
import { applyTheme, loadSavedTheme } from '@/lib/theme-utils';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: User;
  currentCentre: Centre;
  setCurrentCentre: (centre: Centre) => void;
  centres: Centre[];
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  currentTheme: CentreTheme | null;
  setCurrentTheme: (theme: CentreTheme) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [currentCentre, setCurrentCentre] = useState<Centre>(demoCentres[0]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTheme, setCurrentThemeState] = useState<CentreTheme | null>(null);

  const currentUser = demoUsers[currentRole];

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = loadSavedTheme();
    if (savedTheme) {
      setCurrentThemeState(savedTheme);
    } else {
      // Apply default theme based on centre
      const defaultTheme = centreThemes.find(t => t.id === currentCentre.themeId);
      if (defaultTheme) {
        applyTheme(defaultTheme);
        setCurrentThemeState(defaultTheme);
      }
    }
  }, []);

  const setCurrentTheme = (theme: CentreTheme) => {
    applyTheme(theme);
    setCurrentThemeState(theme);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        currentCentre,
        setCurrentCentre,
        centres: demoCentres,
        sidebarCollapsed,
        setSidebarCollapsed,
        currentTheme,
        setCurrentTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
