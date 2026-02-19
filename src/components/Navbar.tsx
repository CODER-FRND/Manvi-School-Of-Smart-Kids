import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, GraduationCap, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Programs", path: "/#programs" },
  { label: "Faculty", path: "/faculty" },
  { label: "Events", path: "/#events" },
  { label: "About", path: "/#about" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id);
        const role = roles?.[0]?.role;
        setIsAdmin(role === "admin" || role === "teacher");
      }
    };
    checkRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (!session) setIsAdmin(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-card/95 backdrop-blur-xl shadow-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold text-foreground leading-tight">
              Manvi <span className="text-primary">Smart</span>
            </span>
            <span className="text-[10px] font-body text-muted-foreground leading-tight">School of Smart Kids</span>
          </div>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="font-heading text-sm font-semibold text-muted-foreground hover:text-primary transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary rounded-full transition-all group-hover:w-full" />
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="font-heading text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors flex items-center gap-1"
            >
              <Shield className="h-4 w-4" /> Admin Panel
            </Link>
          )}
          <Link
            to={isLoggedIn ? "/dashboard" : "/login"}
            className="font-heading text-sm font-bold px-6 py-2.5 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-all shadow-md"
          >
            {isLoggedIn ? "Dashboard" : "Student Login"}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card/98 backdrop-blur-xl border-b border-border"
          >
            <div className="flex flex-col gap-4 p-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className="font-heading text-lg font-semibold text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="font-heading text-lg font-semibold text-secondary flex items-center gap-2"
                >
                  <Shield className="h-5 w-5" /> Admin Panel
                </Link>
              )}
              <Link
                to={isLoggedIn ? "/dashboard" : "/login"}
                onClick={() => setMobileOpen(false)}
                className="font-heading text-lg font-bold text-primary"
              >
                {isLoggedIn ? "Dashboard" : "Student Login"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
