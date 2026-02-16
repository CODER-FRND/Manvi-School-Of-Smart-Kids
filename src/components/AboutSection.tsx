import { motion } from "framer-motion";
import { Heart, Globe, Users, Lightbulb, GraduationCap } from "lucide-react";

const features = [
  { icon: Heart, label: "Safe & Nurturing" },
  { icon: Globe, label: "Digital Classrooms" },
  { icon: Users, label: "Expert Teachers" },
  { icon: Lightbulb, label: "Creative Learning" },
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
            WHY <span className="text-accent">MANVI?</span>
          </h2>
          <p className="font-body text-muted-foreground leading-relaxed mb-4">
            Manvi School of Smart Kids isn't just a school — it's a launchpad for young minds. 
            From Play Group to 8th Class, we combine modern technology with personalized attention 
            to create a learning experience that's engaging, fun, and future-ready.
          </p>
          <p className="font-body text-muted-foreground leading-relaxed mb-8">
            Our smart classrooms, experienced faculty, and holistic curriculum ensure every child 
            discovers their unique potential. With a focus on creativity, critical thinking, and 
            values — we prepare students not just for exams, but for life.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.label}
                  whileHover={{ x: 5, scale: 1.02 }}
                  className="flex items-center gap-3 p-3 bg-gradient-card cyber-border rounded-sm group"
                >
                  <Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
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
              <GraduationCap className="h-16 w-16 text-primary mx-auto mb-2 drop-shadow-[0_0_15px_hsl(185_100%_47%/0.5)]" />
              <div className="font-display text-4xl font-black text-primary text-glow-cyan">MSSK</div>
              <div className="font-heading text-sm tracking-[0.4em] text-muted-foreground mt-2">SMART KIDS</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
