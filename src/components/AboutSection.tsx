import { motion } from "framer-motion";
import { Cpu, Globe, Users, Lightbulb } from "lucide-react";

const features = [
  { icon: Cpu, label: "AI-Powered Labs" },
  { icon: Globe, label: "Global Network" },
  { icon: Users, label: "Expert Faculty" },
  { icon: Lightbulb, label: "Innovation Hub" },
];

const AboutSection = () => (
  <section id="about" className="py-24 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
    <div className="container mx-auto px-6 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="font-display text-sm tracking-[0.3em] text-accent uppercase">About Us</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6 text-foreground">
            REDEFINING <span className="text-accent">EDUCATION</span>
          </h2>
          <p className="font-body text-muted-foreground leading-relaxed mb-8">
            NexusEdu isn't just a school — it's a launchpad for the next generation of innovators, 
            creators, and leaders. Our campus fuses state-of-the-art technology with personalized 
            mentorship to create an educational experience that's truly unprecedented.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.label}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 p-3 bg-gradient-card cyber-border rounded-sm"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="font-heading text-sm text-foreground tracking-wider">{f.label}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-square bg-gradient-card cyber-border rounded-sm p-8 flex items-center justify-center relative overflow-hidden">
            {/* Animated rings */}
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className="absolute rounded-full cyber-border"
                style={{ width: `${ring * 30 + 20}%`, height: `${ring * 30 + 20}%` }}
                animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 20 + ring * 5, repeat: Infinity, ease: "linear" }}
              />
            ))}
            <div className="relative z-10 text-center">
              <div className="font-display text-6xl font-black text-primary text-glow-cyan">N</div>
              <div className="font-heading text-lg tracking-[0.5em] text-muted-foreground mt-2">NEXUS</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
