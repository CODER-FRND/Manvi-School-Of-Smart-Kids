import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Users, ClipboardCheck, BookOpen, DollarSign, GraduationCap } from "lucide-react";

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ students: 0, classes: 0, attendance: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      const [studentsRes, classesRes] = await Promise.all([
        supabase.from("students").select("id", { count: "exact", head: true }),
        supabase.from("classes").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        students: studentsRes.count || 0,
        classes: classesRes.count || 0,
        attendance: 0,
      });
    };
    fetchCounts();
  }, []);

  const stats = [
    { icon: Users, label: "Total Students", value: counts.students, color: "bg-primary/10 text-primary" },
    { icon: GraduationCap, label: "Total Classes", value: counts.classes, color: "bg-secondary/10 text-secondary" },
    { icon: ClipboardCheck, label: "Attendance Today", value: "—", color: "bg-accent/10 text-accent" },
    { icon: DollarSign, label: "Fee Collection", value: "—", color: "bg-school-yellow/20 text-foreground" },
  ];

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-bold text-foreground mb-6">Admin Dashboard 📊</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="school-card p-6">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="font-display text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="font-body text-sm text-muted-foreground">{stat.label}</div>
            </div>
          );
        })}
      </div>
      <div className="school-card p-6">
        <h2 className="font-heading text-xl font-bold text-foreground mb-4">Quick Actions</h2>
        <p className="font-body text-muted-foreground text-sm">
          Use the sidebar to manage students, attendance, marks, fees, homework, and remarks. 
          Start by adding classes and students first.
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
