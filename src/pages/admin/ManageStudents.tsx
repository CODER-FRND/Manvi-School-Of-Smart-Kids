import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ManageStudents = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "", class_id: "", roll_number: "", date_of_birth: "",
    gender: "", guardian_name: "", phone: "", address: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    const [studentsRes, classesRes] = await Promise.all([
      supabase.from("students").select("*, classes(name, section)").order("name"),
      supabase.from("classes").select("*").order("name"),
    ]);
    setStudents(studentsRes.data || []);
    setClasses(classesRes.data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const addStudent = async () => {
    if (!form.name.trim() || !form.class_id) return;
    setLoading(true);
    const { error } = await supabase.from("students").insert({
      name: form.name.trim(),
      class_id: form.class_id,
      roll_number: form.roll_number || null,
      date_of_birth: form.date_of_birth || null,
      gender: form.gender || null,
      guardian_name: form.guardian_name || null,
      phone: form.phone || null,
      address: form.address || null,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Student added! 🎉" });
      setForm({ name: "", class_id: "", roll_number: "", date_of_birth: "", gender: "", guardian_name: "", phone: "", address: "" });
      setShowForm(false);
      fetchData();
    }
    setLoading(false);
  };

  const deleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (!error) fetchData();
  };

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll_number?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">Students 👨‍🎓</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-full font-heading text-sm font-bold hover:opacity-90 transition-all"
        >
          <Plus className="h-4 w-4" /> Add Student
        </button>
      </div>

      {showForm && (
        <div className="school-card p-6 mb-6">
          <h2 className="font-heading text-lg font-bold text-foreground mb-4">New Student</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="font-heading text-xs font-semibold text-foreground block mb-1">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-muted/50 border-2 border-border rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-primary" placeholder="Student name" />
            </div>
            <div>
              <label className="font-heading text-xs font-semibold text-foreground block mb-1">Class *</label>
              <select value={form.class_id} onChange={(e) => setForm({ ...form, class_id: e.target.value })}
                className="w-full bg-muted/50 border-2 border-border rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-primary">
                <option value="">Select Class</option>
                {classes.map((c) => <option key={c.id} value={c.id}>{c.name} - {c.section}</option>)}
              </select>
            </div>
            <div>
              <label className="font-heading text-xs font-semibold text-foreground block mb-1">Roll Number</label>
              <input type="text" value={form.roll_number} onChange={(e) => setForm({ ...form, roll_number: e.target.value })}
                className="w-full bg-muted/50 border-2 border-border rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-primary" placeholder="001" />
            </div>
            <div>
              <label className="font-heading text-xs font-semibold text-foreground block mb-1">Date of Birth</label>
              <input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                className="w-full bg-muted/50 border-2 border-border rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="font-heading text-xs font-semibold text-foreground block mb-1">Gender</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full bg-muted/50 border-2 border-border rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-primary">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="font-heading text-xs font-semibold text-foreground block mb-1">Guardian Name</label>
              <input type="text" value={form.guardian_name} onChange={(e) => setForm({ ...form, guardian_name: e.target.value })}
                className="w-full bg-muted/50 border-2 border-border rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-primary" placeholder="Parent/Guardian" />
            </div>
            <div>
              <label className="font-heading text-xs font-semibold text-foreground block mb-1">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-muted/50 border-2 border-border rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-primary" placeholder="98XXXXXXXX" />
            </div>
            <div className="md:col-span-2">
              <label className="font-heading text-xs font-semibold text-foreground block mb-1">Address</label>
              <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-muted/50 border-2 border-border rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-primary" placeholder="Address" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={addStudent} disabled={loading}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-heading text-sm font-bold hover:opacity-90 disabled:opacity-50">
              Save Student
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-6 py-2 border-2 border-border rounded-full font-heading text-sm text-muted-foreground hover:text-foreground">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            className="w-full pl-10 bg-muted/50 border-2 border-border rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-primary" />
        </div>
      </div>

      <div className="school-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 font-heading text-xs font-bold text-foreground">Name</th>
                <th className="text-left p-4 font-heading text-xs font-bold text-foreground">Class</th>
                <th className="text-left p-4 font-heading text-xs font-bold text-foreground">Roll No.</th>
                <th className="text-left p-4 font-heading text-xs font-bold text-foreground">Guardian</th>
                <th className="text-left p-4 font-heading text-xs font-bold text-foreground">Phone</th>
                <th className="text-left p-4 font-heading text-xs font-bold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="p-4 font-body text-sm font-semibold text-foreground">{s.name}</td>
                  <td className="p-4 font-body text-sm text-foreground">{s.classes?.name} {s.classes?.section}</td>
                  <td className="p-4 font-body text-sm text-muted-foreground">{s.roll_number || "—"}</td>
                  <td className="p-4 font-body text-sm text-muted-foreground">{s.guardian_name || "—"}</td>
                  <td className="p-4 font-body text-sm text-muted-foreground">{s.phone || "—"}</td>
                  <td className="p-4">
                    <button onClick={() => deleteStudent(s.id)} className="p-1.5 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center font-body text-muted-foreground">No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageStudents;
