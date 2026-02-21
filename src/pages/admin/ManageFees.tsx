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
  const [form, setForm] = useState({ fee_type: "Tuition", amount: "", due_date: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("classes").select("*").order("name").then(({ data }) => setClasses(data || []));
  }, []);

  const fetchFees = async (classStudents?: any[]) => {
    const studs = classStudents || students;
    const studentIds = studs.map(s => s.id);
    if (studentIds.length > 0) {
      const { data: f } = await supabase.from("fees").select("*, students(name)").in("student_id", studentIds).order("created_at", { ascending: false });
      setFees(f || []);
    } else {
      setFees([]);
    }
  };

  useEffect(() => {
    if (!selectedClass) return;
    const fetch = async () => {
      const { data: studs } = await supabase.from("students").select("*").eq("class_id", selectedClass).order("name");
      setStudents(studs || []);
      await fetchFees(studs || []);
    };
    fetch();
  }, [selectedClass]);

  const addFeeForClass = async () => {
    if (!form.amount || !selectedClass || students.length === 0) return;
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    const records = students.map(s => ({
      student_id: s.id,
      fee_type: form.fee_type,
      amount: parseFloat(form.amount),
      due_date: form.due_date || null,
      created_by: session?.user.id,
    }));

    const { error } = await supabase.from("fees").insert(records);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: `Fee added for all ${students.length} students! 💰` });
      setForm({ fee_type: "Tuition", amount: "", due_date: "" });
      setShowForm(false);
      await fetchFees();
    }
    setLoading(false);
  };

  const togglePaid = async (fee: any) => {
    await supabase.from("fees").update({
      paid: !fee.paid,
      paid_date: !fee.paid ? new Date().toISOString().split("T")[0] : null,
    }).eq("id", fee.id);
    await fetchFees();
  };

  const deleteFee = async (feeId: string) => {
    const { error } = await supabase.from("fees").delete().eq("id", feeId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else await fetchFees();
  };

  // Group fees by fee_type + due_date for display
  const groupedFees: Record<string, any[]> = {};
  fees.forEach(f => {
    const key = `${f.fee_type} | Due: ${f.due_date || "N/A"}`;
    if (!groupedFees[key]) groupedFees[key] = [];
    groupedFees[key].push(f);
  });

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
          <h2 className="font-heading text-lg font-bold mb-4">Add Fee for Entire Class ({students.length} students)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <button onClick={addFeeForClass} disabled={loading}
            className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-full font-heading text-sm font-bold hover:opacity-90 disabled:opacity-50">
            Save for All Students
          </button>
        </div>
      )}

      {Object.keys(groupedFees).length > 0 && (
        <div className="space-y-6">
          {Object.entries(groupedFees).map(([group, items]) => (
            <div key={group} className="school-card overflow-hidden">
              <div className="p-4 bg-muted/30 border-b border-border">
                <h3 className="font-heading text-sm font-bold text-foreground">{group} — ₹{items[0]?.amount}</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/10">
                    <th className="text-left p-3 font-heading text-xs font-bold">Student</th>
                    <th className="text-left p-3 font-heading text-xs font-bold">Status</th>
                    <th className="text-left p-3 font-heading text-xs font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(f => (
                    <tr key={f.id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="p-3 font-body text-sm font-semibold">{f.students?.name}</td>
                      <td className="p-3">
                        <button onClick={() => togglePaid(f)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-heading font-semibold ${
                            f.paid ? "bg-accent/10 text-accent border border-accent/30" : "bg-destructive/10 text-destructive border border-destructive/30"
                          }`}>
                          <CheckCircle className="h-3 w-3" /> {f.paid ? "Paid" : "Unpaid"}
                        </button>
                      </td>
                      <td className="p-3">
                        <button onClick={() => deleteFee(f.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageFees;
