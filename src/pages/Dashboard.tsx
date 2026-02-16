import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, BookOpen, Calendar, Award, TrendingUp, Bell, GraduationCap, User } from "lucide-react";
import Chatbot from "@/components/Chatbot";

const quickStats = [
  { icon: BookOpen, label: "Subjects Active", value: "6", color: "primary" },
  { icon: Calendar, label: "Upcoming Events", value: "3", color: "secondary" },
  { icon: Award, label: "Achievements", value: "12", color: "accent" },
  { icon: TrendingUp, label: "Attendance", value: "96%", color: "primary" },
];

const notifications = [
  { text: "Homework: Complete Math worksheet by Feb 20", time: "2h ago" },
  { text: "Science Fair project submission deadline extended", time: "5h ago" },
  { text: "Annual Day rehearsal schedule posted", time: "1d ago" },
  { text: "New books added to the school library", time: "2d ago" },
];

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/login");
      else setUser(session.user);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/login");
      else setUser(session.user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="font-display text-primary animate-pulse-glow text-2xl">LOADING...</div>
      </div>
    );
  }

  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Student";

  return (
    <div className="min-h-screen bg-background scanline">
      <div className="border-b border-border/30 bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold tracking-widest text-foreground">
              MANVI<span className="text-primary"> SMART</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span className="font-heading text-sm text-foreground hidden sm:block">{displayName}</span>
            </div>
            <button onClick={handleLogout} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Welcome back, <span className="text-primary text-glow-cyan">{displayName}</span>
          </h1>
          <p className="font-body text-muted-foreground mt-2">Here's what's happening at Manvi School today.</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03, y: -3 }}
                className="bg-gradient-card cyber-border rounded-sm p-6 group hover:border-primary/50 transition-all"
              >
                <Icon className={`h-6 w-6 mb-3 ${
                  stat.color === "primary" ? "text-primary" :
                  stat.color === "secondary" ? "text-secondary" : "text-accent"
                }`} />
                <div className="font-display text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="font-body text-xs text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-card cyber-border rounded-sm p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-secondary" />
            <h2 className="font-heading text-xl font-bold text-foreground tracking-wider">NOTIFICATIONS</h2>
          </div>
          <div className="space-y-3">
            {notifications.map((notif, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ x: 5 }}
                className="flex items-start justify-between p-3 bg-muted/30 rounded-sm hover:bg-muted/50 transition-all cursor-pointer"
              >
                <p className="font-body text-sm text-foreground">{notif.text}</p>
                <span className="font-body text-xs text-muted-foreground whitespace-nowrap ml-4">{notif.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <Chatbot />
    </div>
  );
};

export default Dashboard;
