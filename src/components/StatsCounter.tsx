import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 15000, label: "Students Enrolled", suffix: "+" },
  { value: 98, label: "Placement Rate", suffix: "%" },
  { value: 250, label: "Research Labs", suffix: "+" },
  { value: 45, label: "Countries", suffix: "+" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
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
    <div ref={ref} className="text-center">
      <div className="font-display text-5xl md:text-6xl font-black text-primary text-glow-cyan">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="font-heading text-lg text-muted-foreground mt-2 tracking-wider uppercase">{stats.find(s => s.value === target)?.label}</div>
    </div>
  );
}

const StatsCounter = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat) => (
            <Counter key={stat.label} target={stat.value} suffix={stat.suffix} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
