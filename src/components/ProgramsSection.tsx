import { motion } from "framer-motion";
import { Brain, Code, Palette, Atom, Rocket, Shield } from "lucide-react";

const programs = [
  { icon: Code, title: "Quantum Computing", desc: "Master the future of computation with hands-on quantum labs.", color: "primary" },
  { icon: Brain, title: "Neural Engineering", desc: "Explore brain-computer interfaces and cognitive tech.", color: "secondary" },
  { icon: Palette, title: "Digital Arts & XR", desc: "Create immersive experiences in VR, AR, and mixed reality.", color: "accent" },
  { icon: Atom, title: "Nano Science", desc: "Manipulate matter at the atomic scale for breakthrough discoveries.", color: "primary" },
  { icon: Rocket, title: "Space Systems", desc: "Design spacecraft and explore the final frontier.", color: "secondary" },
  { icon: Shield, title: "Cyber Security", desc: "Defend the digital world with advanced threat intelligence.", color: "accent" },
];

const colorMap = {
  primary: "text-primary cyber-border box-glow-cyan",
  secondary: "text-secondary cyber-border-magenta box-glow-magenta",
  accent: "text-accent cyber-border box-glow-purple",
};

const ProgramsSection = () => {
  return (
    <section id="programs" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-display text-sm tracking-[0.3em] text-primary uppercase">Programs</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 text-foreground">
            CHOOSE YOUR <span className="text-primary text-glow-cyan">PATH</span>
          </h2>
          <div className="neon-line w-32 mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, i) => {
            const Icon = program.icon;
            const colors = colorMap[program.color as keyof typeof colorMap];
            return (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className={`bg-gradient-card p-8 rounded-sm ${colors} cursor-pointer transition-all group`}
              >
                <Icon className="h-10 w-10 mb-4 transition-transform group-hover:scale-110" />
                <h3 className="font-heading text-2xl font-bold text-foreground mb-2">{program.title}</h3>
                <p className="font-body text-muted-foreground text-sm">{program.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
