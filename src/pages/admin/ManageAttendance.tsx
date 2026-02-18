import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Check, X, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ManageAttendance = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [existing, setExisting] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("classes").select("*").order("name").then(({ data }) => setClasses(data || []));
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    const fetchData = async () => {
      const { data: studs } = await supabase.from("students").select("*").eq("class_id", selectedClass).order("name");
      setStudents(studs || []);

      const { data: att } = await supabase.from("attendance").select("*")
        .in("student_id", (studs || []).map(s => s.id))
        .eq("date", date);

      const map: Record<string, string> = {};
      (att || []).forEach(a => { map[a.student_id] = a.status; });
      setAttendance(map);
      setExisting(att || []);
    };
    fetchData();
  }, [selectedClass, date]);

  const toggleStatus = (studentId: string) => {
    const statuses = ["present", "absent", "late", "half-day"];
    const current = attendance[studentId] || "present";
    const next = statuses[(statuses.indexOf(current) + 1) % statuses.length];
    setAttendance({ ...attendance, [studentId]: next });
  };

  const saveAttendance = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const records = students.map(s => ({
      student_id: s.id,
      date,
      status: attendance[s.id] || "present",
      marked_by: session?.user.id,
    }));

    // Delete existing then insert
    if (existing.length > 0) {
      await supabase.from("attendance").delete().in("id", existing.map(e => e.id));
    }

    const { error } = await supabase.from("attendance").insert(records);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Attendance saved! ✅" });
    }
    setLoading(false);
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "present": return <Check className="h-4 w-4 text-accent" />;
      case "absent": return <X className="h-4 w-4 text-destructive" />;
      case "late": return <Clock className="h-4 w-4 text-school-yellow" />;
      case "half-day": return <AlertCircle className="h-4 w-4 text-secondary" />;
      default: return <Check className="h-4 w-4 text-accent" />;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "present": return "bg-accent/10 border-accent/30 text-accent";
      case "absent": return "bg-destructive/10 border-destructive/30 text-destructive";
      case "late": return "bg-school-yellow/20 border-school-yellow/30 text-foreground";
      case "half-day": return "bg-secondary/10 border-secondary/30 text-secondary";
      default: return "bg-accent/10 border-accent/30 text-accent";
    }
  };

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-bold text-foreground mb-6">Attendance 📋</h1>

      <div className="school-card p-6 mb-6">
        <div className="flex gap-4 items-end flex-wrap">
          <div>
            <label className="font-heading text-sm font-semibold text-foreground block mb-1">Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-muted/50 border-2 border-border rounded-xl px-4 py-2 text-sm font-body focus:outline-none focus:border-primary">
              <option value="">Select Class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name} - {c.section}</option>)}
            </select>
          </div>
          <div>
            <label className="font-heading text-sm font-semibold text-foreground block mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="bg-muted/50 border-2 border-border rounded-xl px-4 py-2 text-sm font-body focus:outline-none focus:border-primary" />
          </div>
          {students.length > 0 && (
            <button onClick={saveAttendance} disabled={loading}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-heading text-sm font-bold hover:opacity-90 disabled:opacity-50">
              Save Attendance
            </button>
          )}
        </div>
      </div>

      {students.length > 0 && (
        <div className="school-card overflow-hidden">
          <div className="p-4 bg-muted/30 border-b border-border flex gap-4 text-xs font-heading font-semibold">
            <span className="flex items-center gap-1"><Check className="h-3 w-3 text-accent" /> Present</span>
            <span className="flex items-center gap-1"><X className="h-3 w-3 text-destructive" /> Absent</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-school-yellow" /> Late</span>
            <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3 text-secondary" /> Half-day</span>
            <span className="text-muted-foreground ml-2">Click to toggle status</span>
          </div>
          <div className="divide-y divide-border/50">
            {students.map(s => {
              const status = attendance[s.id] || "present";
              return (
                <div key={s.id} className="flex items-center justify-between p-4 hover:bg-muted/20">
                  <div>
                    <div className="font-body text-sm font-semibold text-foreground">{s.name}</div>
                    <div className="font-body text-xs text-muted-foreground">Roll: {s.roll_number || "—"}</div>
                  </div>
                  <button
                    onClick={() => toggleStatus(s.id)}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 text-sm font-heading font-semibold capitalize ${statusColor(status)}`}
                  >
                    {statusIcon(status)} {status}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedClass && students.length === 0 && (
        <div className="school-card p-8 text-center">
          <p className="font-body text-muted-foreground">No students in this class yet.</p>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageAttendance;
