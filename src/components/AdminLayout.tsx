import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Users, ClipboardCheck, BookOpen, DollarSign, FileText, MessageSquare, LogOut, Home, Settings, User, UserPlus } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const sidebarItems = [
  { icon: Home, label: "Overview", path: "/admin" },
  { icon: Users, label: "Students", path: "/admin/students" },
  { icon: ClipboardCheck, label: "Attendance", path: "/admin/attendance" },
  { icon: BookOpen, label: "Marks", path: "/admin/marks" },
  { icon: DollarSign, label: "Fees", path: "/admin/fees" },
  { icon: FileText, label: "Homework", path: "/admin/homework" },
  { icon: MessageSquare, label: "Remarks", path: "/admin/remarks" },
  { icon: Settings, label: "Classes", path: "/admin/classes" },
  { icon: UserPlus, label: "Staff", path: "/admin/staff" },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUser(session.user);

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      if (roles && roles.length > 0) {
        const userRole = roles[0].role;
        setRole(userRole);
        if (userRole !== "admin" && userRole !== "teacher") {
          navigate("/dashboard");
        }
      } else {
        navigate("/dashboard");
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="font-display text-primary animate-pulse text-2xl">Loading...</div>
      </div>
    );
  }

  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Admin";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border min-h-screen fixed left-0 top-0 z-40 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <div className="font-display text-sm font-bold text-foreground">Manvi Admin</div>
              <div className="text-[10px] font-body text-muted-foreground capitalize">{role} Panel</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-heading font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
              <User className="h-4 w-4 text-secondary" />
            </div>
            <span className="font-body text-xs text-foreground truncate">{displayName}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-heading text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all w-full"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
