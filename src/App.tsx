import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { LandingPage } from "@/pages/Landing";
import { SignInPage } from "@/pages/auth/SignIn";
import { DashboardPage } from "@/pages/app/Dashboard";
import { CoursesPage } from "@/pages/app/Courses";
import { CourseDetailPage } from "@/pages/app/CourseDetail";
import { StudentsPage } from "@/pages/app/Students";
import { StudentProfilePage } from "@/pages/app/StudentProfile";
import { MessagesPage } from "@/pages/app/Messages";
import { InvoicesPage } from "@/pages/app/Invoices";
import { InvoiceDetailPage } from "@/pages/app/InvoiceDetail";
import { TimetablePage } from "@/pages/app/Timetable";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/signin" element={<SignInPage />} />
      <Route path="/app" element={<AppLayout><DashboardPage /></AppLayout>} />
      <Route path="/app/courses" element={<AppLayout><CoursesPage /></AppLayout>} />
      <Route path="/app/courses/:courseId" element={<AppLayout><CourseDetailPage /></AppLayout>} />
      <Route path="/app/students" element={<AppLayout><StudentsPage /></AppLayout>} />
      <Route path="/app/students/:studentId" element={<AppLayout><StudentProfilePage /></AppLayout>} />
      <Route path="/app/messages" element={<AppLayout><MessagesPage /></AppLayout>} />
      <Route path="/app/invoices" element={<AppLayout><InvoicesPage /></AppLayout>} />
      <Route path="/app/invoices/:invoiceId" element={<AppLayout><InvoiceDetailPage /></AppLayout>} />
      <Route path="/app/timetable" element={<AppLayout><TimetablePage /></AppLayout>} />
      <Route path="/app/*" element={<AppLayout><DashboardPage /></AppLayout>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
