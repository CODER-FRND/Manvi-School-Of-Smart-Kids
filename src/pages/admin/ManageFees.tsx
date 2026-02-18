import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Trash2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ManageFees = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ student_id: "", fee_type: "Tuition", amount: "", due_date: "" });
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
      const studentIds = (studs || []).map(s => s.id);
      if (studentIds.length > 0) {
        const { data: f } = await supabase.from("fees").select("*, students(name)").in("student_id", studentIds).order("created_at", { ascending: false });
        setFees(f || []);
      }
    };
    fetch();
  }, [selectedClass]);

  const addFee = async () => {
    if (!form.student_id || !form.amount) return;
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase.from("fees").insert({
      student_id: form.student_id,
      fee_type: form.fee_type,
      amount: parseFloat(form.amount),
      due_date: form.due_date || null,
      created_by: session?.user.id,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Fee record added! 💰" });
      setForm({ student_id: "", fee_type: "Tuition", amount: "", due_date: "" });
      setShowForm(false);
      // Refetch
      const studentIds = students.map(s => s.id);
      const { data: f } = await supabase.from("fees").select("*, students(name)").in("student_id", studentIds).order("created_at", { ascending: false });
      setFees(f || []);
    }
    setLoading(false);
  };

  const togglePaid = async (fee: any) => {
    await supabase.from("fees").update({
      paid: !fee.paid,
      paid_date: !fee.paid ? new Date().toISOString().split("T")[0] : null,
    }).eq("id", fee.id);
    const studentIds = students.map(s => s.id);
    const { data: f } = await supabase.from("fees").select("*, students(name)").in("student_id", studentIds).order("created_at", { ascending: false });
    setFees(f || []);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">Fees 💰</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-full font-heading text-sm font-bold">
          <Plus className="h-4 w-4" /> Add Fee
        </button>
      </div>

      <div className="school-card p-6 mb-6">
        <div className="flex gap-4 items-end flex-wrap">
          <div>
            <label className="font-heading text-sm font-semibold block mb-1">Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-muted/50 border-2 border-border rounded-xl px-4 py-2 text-sm font-body focus:outline-none focus:border-primary">
              <option value="">Select Class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name} - {c.section}</option>)}
            </select>
          </div>
        </div>
      </div>

      {showForm && selectedClass && (
        <div className="school-card p-6 mb-6">
          <h2 className="font-heading text-lg font-bold mb-4">Add Fee Record</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <select value={form.fee_type} onChange={(e) => setForm({ ...form, fee_type: e.target.value })}
                className="w-full bg-muted/50 border-2 border-border rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-primary">
                <option>Tuition</option>
                <option>Transport</option>
                <option>Exam</option>
                <option>Uniform</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="font-heading text-xs font-semibold block mb-1">Amount (₹)</label>
              <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full bg-muted/50 border-2 border-border rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="font-heading text-xs font-semibold block mb-1">Due Date</label>
              <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                className="w-full bg-muted/50 border-2 border-border rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-primary" />
            </div>
          </div>
          <button onClick={addFee} disabled={loading}
            className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-full font-heading text-sm font-bold hover:opacity-90 disabled:opacity-50">
            Save
          </button>
        </div>
      )}

      {fees.length > 0 && (
        <div className="school-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 font-heading text-xs font-bold">Student</th>
                <th className="text-left p-4 font-heading text-xs font-bold">Type</th>
                <th className="text-left p-4 font-heading text-xs font-bold">Amount</th>
                <th className="text-left p-4 font-heading text-xs font-bold">Due</th>
                <th className="text-left p-4 font-heading text-xs font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {fees.map(f => (
                <tr key={f.id} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="p-4 font-body text-sm font-semibold">{f.students?.name}</td>
                  <td className="p-4 font-body text-sm">{f.fee_type}</td>
                  <td className="p-4 font-body text-sm">₹{f.amount}</td>
                  <td className="p-4 font-body text-sm text-muted-foreground">{f.due_date || "—"}</td>
                  <td className="p-4">
                    <button onClick={() => togglePaid(f)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-heading font-semibold ${
                        f.paid ? "bg-accent/10 text-accent border border-accent/30" : "bg-destructive/10 text-destructive border border-destructive/30"
                      }`}>
                      <CheckCircle className="h-3 w-3" /> {f.paid ? "Paid" : "Unpaid"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageFees;
