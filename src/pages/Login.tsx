import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Eye, EyeOff, ArrowLeft, Loader2, Users, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [loginMode, setLoginMode] = useState<"staff" | "parent">("parent");
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Parent login fields
  const [studentName, setStudentName] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/verify-email`,
            data: { display_name: name },
          },
        });
        if (error) throw error;
        toast({
          title: "Account created! 🎉",
          description: "Check your email to verify your account.",
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id);

        const userRole = roles?.[0]?.role;
        if (userRole === "admin" || userRole === "teacher") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleParentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !phone.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parent-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
          body: JSON.stringify({ student_name: studentName.trim(), phone: phone.trim() }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Store parent session data in sessionStorage
      sessionStorage.setItem("parent_session", JSON.stringify(data));
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md mx-6"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-body text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="bg-card border-2 border-border rounded-2xl p-8 shadow-lg">
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setLoginMode("staff"); setIsSignUp(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-heading text-sm font-semibold transition-all ${
                loginMode === "staff" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <ShieldCheck className="h-4 w-4" /> Staff Login
            </button>
            <button
              onClick={() => setLoginMode("parent")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-heading text-sm font-semibold transition-all ${
                loginMode === "parent" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Users className="h-4 w-4" /> Parent Login
            </button>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                {loginMode === "parent"
                  ? "Parent Portal 👨‍👩‍👧"
                  : isSignUp ? "Join Manvi 🌟" : "Staff Portal 📚"}
              </h1>
              <p className="font-body text-xs text-muted-foreground">
                {loginMode === "parent"
                  ? "Enter your child's name & registered phone"
                  : isSignUp ? "Create your staff account" : "Manvi School of Smart Kids"}
              </p>
            </div>
          </div>

          {loginMode === "parent" ? (
            <form onSubmit={handleParentLogin} className="space-y-5">
              <div>
                <label className="font-heading text-sm font-semibold text-foreground block mb-2">
                  Student's Full Name
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                  className="w-full bg-muted/50 border-2 border-border rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter student's full name"
                />
              </div>
              <div>
                <label className="font-heading text-sm font-semibold text-foreground block mb-2">
                  Registered Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-muted/50 border-2 border-border rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="Phone number added by school"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full font-heading text-sm font-bold py-3 bg-primary text-primary-foreground hover:opacity-90 transition-all rounded-full shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                View My Child's Details
              </button>
            </form>
          ) : (
            <>
              <form onSubmit={handleStaffSubmit} className="space-y-5">
                {isSignUp && (
                  <div>
                    <label className="font-heading text-sm font-semibold text-foreground block mb-2">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                      className="w-full bg-muted/50 border-2 border-border rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      placeholder="Enter your name" />
                  </div>
                )}
                <div>
                  <label className="font-heading text-sm font-semibold text-foreground block mb-2">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="w-full bg-muted/50 border-2 border-border rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="staff@manvischool.com" />
                </div>
                <div>
                  <label className="font-heading text-sm font-semibold text-foreground block mb-2">Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                      className="w-full bg-muted/50 border-2 border-border rounded-xl px-4 py-3 pr-12 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full font-heading text-sm font-bold py-3 bg-primary text-primary-foreground hover:opacity-90 transition-all rounded-full shadow-md flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSignUp ? "Create Account ✨" : "Sign In"}
                </button>
              </form>
              <div className="h-px bg-border mt-6 mb-4" />
              <p className="text-center font-body text-sm text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline font-semibold">
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
