import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 500, label: "Happy Students", suffix: "+" },
  { value: 95, label: "Result Rate", suffix: "%" },
  { value: 25, label: "Expert Teachers", suffix: "+" },
  { value: 10, label: "Years of Excellence", suffix: "+" },
];

function Counter({ target, suffix, label }: { target: number; suffix: string; label: string }) {
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

  return (
    <motion.div 
      ref={ref} 
      className="text-center group"
      whileHover={{ scale: 1.05 }}
    >
      <div className="font-display text-5xl md:text-6xl font-black text-primary text-glow-cyan group-hover:drop-shadow-[0_0_20px_hsl(185_100%_47%/0.6)] transition-all">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="font-heading text-lg text-muted-foreground mt-2 tracking-wider uppercase">{label}</div>
    </motion.div>
  );
}

const StatsCounter = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat) => (
            <Counter key={stat.label} target={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
