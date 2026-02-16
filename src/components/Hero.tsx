import { motion } from "framer-motion";
import { ChevronDown, Sparkles, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden scanline">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Manvi School of Smart Kids" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
      </div>

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Floating particles */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${i % 3 === 0 ? 'w-2 h-2 bg-primary/30' : i % 3 === 1 ? 'w-1 h-1 bg-secondary/40' : 'w-1.5 h-1.5 bg-accent/30'}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.9, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 rounded-full cyber-border bg-primary/5 backdrop-blur-sm"
        >
          <Sparkles className="h-4 w-4 text-primary animate-pulse-glow" />
          <span className="font-body text-sm text-primary tracking-wider">ADMISSIONS OPEN 2026 — Play Group to 8th Class</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="flex items-center justify-center gap-4 mb-4"
        >
          <GraduationCap className="h-12 w-12 md:h-16 md:w-16 text-primary drop-shadow-[0_0_15px_hsl(185_100%_47%/0.6)]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-black tracking-wider mb-4"
        >
          <span className="text-foreground">MANVI SCHOOL</span>
          <br />
          <span className="text-glow-cyan text-primary">OF SMART KIDS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-heading text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4 tracking-wide"
        >
          Where Smart Minds Meet Smart Learning.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-body text-base text-muted-foreground/70 max-w-xl mx-auto mb-10"
        >
          From Play Group to 8th Class — Building tomorrow's leaders with technology-powered education, creative learning, and a nurturing environment.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/login"
            className="font-heading text-lg tracking-wider uppercase px-10 py-4 bg-gradient-cyber text-primary-foreground hover:opacity-90 transition-all rounded-sm box-glow-cyan font-semibold group relative overflow-hidden"
          >
            <span className="relative z-10">Enroll Now</span>
            <motion.div
              className="absolute inset-0 bg-gradient-neon opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          </Link>
          <a
            href="#programs"
            className="font-heading text-lg tracking-wider uppercase px-10 py-4 cyber-border text-primary hover:bg-primary/10 transition-all rounded-sm backdrop-blur-sm"
          >
            Our Programs
          </a>
          <Link
            to="/faculty"
            className="font-heading text-lg tracking-wider uppercase px-10 py-4 cyber-border-magenta text-secondary hover:bg-secondary/10 transition-all rounded-sm backdrop-blur-sm"
          >
            Meet Faculty
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="h-8 w-8 text-primary/50" />
      </motion.div>
    </section>
  );
};

export default Hero;
