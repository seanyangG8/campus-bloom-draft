import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole, Centre, User, demoCentres, demoUsers } from '@/lib/demo-data';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: User;
  currentCentre: Centre;
  setCurrentCentre: (centre: Centre) => void;
  centres: Centre[];
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [currentCentre, setCurrentCentre] = useState<Centre>(demoCentres[0]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const currentUser = demoUsers[currentRole];

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
