import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, BookOpen, Calendar, Award, GraduationCap, CheckCircle, XCircle, DollarSign, MessageSquare } from "lucide-react";
import Chatbot from "@/components/Chatbot";

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("attendance");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem("parent_session");
    if (!stored) {
      navigate("/login");
      return;
    }
    try {
      setData(JSON.parse(stored));
    } catch {
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("parent_session");
    navigate("/login");
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="font-display text-primary animate-pulse text-2xl">Loading...</div>
      </div>
    );
  }

  const student = data.student;
  const { attendance, fees, marks, remarks, homework } = data;

  const tabs = [
    { id: "attendance", label: "Attendance", icon: Calendar },
    { id: "fees", label: "Fees", icon: DollarSign },
    { id: "marks", label: "Marks", icon: Award },
    { id: "homework", label: "Homework", icon: BookOpen },
    { id: "remarks", label: "Remarks", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">
              Manvi <span className="text-primary">Smart</span>
            </span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-destructive transition-colors font-heading text-sm">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Welcome, <span className="text-primary">Parent</span> 👋
          </h1>
          <p className="font-body text-muted-foreground mt-2">
            Viewing data for {student?.name}
          </p>
        </motion.div>

        {/* Student Info Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="school-card p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground">{student?.name}</h3>
              <p className="font-body text-sm text-muted-foreground">
                {student?.classes?.name} {student?.classes?.section ? `- ${student?.classes?.section}` : ""} | Roll: {student?.roll_number || "N/A"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-heading text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}>
                <Icon className="h-4 w-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="school-card p-6">
          {activeTab === "attendance" && (
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-4">Recent Attendance</h3>
              {attendance.length === 0 ? (
                <p className="text-muted-foreground font-body text-sm">No attendance records yet.</p>
              ) : (
                <div className="space-y-2">
                  {attendance.map((a: any) => (
                    <div key={a.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                      <span className="font-body text-sm text-foreground">{a.date}</span>
                      <span className={`flex items-center gap-1 font-heading text-sm font-semibold ${a.status === "present" ? "text-green-600" : "text-destructive"}`}>
                        {a.status === "present" ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "fees" && (
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-4">Fee Records</h3>
              {fees.length === 0 ? (
                <p className="text-muted-foreground font-body text-sm">No fee records.</p>
              ) : (
                <div className="space-y-2">
                  {fees.map((f: any) => (
                    <div key={f.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                      <div>
                        <span className="font-heading text-sm font-semibold text-foreground">{f.fee_type}</span>
                        <span className="font-body text-xs text-muted-foreground ml-2">Due: {f.due_date || "N/A"}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-heading text-sm font-bold text-foreground">₹{f.amount}</span>
                        <span className={`ml-2 text-xs font-semibold ${f.paid ? "text-green-600" : "text-destructive"}`}>
                          {f.paid ? "Paid" : "Unpaid"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "marks" && (
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-4">Marks</h3>
              {marks.length === 0 ? (
                <p className="text-muted-foreground font-body text-sm">No marks recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {marks.map((m: any) => (
                    <div key={m.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                      <div>
                        <span className="font-heading text-sm font-semibold text-foreground">{m.subjects?.name || "Subject"}</span>
                        <span className="font-body text-xs text-muted-foreground ml-2">{m.exam_type}</span>
                      </div>
                      <span className="font-heading text-sm font-bold text-foreground">{m.marks_obtained}/{m.total_marks}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "homework" && (
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-4">Homework</h3>
              {homework.length === 0 ? (
                <p className="text-muted-foreground font-body text-sm">No homework assigned.</p>
              ) : (
                <div className="space-y-2">
                  {homework.map((h: any) => (
                    <div key={h.id} className="p-3 bg-muted/50 rounded-xl">
                      <div className="flex justify-between">
                        <span className="font-heading text-sm font-semibold text-foreground">{h.title}</span>
                        <span className="font-body text-xs text-muted-foreground">Due: {h.due_date || "N/A"}</span>
                      </div>
                      {h.description && <p className="font-body text-xs text-muted-foreground mt-1">{h.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "remarks" && (
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-4">Remarks</h3>
              {remarks.length === 0 ? (
                <p className="text-muted-foreground font-body text-sm">No remarks yet.</p>
              ) : (
                <div className="space-y-2">
                  {remarks.map((r: any) => (
                    <div key={r.id} className="p-3 bg-muted/50 rounded-xl">
                      <div className="flex justify-between">
                        <span className={`font-heading text-xs font-semibold px-2 py-0.5 rounded-full ${r.type === "positive" ? "bg-green-100 text-green-700" : r.type === "negative" ? "bg-red-100 text-red-700" : "bg-muted text-muted-foreground"}`}>
                          {r.type}
                        </span>
                        <span className="font-body text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="font-body text-sm text-foreground mt-2">{r.remark}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      <Chatbot />
    </div>
  );
};

export default Dashboard;
