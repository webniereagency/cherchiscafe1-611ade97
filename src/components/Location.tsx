import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';

const Location = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const openGoogleMaps = () => {
    window.open('https://maps.google.com/?q=Cherish+Addis+Coffee+%26+Books+4+Kilo+Addis+Ababa', '_blank');
  };

  return (
    <section id="location" className="py-24 md:py-32 bg-secondary/30" ref={ref}>
      <div className="section-container">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-sm uppercase tracking-[0.2em] text-primary">Find Us</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mt-4 mb-6">
            Visit
            <span className="text-primary italic"> Cherish Addis</span>
          </h2>
          <div className="accent-line mb-6" />
          <p className="text-muted-foreground">
            We're located behind Abrehot Library in 4 Kilo—Ethiopia's knowledge district.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Map */}
          <motion.div
            className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px] rounded-2xl overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.4!2d38.76!3d9.035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCherish%20Addis%20Coffee%20%26%20Books!5e0!3m2!1sen!2set!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '300px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
              title="Cherish Addis location map"
            />
            <div className="absolute inset-0 pointer-events-none border border-border/50 rounded-2xl" />
          </motion.div>

          {/* Info Cards */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Address */}
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-xl mb-2">Address</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Behind Abrehot Library<br />
                    4 Kilo, Addis Ababa<br />
                    Ethiopia
                  </p>
                  <p className="text-sm text-primary mt-3">
                    ★ Just steps from Ethiopia's largest public library
                  </p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-xl mb-4">Opening Hours</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monday – Saturday</span>
                      <span className="font-medium">07:00 AM – 09:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday</span>
                      <span className="font-medium">07:00 AM – 05:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-xl mb-2">Get in Touch</h3>
                  <a 
                    href="tel:+251927957171" 
                    className="text-lg hover:text-primary transition-colors"
                  >
                    +251 92 795 7171
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    Call or WhatsApp
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={openGoogleMaps}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              Get Directions
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Location;
