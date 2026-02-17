import { motion } from "framer-motion";
import { Heart, Globe, Users, Lightbulb, GraduationCap, MapPin } from "lucide-react";

const features = [
  { icon: Heart, label: "Safe & Nurturing", color: "text-primary" },
  { icon: Globe, label: "Digital Classrooms", color: "text-secondary" },
  { icon: Users, label: "Expert Teachers", color: "text-accent" },
  { icon: Lightbulb, label: "Creative Learning", color: "text-primary" },
];

const AboutSection = () => (
  <section id="about" className="py-24 relative overflow-hidden">
    <div className="container mx-auto px-6 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="font-display text-sm tracking-wider text-accent font-semibold">About Us</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6 text-foreground">
            Why <span className="text-accent">Manvi?</span> 🌟
          </h2>
          <p className="font-body text-muted-foreground leading-relaxed mb-4">
            Manvi School of Smart Kids isn't just a school — it's a launchpad for young minds. 
            Located in <strong>Jaipur, Rajasthan</strong>, we combine modern teaching methods with personalized attention 
            to create a learning experience that's engaging, fun, and future-ready.
          </p>
          <p className="font-body text-muted-foreground leading-relaxed mb-4">
            From Play Group to 8th Class, our smart classrooms, experienced faculty, and holistic curriculum ensure every child 
            discovers their unique potential. With a focus on creativity, critical thinking, and 
            values — we prepare students not just for exams, but for life.
          </p>
          <div className="flex items-center gap-2 mb-8 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-body text-sm">Jaipur, Rajasthan, India</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.label}
                  whileHover={{ x: 5, scale: 1.02 }}
                  className="flex items-center gap-3 p-3 school-card group"
                >
                  <Icon className={`h-5 w-5 ${f.color} group-hover:scale-110 transition-transform`} />
                  <span className="font-heading text-sm text-foreground font-semibold">{f.label}</span>
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
          <div className="aspect-square bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 flex items-center justify-center relative overflow-hidden border-2 border-border">
            {/* Decorative circles */}
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className="absolute rounded-full border-2 border-primary/10"
                style={{ width: `${ring * 30 + 20}%`, height: `${ring * 30 + 20}%` }}
                animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 20 + ring * 5, repeat: Infinity, ease: "linear" }}
              />
            ))}
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
                <GraduationCap className="h-12 w-12 text-primary-foreground" />
              </div>
              <div className="font-display text-4xl font-bold text-primary">MSSK</div>
              <div className="font-heading text-sm text-muted-foreground mt-2 font-semibold">School of Smart Kids</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
