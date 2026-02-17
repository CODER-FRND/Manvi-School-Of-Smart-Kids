import { motion } from "framer-motion";
import { ChevronDown, Sparkles, GraduationCap, Star } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Manvi School of Smart Kids" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
      </div>

      {/* Floating decorative elements */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${
            i % 4 === 0 ? 'w-4 h-4 bg-primary/20' :
            i % 4 === 1 ? 'w-3 h-3 bg-secondary/20' :
            i % 4 === 2 ? 'w-5 h-5 bg-accent/15' :
            'w-3 h-3 bg-school-yellow/25'
          }`}
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 rounded-full bg-primary/10 border-2 border-primary/20 backdrop-blur-sm"
        >
          <Sparkles className="h-4 w-4 text-primary animate-pulse-glow" />
          <span className="font-body text-sm font-semibold text-primary">ADMISSIONS OPEN 2026 — Play Group to 8th Class</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="flex items-center justify-center gap-4 mb-4"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <GraduationCap className="h-9 w-9 md:h-12 md:w-12 text-primary-foreground" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
        >
          <span className="text-foreground">Manvi School</span>
          <br />
          <span className="text-primary">of Smart Kids</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-heading text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4 font-semibold"
        >
          Where Smart Minds Meet Smart Learning ✨
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-body text-base text-muted-foreground max-w-xl mx-auto mb-10"
        >
          From Play Group to 8th Class — Building tomorrow's leaders with joyful education, creative learning, and a nurturing environment in Jaipur, Rajasthan.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/login"
            className="font-heading text-lg font-bold px-10 py-4 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-all shadow-lg group"
          >
            <span className="flex items-center gap-2 justify-center">
              <Star className="h-5 w-5" /> Enroll Now
            </span>
          </Link>
          <a
            href="#programs"
            className="font-heading text-lg font-bold px-10 py-4 border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all rounded-full"
          >
            Our Programs
          </a>
          <Link
            to="/faculty"
            className="font-heading text-lg font-bold px-10 py-4 border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all rounded-full"
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
