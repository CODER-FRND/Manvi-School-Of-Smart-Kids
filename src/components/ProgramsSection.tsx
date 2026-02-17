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
  primary: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20", hoverBorder: "hover:border-primary/50" },
  secondary: { bg: "bg-secondary/10", text: "text-secondary", border: "border-secondary/20", hoverBorder: "hover:border-secondary/50" },
  accent: { bg: "bg-accent/10", text: "text-accent", border: "border-accent/20", hoverBorder: "hover:border-accent/50" },
};

const ProgramsSection = () => {
  return (
    <section id="programs" className="py-24 relative">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-display text-sm tracking-wider text-primary font-semibold">Classes: Play Group to 8th</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 text-foreground">
            Our <span className="text-primary">Programs</span> 📚
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
                className={`school-card p-8 cursor-pointer group border-2 ${colors.border} ${colors.hoverBorder}`}
              >
                <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-7 w-7 ${colors.text}`} />
                </div>
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
