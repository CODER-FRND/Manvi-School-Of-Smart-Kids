import { motion } from "framer-motion";
import { BookOpen, Palette, Calculator, Globe, Music, Dumbbell } from "lucide-react";

const programs = [
  { icon: BookOpen, title: "Play Group & Nursery", desc: "Fun-filled early learning with interactive play, stories, and creative activities for tiny tots.", color: "primary" },
  { icon: Palette, title: "Arts & Creativity", desc: "Drawing, painting, craft, and digital art to nurture your child's creative expression.", color: "secondary" },
  { icon: Calculator, title: "Smart Mathematics", desc: "Vedic math, mental math, and problem-solving skills through gamified learning.", color: "accent" },
  { icon: Globe, title: "Science & Discovery", desc: "Hands-on experiments, nature walks, and project-based science exploration.", color: "primary" },
  { icon: Music, title: "Music & Performance", desc: "Vocal, instrumental training, and stage performance to build confidence.", color: "secondary" },
  { icon: Dumbbell, title: "Sports & Fitness", desc: "Cricket, football, yoga, and martial arts for all-round physical development.", color: "accent" },
];

const colorMap = {
  primary: "text-primary cyber-border hover:box-glow-cyan",
  secondary: "text-secondary cyber-border-magenta hover:box-glow-magenta",
  accent: "text-accent cyber-border hover:box-glow-purple",
};

const ProgramsSection = () => {
  return (
    <section id="programs" className="py-24 relative">
      {/* Texture overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 1px, transparent 1px), radial-gradient(circle at 75% 75%, hsl(var(--secondary)) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-display text-sm tracking-[0.3em] text-primary uppercase">Classes: Play Group to 8th</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 text-foreground">
            OUR <span className="text-primary text-glow-cyan">PROGRAMS</span>
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
                className={`bg-gradient-card p-8 rounded-sm ${colors} cursor-pointer transition-all group relative overflow-hidden`}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <Icon className="h-10 w-10 mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3" />
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-2">{program.title}</h3>
                  <p className="font-body text-muted-foreground text-sm">{program.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
