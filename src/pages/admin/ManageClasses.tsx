import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ManageClasses = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [section, setSection] = useState("A");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchClasses = async () => {
    const { data } = await supabase.from("classes").select("*").order("name");
    setClasses(data || []);
  };

  useEffect(() => { fetchClasses(); }, []);

  const addClass = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("classes").insert({ name: name.trim(), section });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Class added! 🎉" });
      setName("");
      fetchClasses();
    }
    setLoading(false);
  };

  const deleteClass = async (id: string) => {
    const { error } = await supabase.from("classes").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      fetchClasses();
    }
  };

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-bold text-foreground mb-6">Manage Classes 🏫</h1>
      
      <div className="school-card p-6 mb-6">
        <h2 className="font-heading text-lg font-bold text-foreground mb-4">Add New Class</h2>
        <div className="flex gap-3 items-end flex-wrap">
          <div>
            <label className="font-heading text-sm font-semibold text-foreground block mb-1">Class Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Play Group, Class 1"
              className="bg-muted/50 border-2 border-border rounded-xl px-4 py-2 text-sm font-body text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="font-heading text-sm font-semibold text-foreground block mb-1">Section</label>
            <input
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="A"
              className="w-20 bg-muted/50 border-2 border-border rounded-xl px-4 py-2 text-sm font-body text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button
            onClick={addClass}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-full font-heading text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Add Class
          </button>
        </div>
      </div>

      <div className="school-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-4 font-heading text-sm font-bold text-foreground">Class Name</th>
              <th className="text-left p-4 font-heading text-sm font-bold text-foreground">Section</th>
              <th className="text-left p-4 font-heading text-sm font-bold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id} className="border-b border-border/50 hover:bg-muted/20">
                <td className="p-4 font-body text-sm text-foreground">{cls.name}</td>
                <td className="p-4 font-body text-sm text-foreground">{cls.section}</td>
                <td className="p-4">
                  <button
                    onClick={() => deleteClass(cls.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {classes.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center font-body text-muted-foreground">
                  No classes added yet. Add your first class above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ManageClasses;
