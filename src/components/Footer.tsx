import { motion } from 'framer-motion';
import { Instagram, Facebook, Mail, Phone, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="section-container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="font-serif text-2xl mb-4">Cherish Addis</h3>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
              A quiet space for coffee, books, and meaningful moments. Behind Abrehot Library, 4 Kilo, Addis Ababa.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/cherishaddis/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/CherishAddis/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="mailto:cherchiscafeandbook@gmail.com"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="tel:+251927957171"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
                aria-label="Phone"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium mb-4">Explore</h4>
            <ul className="space-y-3">
              {[
                { label: 'About', id: 'about' },
                { label: 'Menu', id: 'menu' },
                { label: 'Reviews', id: 'reviews' },
                { label: 'Location', id: 'location' },
                { label: 'Contact', id: 'contact' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-medium mb-4">Hours</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="text-foreground">Mon – Sat</span><br />
                07:00 AM – 09:00 PM
              </p>
              <p>
                <span className="text-foreground">Sunday</span><br />
                07:00 AM – 05:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="section-container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} Cherish Addis Coffee & Books. All rights reserved.
            </p>
            <motion.p 
              className="flex items-center gap-2 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span>We Cherish Life</span>
              <Heart className="w-4 h-4 text-primary fill-primary" />
            </motion.p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
