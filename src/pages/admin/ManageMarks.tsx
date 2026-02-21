import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ManageMarks = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [examType, setExamType] = useState("Unit Test 1");
  const [totalMarks, setTotalMarks] = useState("100");
  const [marksMap, setMarksMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("classes").select("*").order("name").then(({ data }) => setClasses(data || []));
  }, []);

  const fetchSubjects = async () => {
    if (!selectedClass) return;
    const { data } = await supabase.from("subjects").select("*").eq("class_id", selectedClass).order("name");
    setSubjects(data || []);
  };

  useEffect(() => {
    if (!selectedClass) return;
    Promise.all([
      supabase.from("subjects").select("*").eq("class_id", selectedClass).order("name"),
      supabase.from("students").select("*").eq("class_id", selectedClass).order("name"),
    ]).then(([subRes, stuRes]) => {
      setSubjects(subRes.data || []);
      setStudents(stuRes.data || []);
    });
  }, [selectedClass]);

  const addSubject = async () => {
    if (!newSubject.trim() || !selectedClass) return;
    const { error } = await supabase.from("subjects").insert({ name: newSubject.trim(), class_id: selectedClass });
    if (!error) {
      setNewSubject("");
      await fetchSubjects();
      toast({ title: "Subject added!" });
    }
  };

  const deleteSubject = async (subjectId: string) => {
    const { error } = await supabase.from("subjects").delete().eq("id", subjectId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      if (selectedSubject === subjectId) setSelectedSubject("");
      await fetchSubjects();
      toast({ title: "Subject removed" });
    }
  };

  const saveMarks = async () => {
    if (!selectedSubject || !examType) return;
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    const records = Object.entries(marksMap)
      .filter(([_, v]) => v !== "")
      .map(([studentId, obtained]) => ({
        student_id: studentId,
        subject_id: selectedSubject,
        exam_type: examType,
        marks_obtained: parseFloat(obtained),
        total_marks: parseFloat(totalMarks),
        marked_by: session?.user.id,
      }));

    if (records.length === 0) {
      toast({ title: "No marks entered", variant: "destructive" });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("marks").insert(records);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Marks saved! 📝" });
      setMarksMap({});
    }
    setLoading(false);
  };

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-bold text-foreground mb-6">Marks & Grades 📝</h1>

      <div className="school-card p-6 mb-6">
        <div className="flex gap-4 items-end flex-wrap">
          <div>
            <label className="font-heading text-sm font-semibold block mb-1">Class</label>
            <select value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); setSelectedSubject(""); }}
              className="bg-muted/50 border-2 border-border rounded-xl px-4 py-2 text-sm font-body focus:outline-none focus:border-primary">
              <option value="">Select Class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name} - {c.section}</option>)}
            </select>
          </div>
          {selectedClass && (
            <>
              <div>
                <label className="font-heading text-sm font-semibold block mb-1">Subject</label>
                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-muted/50 border-2 border-border rounded-xl px-4 py-2 text-sm font-body focus:outline-none focus:border-primary">
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-heading text-sm font-semibold block mb-1">Exam</label>
                <select value={examType} onChange={(e) => setExamType(e.target.value)}
                  className="bg-muted/50 border-2 border-border rounded-xl px-4 py-2 text-sm font-body focus:outline-none focus:border-primary">
                  <option>Unit Test 1</option>
                  <option>Unit Test 2</option>
                  <option>Half Yearly</option>
                  <option>Annual</option>
                </select>
              </div>
              <div>
                <label className="font-heading text-sm font-semibold block mb-1">Total</label>
                <input type="number" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)}
                  className="w-20 bg-muted/50 border-2 border-border rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-primary" />
              </div>
            </>
          )}
        </div>
        {selectedClass && (
          <div className="mt-4">
            <div className="flex gap-2 items-end mb-3">
              <input type="text" value={newSubject} onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Add new subject..." className="bg-muted/50 border-2 border-border rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-primary" />
              <button onClick={addSubject} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-heading font-bold">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {subjects.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {subjects.map(s => (
                  <span key={s.id} className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-xs font-heading font-semibold text-foreground">
                    {s.name}
                    <button onClick={() => deleteSubject(s.id)} className="text-muted-foreground hover:text-destructive transition-colors ml-1">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedClass && selectedSubject && students.length > 0 && (
        <div className="school-card overflow-hidden">
          <div className="divide-y divide-border/50">
            {students.map(s => (
              <div key={s.id} className="flex items-center justify-between p-4 hover:bg-muted/20">
                <div>
                  <div className="font-body text-sm font-semibold text-foreground">{s.name}</div>
                  <div className="font-body text-xs text-muted-foreground">Roll: {s.roll_number || "—"}</div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={marksMap[s.id] || ""}
                    onChange={(e) => setMarksMap({ ...marksMap, [s.id]: e.target.value })}
                    placeholder="0"
                    className="w-20 bg-muted/50 border-2 border-border rounded-xl px-3 py-1.5 text-sm font-body text-center focus:outline-none focus:border-primary"
                  />
                  <span className="text-xs text-muted-foreground font-body">/ {totalMarks}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border bg-muted/30">
            <button onClick={saveMarks} disabled={loading}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-heading text-sm font-bold hover:opacity-90 disabled:opacity-50">
              Save Marks
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageMarks;
