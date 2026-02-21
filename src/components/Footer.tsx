import { GraduationCap, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="py-16 bg-foreground text-background relative overflow-hidden">
    <div className="container mx-auto px-6 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">
              Manvi <span className="text-primary">Smart</span>
            </span>
          </div>
          <p className="font-body text-sm opacity-70">
            Manvi School of Smart Kids — Nurturing young minds from Play Group to 8th Class with joyful learning.
          </p>
          <div className="flex items-center gap-2 mt-4 opacity-70">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-body text-xs">46-A Hari Nagar, near C.B.I colony, Jagatpura, Jaipur</span>
          </div>
          <div className="flex items-center gap-2 mt-2 opacity-70">
            <Phone className="h-4 w-4 text-primary" />
            <span className="font-body text-xs">6376002514 / 9166231062</span>
          </div>
          <div className="flex items-center gap-2 mt-2 opacity-70">
            <Mail className="h-4 w-4 text-primary" />
            <span className="font-body text-xs">manvischoolofsmartkids@gmail.com</span>
          </div>
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
            { label: "📞 6376002514 / 9166231062", to: "tel:6376002514" },
            { label: "✉️ manvischoolofsmartkids@gmail.com", to: "mailto:manvischoolofsmartkids@gmail.com" },
            { label: "📍 46-A Hari Nagar, near C.B.I colony, Jagatpura, Jaipur", to: "#" },
          ]},
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-heading text-sm font-bold text-primary uppercase mb-4">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="font-body text-sm opacity-70 hover:opacity-100 hover:text-primary cursor-pointer transition-all">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="h-px bg-background/20 mt-12 mb-6" />
      <p className="text-center font-body text-xs opacity-50">
        © 2026 Manvi School of Smart Kids, Jaipur. All rights reserved. Shaping Smart Futures.
      </p>
    </div>
  </footer>
);

export default Footer;
