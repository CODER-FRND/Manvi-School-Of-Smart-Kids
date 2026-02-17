import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 500, label: "Happy Students", suffix: "+", color: "primary" },
  { value: 95, label: "Result Rate", suffix: "%", color: "secondary" },
  { value: 25, label: "Expert Teachers", suffix: "+", color: "accent" },
  { value: 10, label: "Years of Excellence", suffix: "+", color: "primary" },
];

function Counter({ target, suffix, label, color }: { target: number; suffix: string; label: string; color: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    tick();
  }, [inView, target]);

  const colorClass = color === "primary" ? "text-primary" : color === "secondary" ? "text-secondary" : "text-accent";

  return (
    <motion.div 
      ref={ref} 
      className="text-center group"
      whileHover={{ scale: 1.05 }}
    >
      <div className={`font-display text-5xl md:text-6xl font-bold ${colorClass} transition-all`}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="font-heading text-lg text-muted-foreground mt-2 font-semibold">{label}</div>
    </motion.div>
  );
}

const StatsCounter = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-3xl" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat) => (
            <Counter key={stat.label} target={stat.value} suffix={stat.suffix} label={stat.label} color={stat.color} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
