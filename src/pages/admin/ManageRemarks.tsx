import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Trash2, Star, AlertTriangle, MessageSquare, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const typeIcons: Record<string, any> = {
  general: MessageSquare,
  positive: Star,
  concern: AlertTriangle,
  achievement: Award,
};

const typeColors: Record<string, string> = {
  general: "bg-muted text-foreground",
  positive: "bg-accent/10 text-accent",
  concern: "bg-destructive/10 text-destructive",
  achievement: "bg-primary/10 text-primary",
};

const ManageRemarks = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [remarks, setRemarks] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [form, setForm] = useState({ student_id: "", remark: "", type: "general" });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("classes").select("*").order("name").then(({ data }) => setClasses(data || []));
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    const fetch = async () => {
      const { data: studs } = await supabase.from("students").select("*").eq("class_id", selectedClass).order("name");
      setStudents(studs || []);
      const ids = (studs || []).map(s => s.id);
      if (ids.length > 0) {
        const { data: rem } = await supabase.from("remarks").select("*, students(name)").in("student_id", ids).order("created_at", { ascending: false });
        setRemarks(rem || []);
      }
    };
    fetch();
  }, [selectedClass]);

  const addRemark = async () => {
    if (!form.student_id || !form.remark.trim()) return;
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase.from("remarks").insert({
      student_id: form.student_id,
      remark: form.remark.trim(),
      type: form.type,
      created_by: session?.user.id,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Remark added! 📝" });
      setForm({ student_id: "", remark: "", type: "general" });
      setShowForm(false);
      const ids = students.map(s => s.id);
      const { data: rem } = await supabase.from("remarks").select("*, students(name)").in("student_id", ids).order("created_at", { ascending: false });
      setRemarks(rem || []);
    }
    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">Remarks 💬</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-full font-heading text-sm font-bold">
          <Plus className="h-4 w-4" /> Add Remark
        </button>
      </div>

      <div className="school-card p-6 mb-6">
        <label className="font-heading text-sm font-semibold block mb-1">Class</label>
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
          className="bg-muted/50 border-2 border-border rounded-xl px-4 py-2 text-sm font-body focus:outline-none focus:border-primary">
          <option value="">Select Class</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name} - {c.section}</option>)}
        </select>
      </div>

      {showForm && selectedClass && (
        <div className="school-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-heading text-xs font-semibold block mb-1">Student</label>
              <select value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })}
                className="w-full bg-muted/50 border-2 border-border rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-primary">
                <option value="">Select</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="font-heading text-xs font-semibold block mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-muted/50 border-2 border-border rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-primary">
                <option value="general">General</option>
                <option value="positive">Positive</option>
                <option value="concern">Concern</option>
                <option value="achievement">Achievement</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="font-heading text-xs font-semibold block mb-1">Remark</label>
              <textarea value={form.remark} onChange={(e) => setForm({ ...form, remark: e.target.value })}
                rows={3} className="w-full bg-muted/50 border-2 border-border rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-primary resize-none" placeholder="Write remark..." />
            </div>
          </div>
          <button onClick={addRemark} disabled={loading}
            className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-full font-heading text-sm font-bold hover:opacity-90 disabled:opacity-50">
            Save Remark
          </button>
        </div>
      )}

      {remarks.length > 0 && (
        <div className="space-y-3">
          {remarks.map(r => {
            const Icon = typeIcons[r.type] || MessageSquare;
            return (
              <div key={r.id} className="school-card p-5 flex gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[r.type]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-sm font-bold text-foreground">{r.students?.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${typeColors[r.type]}`}>{r.type}</span>
                  </div>
                  <p className="font-body text-sm text-muted-foreground mt-1">{r.remark}</p>
                  <span className="font-body text-xs text-muted-foreground mt-1 block">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageRemarks;
