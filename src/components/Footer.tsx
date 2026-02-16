import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="py-16 border-t border-border/30">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold tracking-widest text-foreground">
              NEXUS<span className="text-primary">EDU</span>
            </span>
          </div>
          <p className="font-body text-sm text-muted-foreground">
            Shaping the innovators of tomorrow through technology-driven education.
          </p>
        </div>
        {[
          { title: "Explore", links: ["Programs", "Research", "Faculty", "Campus"] },
          { title: "Connect", links: ["Admissions", "Events", "Alumni", "Careers"] },
          { title: "Support", links: ["Help Center", "Contact", "Privacy", "Terms"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-heading text-sm tracking-[0.2em] text-primary uppercase mb-4">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <span className="font-body text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">{link}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="neon-line mt-12 mb-6" />
      <p className="text-center font-body text-xs text-muted-foreground">
        © 2026 NexusEdu. All rights reserved. Designed for the future.
      </p>
    </div>
  </footer>
);

export default Footer;
