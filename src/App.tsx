import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Faculty from "./pages/Faculty";
import VerifyEmail from "./pages/VerifyEmail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageClasses from "./pages/admin/ManageClasses";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageAttendance from "./pages/admin/ManageAttendance";
import ManageMarks from "./pages/admin/ManageMarks";
import ManageFees from "./pages/admin/ManageFees";
import ManageHomework from "./pages/admin/ManageHomework";
import ManageRemarks from "./pages/admin/ManageRemarks";
import ManageStaff from "./pages/admin/ManageStaff";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/classes" element={<ManageClasses />} />
          <Route path="/admin/students" element={<ManageStudents />} />
          <Route path="/admin/attendance" element={<ManageAttendance />} />
          <Route path="/admin/marks" element={<ManageMarks />} />
          <Route path="/admin/fees" element={<ManageFees />} />
          <Route path="/admin/homework" element={<ManageHomework />} />
          <Route path="/admin/remarks" element={<ManageRemarks />} />
          <Route path="/admin/staff" element={<ManageStaff />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
