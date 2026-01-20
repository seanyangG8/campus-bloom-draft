import { useApp } from "@/contexts/AppContext";
import { AdminDashboard } from "@/components/dashboards/AdminDashboard";
import { TutorDashboard } from "@/components/dashboards/TutorDashboard";
import { StudentDashboard } from "@/components/dashboards/StudentDashboard";
import { ParentDashboard } from "@/components/dashboards/ParentDashboard";

export function DashboardPage() {
  const { currentRole } = useApp();

  switch (currentRole) {
    case 'admin':
      return <AdminDashboard />;
    case 'tutor':
      return <TutorDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'parent':
      return <ParentDashboard />;
    default:
      return <AdminDashboard />;
  }
}
