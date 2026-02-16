import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="py-16 border-t border-border/30 relative overflow-hidden">
    <div className="absolute inset-0 opacity-5" style={{
      backgroundImage: `radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)`,
      backgroundSize: '30px 30px',
    }} />
    <div className="container mx-auto px-6 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold tracking-widest text-foreground">
              MANVI<span className="text-primary"> SMART</span>
            </span>
          </div>
          <p className="font-body text-sm text-muted-foreground">
            Manvi School of Smart Kids — Nurturing young minds from Play Group to 8th Class with smart learning.
          </p>
        </div>
        {[
          { title: "Explore", links: [
            { label: "Programs", to: "/#programs" },
            { label: "Faculty", to: "/faculty" },
            { label: "Events", to: "/#events" },
            { label: "About", to: "/#about" },
          ]},
          { title: "Classes", links: [
            { label: "Play Group", to: "/#programs" },
            { label: "Nursery & KG", to: "/#programs" },
            { label: "Class 1–5", to: "/#programs" },
            { label: "Class 6–8", to: "/#programs" },
          ]},
          { title: "Contact", links: [
            { label: "Admissions", to: "/login" },
            { label: "Phone: Coming Soon", to: "#" },
            { label: "Email: Coming Soon", to: "#" },
            { label: "Location: Coming Soon", to: "#" },
          ]},
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-heading text-sm tracking-[0.2em] text-primary uppercase mb-4">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="font-body text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="neon-line mt-12 mb-6" />
      <p className="text-center font-body text-xs text-muted-foreground">
        © 2026 Manvi School of Smart Kids. All rights reserved. Shaping Smart Futures.
      </p>
    </div>
  </footer>
);

export default Footer;
