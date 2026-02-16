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
  primary: "bg-primary/10 text-primary cyber-border",
  secondary: "bg-secondary/10 text-secondary cyber-border-magenta",
  accent: "bg-accent/10 text-accent",
};

const RecentActions = () => {
  return (
    <section id="events" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-display text-sm tracking-[0.3em] text-secondary uppercase">What's Happening</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 text-foreground">
            SCHOOL <span className="text-secondary text-glow-magenta">BUZZ</span>
          </h2>
          <div className="h-[1px] w-32 mx-auto mt-6 bg-gradient-to-r from-transparent via-secondary to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action, i) => {
            const Icon = action.icon;
            const tc = tagColors[action.color as keyof typeof tagColors];
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.02, y: -3 }}
                className="bg-gradient-card cyber-border rounded-sm p-6 group cursor-pointer hover:border-primary/50 transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 rounded-sm ${tc}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-body text-xs text-muted-foreground">{action.time}</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground">{action.desc}</p>
                <span className={`inline-block mt-4 px-3 py-1 rounded-sm text-xs font-heading tracking-wider ${tc}`}>
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
