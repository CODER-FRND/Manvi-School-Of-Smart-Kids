import { motion } from "framer-motion";
import { Calendar, Trophy, BookOpen, Megaphone, Star, Flame } from "lucide-react";

const actions = [
  {
    icon: Trophy,
    title: "Annual Sports Day Winners!",
    desc: "Students bagged 15 gold medals at the Inter-School Sports Meet 2026.",
    tag: "Achievement",
    time: "2 hours ago",
    color: "primary",
  },
  {
    icon: Calendar,
    title: "Science Fair — March 5",
    desc: "Students from Class 3–8 showcase innovative science projects & models.",
    tag: "Event",
    time: "5 hours ago",
    color: "secondary",
  },
  {
    icon: BookOpen,
    title: "Smart Learning Lab Launched",
    desc: "New interactive digital classrooms with smart boards & tablets for all students.",
    tag: "Academic",
    time: "1 day ago",
    color: "accent",
  },
  {
    icon: Megaphone,
    title: "Parent-Teacher Meeting",
    desc: "PTM scheduled for all classes on March 15. Check portal for timings.",
    tag: "Notice",
    time: "2 days ago",
    color: "primary",
  },
  {
    icon: Star,
    title: "Art Competition Winners",
    desc: "5 students won state-level prizes in the National Drawing Competition.",
    tag: "Achievement",
    time: "3 days ago",
    color: "secondary",
  },
  {
    icon: Flame,
    title: "Summer Camp Registration Open",
    desc: "Coding, robotics, art & sports summer camp. Limited seats available!",
    tag: "Event",
    time: "5 days ago",
    color: "accent",
  },
];

const tagColors = {
  primary: "bg-primary/10 text-primary border border-primary/20",
  secondary: "bg-secondary/10 text-secondary border border-secondary/20",
  accent: "bg-accent/10 text-accent border border-accent/20",
};

const RecentActions = () => {
  return (
    <section id="events" className="py-24 relative bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-display text-sm tracking-wider text-secondary font-semibold">What's Happening</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 text-foreground">
            School <span className="text-secondary">Buzz</span> 🎉
          </h2>
          <div className="h-[3px] w-32 mx-auto mt-6 bg-gradient-to-r from-secondary to-accent rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action, i) => {
            const Icon = action.icon;
            const tc = tagColors[action.color as keyof typeof tagColors];
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.02, y: -3 }}
                className="school-card p-6 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${tc}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-body text-xs text-muted-foreground">{action.time}</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground">{action.desc}</p>
                <span className={`inline-block mt-4 px-3 py-1 rounded-full text-xs font-heading font-semibold ${tc}`}>
                  {action.tag}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RecentActions;
