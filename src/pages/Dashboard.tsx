import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, BookOpen, Calendar, Award, TrendingUp, Bell, GraduationCap, User, Search, CheckCircle, XCircle, DollarSign, FileText, MessageSquare } from "lucide-react";
import Chatbot from "@/components/Chatbot";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [studentLinked, setStudentLinked] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [attendance, setAttendance] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  const [remarks, setRemarks] = useState<any[]>([]);
  const [homework, setHomework] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("attendance");
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/login");
      else setUser(session.user);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/login");
      else {
        setUser(session.user);
        checkLinkedStudent(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    supabase.from("classes").select("id, name, section").then(({ data }) => {
      if (data) setClasses(data);
    });
  }, []);

  const checkLinkedStudent = async (userId: string) => {
    const { data } = await supabase
      .from("students")
      .select("*, classes(name, section)")
      .eq("parent_user_id", userId)
      .limit(1);
    if (data && data.length > 0) {
      setStudent(data[0]);
      setStudentLinked(true);
      loadStudentData(data[0].id, data[0].class_id);
    }
  };

  const loadStudentData = async (studentId: string, classId: string | null) => {
    const [attRes, feeRes, markRes, remRes, hwRes] = await Promise.all([
      supabase.from("attendance").select("*").eq("student_id", studentId).order("date", { ascending: false }).limit(30),
      supabase.from("fees").select("*").eq("student_id", studentId).order("due_date", { ascending: false }),
      supabase.from("marks").select("*, subjects(name)").eq("student_id", studentId),
      supabase.from("remarks").select("*").eq("student_id", studentId).order("created_at", { ascending: false }),
      classId ? supabase.from("homework").select("*, subjects(name)").eq("class_id", classId).order("due_date", { ascending: false }) : Promise.resolve({ data: [] }),
    ]);
    setAttendance(attRes.data || []);
    setFees(feeRes.data || []);
    setMarks(markRes.data || []);
    setRemarks(remRes.data || []);
    setHomework(hwRes.data || []);
  };

  const handleLinkStudent = async () => {
    if (!selectedClassId || !studentName.trim()) return;
    setSearching(true);
    setSearchError("");

    const { data, error } = await supabase
      .from("students")
      .select("*, classes(name, section)")
      .eq("class_id", selectedClassId)
      .ilike("name", `%${studentName.trim()}%`)
      .limit(1);

    if (error || !data || data.length === 0) {
      setSearchError("Student not found. Please check the name and class.");
      setSearching(false);
      return;
    }

    // Link parent_user_id
    const { error: updateErr } = await supabase
      .from("students")
      .update({ parent_user_id: user.id })
      .eq("id", data[0].id);

    if (updateErr) {
      setSearchError("Could not link student. Contact admin.");
      setSearching(false);
      return;
    }

    setStudent(data[0]);
    setStudentLinked(true);
    loadStudentData(data[0].id, data[0].class_id);
    setSearching(false);
  };

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

  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Parent";

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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                <User className="h-4 w-4 text-secondary" />
              </div>
              <span className="font-heading text-sm text-foreground font-semibold hidden sm:block">{displayName}</span>
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
            Welcome, <span className="text-primary">{displayName}</span> 👋
          </h1>
          <p className="font-body text-muted-foreground mt-2">
            {studentLinked ? `Viewing data for ${student?.name}` : "Link your child's profile to get started."}
          </p>
        </motion.div>

        {/* Student Linking Form */}
        {!studentLinked && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="school-card p-6 mb-8 max-w-lg">
            <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" /> Find Your Child
            </h2>
            <div className="space-y-4">
              <div>
                <label className="font-heading text-sm font-semibold text-foreground block mb-2">Class</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full bg-muted/50 border-2 border-border rounded-xl px-4 py-3 text-sm font-body text-foreground focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">Select class...</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} {c.section ? `- ${c.section}` : ""}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-heading text-sm font-semibold text-foreground block mb-2">Student Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your child's name"
                  className="w-full bg-muted/50 border-2 border-border rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              {searchError && <p className="text-destructive text-sm font-body">{searchError}</p>}
              <button
                onClick={handleLinkStudent}
                disabled={searching || !selectedClassId || !studentName.trim()}
                className="w-full font-heading text-sm font-bold py-3 bg-primary text-primary-foreground hover:opacity-90 transition-all rounded-full shadow-md disabled:opacity-50"
              >
                {searching ? "Searching..." : "Link Student"}
              </button>
            </div>
          </motion.div>
        )}

        {/* Student Data Tabs */}
        {studentLinked && (
          <>
            {/* Student Info Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="school-card p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">{student?.name}</h3>
                  <p className="font-body text-sm text-muted-foreground">
                    {(student?.classes as any)?.name} {(student?.classes as any)?.section ? `- ${(student?.classes as any)?.section}` : ""} | Roll: {student?.roll_number || "N/A"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-heading text-sm font-semibold whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
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
                      {attendance.map((a) => (
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
                      {fees.map((f) => (
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
                      {marks.map((m) => (
                        <div key={m.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                          <div>
                            <span className="font-heading text-sm font-semibold text-foreground">{(m.subjects as any)?.name || "Subject"}</span>
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
                      {homework.map((h) => (
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
                      {remarks.map((r) => (
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
          </>
        )}
      </div>

      <Chatbot />
    </div>
  );
};

export default Dashboard;
