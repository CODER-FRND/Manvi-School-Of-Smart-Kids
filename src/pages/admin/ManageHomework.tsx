import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ManageHomework = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [homework, setHomework] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [form, setForm] = useState({ subject_id: "", title: "", description: "", due_date: "" });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("classes").select("*").order("name").then(({ data }) => setClasses(data || []));
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    Promise.all([
      supabase.from("subjects").select("*").eq("class_id", selectedClass).order("name"),
      supabase.from("homework").select("*, subjects(name)").eq("class_id", selectedClass).order("created_at", { ascending: false }),
    ]).then(([subRes, hwRes]) => {
      setSubjects(subRes.data || []);
      setHomework(hwRes.data || []);
    });
  }, [selectedClass]);

  const addHomework = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase.from("homework").insert({
      class_id: selectedClass,
      subject_id: form.subject_id || null,
      title: form.title.trim(),
      description: form.description || null,
      due_date: form.due_date || null,
      assigned_by: session?.user.id,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Homework assigned! 📚" });
      setForm({ subject_id: "", title: "", description: "", due_date: "" });
      setShowForm(false);
      const { data } = await supabase.from("homework").select("*, subjects(name)").eq("class_id", selectedClass).order("created_at", { ascending: false });
      setHomework(data || []);
    }
    setLoading(false);
  };

  const deleteHomework = async (id: string) => {
    await supabase.from("homework").delete().eq("id", id);
    const { data } = await supabase.from("homework").select("*, subjects(name)").eq("class_id", selectedClass).order("created_at", { ascending: false });
    setHomework(data || []);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">Homework 📚</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-full font-heading text-sm font-bold">
          <Plus className="h-4 w-4" /> Assign
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
              <label className="font-heading text-xs font-semibold block mb-1">Title *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-muted/50 border-2 border-border rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-primary" placeholder="Homework title" />
            </div>
            <div>
              <label className="font-heading text-xs font-semibold block mb-1">Subject</label>
              <select value={form.subject_id} onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
                className="w-full bg-muted/50 border-2 border-border rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-primary">
                <option value="">General</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="font-heading text-xs font-semibold block mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3} className="w-full bg-muted/50 border-2 border-border rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-primary resize-none" />
            </div>
            <div>
              <label className="font-heading text-xs font-semibold block mb-1">Due Date</label>
              <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                className="w-full bg-muted/50 border-2 border-border rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-primary" />
            </div>
          </div>
          <button onClick={addHomework} disabled={loading}
            className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-full font-heading text-sm font-bold hover:opacity-90 disabled:opacity-50">
            Assign Homework
          </button>
        </div>
      )}

      {homework.length > 0 && (
        <div className="space-y-3">
          {homework.map(hw => (
            <div key={hw.id} className="school-card p-5 flex justify-between items-start">
              <div>
                <h3 className="font-heading text-base font-bold text-foreground">{hw.title}</h3>
                <div className="flex gap-3 mt-1">
                  {hw.subjects?.name && <span className="text-xs font-body bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">{hw.subjects.name}</span>}
                  {hw.due_date && <span className="text-xs font-body text-muted-foreground">Due: {hw.due_date}</span>}
                </div>
                {hw.description && <p className="font-body text-sm text-muted-foreground mt-2">{hw.description}</p>}
              </div>
              <button onClick={() => deleteHomework(hw.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageHomework;
