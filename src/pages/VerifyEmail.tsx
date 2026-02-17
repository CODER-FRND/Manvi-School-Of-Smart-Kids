import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const VerifyEmail = () => {
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has a session (email was verified and they were redirected)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setVerified(true);
      }
      setChecking(false);
    };

    // Listen for auth changes (the redirect from email sets up the session)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setVerified(true);
        setChecking(false);
      }
    });

    checkSession();
    return () => subscription.unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute top-20 left-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md mx-6 text-center"
      >
        <div className="bg-card border-2 border-border rounded-2xl p-10 shadow-lg">
          {verified ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="h-10 w-10 text-accent" />
              </motion.div>

              <h1 className="font-display text-3xl font-bold text-foreground mb-3">
                Email Verified! 🎉
              </h1>
              <p className="font-body text-muted-foreground mb-8">
                Your email has been successfully verified. Welcome to Manvi School of Smart Kids!
              </p>

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 font-heading text-sm font-bold px-8 py-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-all shadow-md"
              >
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="h-10 w-10 text-primary" />
              </div>

              <h1 className="font-display text-3xl font-bold text-foreground mb-3">
                Check Your Email 📧
              </h1>
              <p className="font-body text-muted-foreground mb-8">
                We've sent a verification link to your email. Please click it to verify your account and get started!
              </p>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 font-heading text-sm font-bold px-8 py-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-all shadow-md"
              >
                Back to Login <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
