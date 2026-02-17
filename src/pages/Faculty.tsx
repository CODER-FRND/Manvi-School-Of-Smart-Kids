import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, BookOpen, Award, ArrowLeft } from "lucide-react";

const facultyMembers = [
  { name: "Principal", role: "School Principal", subject: "Administration & Leadership", image: "/images/faculty/principal.jpg", exp: "15+ Years" },
  { name: "Mathematics Teacher", role: "Head of Mathematics", subject: "Mathematics (Class 1–8)", image: "/images/faculty/math-teacher.jpg", exp: "10+ Years" },
  { name: "Science Teacher", role: "Science Department", subject: "Science & Environmental Studies", image: "/images/faculty/science-teacher.jpg", exp: "8+ Years" },
  { name: "English Teacher", role: "Language Department", subject: "English Language & Literature", image: "/images/faculty/english-teacher.jpg", exp: "12+ Years" },
  { name: "Hindi Teacher", role: "Language Department", subject: "Hindi Language & Grammar", image: "/images/faculty/hindi-teacher.jpg", exp: "10+ Years" },
  { name: "Computer Teacher", role: "IT Department", subject: "Computer Science & Coding", image: "/images/faculty/computer-teacher.jpg", exp: "6+ Years" },
  { name: "Art Teacher", role: "Creative Arts", subject: "Drawing, Painting & Craft", image: "/images/faculty/art-teacher.jpg", exp: "7+ Years" },
  { name: "Sports Coach", role: "Physical Education", subject: "Sports & Fitness", image: "/images/faculty/sports-coach.jpg", exp: "9+ Years" },
];

const Faculty = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-28 pb-24 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-body text-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="font-display text-sm tracking-wider text-accent font-semibold">Our Team</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mt-4 text-foreground">
              Meet Our <span className="text-primary">Faculty</span> 👩‍🏫
            </h1>
            <p className="font-body text-muted-foreground mt-4 max-w-xl mx-auto">
              Experienced, passionate educators dedicated to nurturing every child's potential at Manvi School of Smart Kids.
            </p>
            <div className="neon-line w-32 mx-auto mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facultyMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="school-card overflow-hidden group cursor-pointer"
              >
                {/* Photo area */}
                <div className="aspect-[3/4] bg-muted/30 relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                      const icon = document.createElement('div');
                      icon.innerHTML = `<div class="text-center"><div class="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-primary"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><p class="text-xs text-muted-foreground font-body">Upload photo via GitHub</p></div>`;
                      target.parentElement!.appendChild(icon);
                    }}
                  />
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="font-body text-xs text-primary mt-1 font-semibold">{member.role}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-body text-xs text-muted-foreground">{member.subject}</span>
                  </div>
                  <div className="mt-2 inline-block px-2 py-0.5 bg-accent/10 text-accent text-xs font-heading font-semibold rounded-full">
                    {member.exp}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Note for uploading */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center p-6 school-card max-w-2xl mx-auto"
          >
            <Award className="h-8 w-8 text-accent mx-auto mb-3" />
            <h3 className="font-heading text-lg font-bold text-foreground mb-2">Add Faculty Photos</h3>
            <p className="font-body text-sm text-muted-foreground">
              Upload faculty photos to <code className="text-primary bg-primary/10 px-2 py-0.5 rounded text-xs">public/images/faculty/</code> folder 
              via GitHub. Name them: <code className="text-primary bg-primary/10 px-2 py-0.5 rounded text-xs">principal.jpg</code>, 
              <code className="text-primary bg-primary/10 px-2 py-0.5 rounded text-xs">math-teacher.jpg</code>, etc.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Faculty;
