import { motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden scanline">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Futuristic school" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
      </div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full cyber-border bg-primary/5"
        >
          <Sparkles className="h-4 w-4 text-primary animate-pulse-glow" />
          <span className="font-body text-sm text-primary tracking-wider">ADMISSIONS OPEN 2026</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-wider mb-6"
        >
          <span className="text-foreground">THE FUTURE</span>
          <br />
          <span className="text-glow-cyan text-primary">STARTS HERE</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-heading text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 tracking-wide"
        >
          Where cutting-edge technology meets world-class education.
          Welcome to the next generation of learning.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/login"
            className="font-heading text-lg tracking-wider uppercase px-10 py-4 bg-gradient-cyber text-primary-foreground hover:opacity-90 transition-all rounded-sm box-glow-cyan font-semibold"
          >
            Get Started
          </Link>
          <a
            href="#programs"
            className="font-heading text-lg tracking-wider uppercase px-10 py-4 cyber-border text-primary hover:bg-primary/10 transition-all rounded-sm"
          >
            Explore Programs
          </a>
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
