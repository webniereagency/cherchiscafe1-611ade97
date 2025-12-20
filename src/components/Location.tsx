import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

const Location = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

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
          <span className="text-sm uppercase tracking-[0.2em] text-primary">{t('location.label')}</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mt-4 mb-6">
            {t('location.title')}
            <span className="text-primary italic"> {t('location.titleHighlight')}</span>
          </h2>
          <div className="accent-line mb-6" />
          <p className="text-muted-foreground">
            {t('location.description')}
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
                  <h3 className="font-serif text-xl mb-2">{t('location.address')}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('location.addressText')}
                  </p>
                  <p className="text-sm text-primary mt-3">
                    ★ {t('location.nearLibrary')}
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
                  <h3 className="font-serif text-xl mb-4">{t('location.hours')}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('location.monSat')}</span>
                      <span className="font-medium">{t('location.monSatTime')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('location.sunday')}</span>
                      <span className="font-medium">{t('location.sundayTime')}</span>
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
                  <h3 className="font-serif text-xl mb-2">{t('location.phone')}</h3>
                  <a 
                    href="tel:+251927957171" 
                    className="text-lg hover:text-primary transition-colors"
                  >
                    +251 92 795 7171
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('location.callOrWhatsApp')}
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
              {t('location.getDirections')}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Location;
