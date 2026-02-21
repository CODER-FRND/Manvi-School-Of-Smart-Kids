import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Users, ClipboardCheck, BookOpen, DollarSign, GraduationCap, Check, X, Clock, AlertCircle } from "lucide-react";

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ students: 0, classes: 0, presentToday: 0, absentToday: 0 });
  const [recentAttendance, setRecentAttendance] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchCounts = async () => {
      const today = new Date().toISOString().split("T")[0];
      const [studentsRes, classesRes, presentRes, absentRes] = await Promise.all([
        supabase.from("students").select("id", { count: "exact", head: true }),
        supabase.from("classes").select("id", { count: "exact", head: true }),
        supabase.from("attendance").select("id", { count: "exact", head: true }).eq("date", today).eq("status", "present"),
        supabase.from("attendance").select("id", { count: "exact", head: true }).eq("date", today).neq("status", "present"),
      ]);
      setCounts({
        students: studentsRes.count || 0,
        classes: classesRes.count || 0,
        presentToday: presentRes.count || 0,
        absentToday: absentRes.count || 0,
      });
    };
    fetchCounts();
    supabase.from("classes").select("*").order("name").then(({ data }) => setClasses(data || []));
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      let query = supabase.from("attendance").select("*, students(name, roll_number, class_id, classes(name, section))").eq("date", date).order("created_at", { ascending: false });
      if (selectedClass) {
        const { data: studs } = await supabase.from("students").select("id").eq("class_id", selectedClass);
        const ids = (studs || []).map(s => s.id);
        if (ids.length > 0) query = query.in("student_id", ids);
        else { setRecentAttendance([]); return; }
      }
      const { data } = await query.limit(100);
      setRecentAttendance(data || []);
    };
    fetchAttendance();
  }, [date, selectedClass]);

  const stats = [
    { icon: Users, label: "Total Students", value: counts.students, color: "bg-primary/10 text-primary" },
    { icon: GraduationCap, label: "Total Classes", value: counts.classes, color: "bg-secondary/10 text-secondary" },
    { icon: Check, label: "Present Today", value: counts.presentToday, color: "bg-accent/10 text-accent" },
    { icon: X, label: "Absent/Late Today", value: counts.absentToday, color: "bg-destructive/10 text-destructive" },
  ];

  const statusIcon = (status: string) => {
    switch (status) {
      case "present": return <Check className="h-3 w-3 text-accent" />;
      case "absent": return <X className="h-3 w-3 text-destructive" />;
      case "late": return <Clock className="h-3 w-3 text-school-yellow" />;
      default: return <AlertCircle className="h-3 w-3 text-secondary" />;
    }
  };

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-bold text-foreground mb-6">Dashboard 📊</h1>
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
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="font-heading text-xl font-bold text-foreground">Attendance Overview</h2>
          <div className="flex gap-3">
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-muted/50 border-2 border-border rounded-xl px-3 py-1.5 text-sm font-body focus:outline-none focus:border-primary">
              <option value="">All Classes</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name} - {c.section}</option>)}
            </select>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="bg-muted/50 border-2 border-border rounded-xl px-3 py-1.5 text-sm font-body focus:outline-none focus:border-primary" />
          </div>
        </div>
        {recentAttendance.length === 0 ? (
          <p className="font-body text-muted-foreground text-sm">No attendance records for this date.</p>
        ) : (
          <div className="divide-y divide-border/50 max-h-96 overflow-y-auto">
            {recentAttendance.map(a => (
              <div key={a.id} className="flex items-center justify-between py-2.5">
                <div>
                  <span className="font-body text-sm font-semibold text-foreground">{a.students?.name}</span>
                  <span className="font-body text-xs text-muted-foreground ml-2">
                    {a.students?.classes?.name} {a.students?.classes?.section}
                  </span>
                </div>
                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-heading font-semibold capitalize ${
                  a.status === "present" ? "bg-accent/10 text-accent" :
                  a.status === "absent" ? "bg-destructive/10 text-destructive" :
                  "bg-secondary/10 text-secondary"
                }`}>
                  {statusIcon(a.status)} {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
