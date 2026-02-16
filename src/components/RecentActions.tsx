import { motion } from "framer-motion";
import { Calendar, Trophy, BookOpen, Megaphone, Star, Flame } from "lucide-react";

const actions = [
  {
    icon: Trophy,
    title: "Robotics Championship Win",
    desc: "Our team secured 1st place at the International Robotics Olympiad 2026.",
    tag: "Achievement",
    time: "2 hours ago",
    color: "primary",
  },
  {
    icon: Calendar,
    title: "Quantum Workshop - Feb 28",
    desc: "Hands-on quantum computing workshop with industry leaders from Q-Corp.",
    tag: "Event",
    time: "5 hours ago",
    color: "secondary",
  },
  {
    icon: BookOpen,
    title: "New AI Ethics Curriculum",
    desc: "Launching a groundbreaking course on responsible AI development.",
    tag: "Academic",
    time: "1 day ago",
    color: "accent",
  },
  {
    icon: Megaphone,
    title: "Campus Expansion Phase III",
    desc: "New state-of-the-art neural science wing opening this semester.",
    tag: "News",
    time: "2 days ago",
    color: "primary",
  },
  {
    icon: Star,
    title: "Student Innovation Award",
    desc: "Maya Chen wins the Global Innovation Award for her biotech research.",
    tag: "Achievement",
    time: "3 days ago",
    color: "secondary",
  },
  {
    icon: Flame,
    title: "Hackathon 2026 Registration",
    desc: "48-hour coding marathon. Build the future. Prizes worth $50,000.",
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
          <span className="font-display text-sm tracking-[0.3em] text-secondary uppercase">Feed</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 text-foreground">
            RECENT <span className="text-secondary text-glow-magenta">ACTIONS</span>
          </h2>
          <div className="h-[1px] w-32 mx-auto mt-6 bg-gradient-to-r from-transparent via-secondary to-transparent" />
        </motion.div>

        {/* Netflix-style horizontal scroll on mobile, grid on desktop */}
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
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-card cyber-border rounded-sm p-6 group cursor-pointer hover:border-primary/50 transition-all"
              >
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
