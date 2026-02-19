import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Shield, UserPlus } from "lucide-react";

interface StaffMember {
  id: string;
  user_id: string;
  role: "admin" | "teacher";
  email?: string;
}

const ManageStaff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "teacher">("teacher");
  const { toast } = useToast();

  const fetchStaff = async () => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("id, user_id, role")
      .in("role", ["admin", "teacher"]);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    setStaff((data || []) as StaffMember[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setAdding(true);

    try {
      // Use edge function to look up user by email and assign role
      const { data, error } = await supabase.functions.invoke("manage-staff", {
        body: { action: "add", email: email.trim(), role },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({ title: "Staff added! 🎉", description: `${email} added as ${role}.` });
      setEmail("");
      fetchStaff();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveStaff = async (roleId: string, userId: string) => {
    // Prevent removing yourself
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user.id === userId) {
      toast({ title: "Cannot remove yourself", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase.from("user_roles").delete().eq("id", roleId);
      if (error) throw error;
      toast({ title: "Staff removed" });
      fetchStaff();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-bold text-foreground mb-6">Manage Staff 👥</h1>

      {/* Add Staff Form */}
      <div className="school-card p-6 mb-6">
        <h2 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <UserPlus className="h-5 w-5" /> Add Staff Member
        </h2>
        <p className="font-body text-sm text-muted-foreground mb-4">
          The staff member must first create an account (sign up) on the login page. Then enter their email below to assign them a role.
        </p>
        <form onSubmit={handleAddStaff} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="staff@manvischool.com"
            required
            className="flex-1 bg-muted/50 border-2 border-border rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "teacher")}
            className="bg-muted/50 border-2 border-border rounded-xl px-4 py-3 text-sm font-body text-foreground focus:outline-none focus:border-primary transition-colors"
          >
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            disabled={adding}
            className="font-heading text-sm font-bold px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add Staff
          </button>
        </form>
      </div>

      {/* Staff List */}
      <div className="school-card p-6">
        <h2 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" /> Current Staff
        </h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : staff.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground">No staff members found.</p>
        ) : (
          <div className="space-y-2">
            {staff.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border"
              >
                <div>
                  <div className="font-heading text-sm font-semibold text-foreground">
                    {member.user_id.slice(0, 8)}...
                  </div>
                  <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                    member.role === "admin"
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary/10 text-secondary"
                  }`}>
                    {member.role}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveStaff(member.id, member.user_id)}
                  className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageStaff;
