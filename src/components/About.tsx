import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import ethiopianCoffee from '@/assets/ethiopian-coffee.png';
import { useLanguage } from '@/i18n/LanguageContext';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 md:py-32 bg-background" ref={ref}>
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <img
                src={ethiopianCoffee}
                alt="Traditional Ethiopian coffee ceremony at Cherish Addis"
                className="w-full h-full object-cover"
              />
              {/* Decorative frame */}
              <div className="absolute inset-4 border border-primary/20 rounded-xl pointer-events-none" />
            </div>
            
            {/* Floating badge */}
            <motion.div
              className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-8 bg-card p-6 rounded-xl shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="font-serif text-3xl md:text-4xl text-primary font-medium">{t('about.rating')}</p>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${star <= 4 ? 'text-accent' : 'text-accent/50'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">{t('about.ratingText')}</p>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-sm uppercase tracking-[0.2em] text-primary">{t('about.label')}</span>
            
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mt-4 mb-6">
              {t('about.title')}
              <span className="block text-primary italic">{t('about.titleHighlight')}</span>
            </h2>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>{t('about.p1')}</p>
              <p>{t('about.p2')}</p>
              <p>{t('about.p3')}</p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-6 mt-10">
              {[
                { labelKey: 'about.featureBooks', valueKey: 'about.featureBooksValue' },
                { labelKey: 'about.featureCoffee', valueKey: 'about.featureCoffeeValue' },
                { labelKey: 'about.featureAtmosphere', valueKey: 'about.featureAtmosphereValue' },
                { labelKey: 'about.featureLocation', valueKey: 'about.featureLocationValue' },
              ].map((item, i) => (
                <motion.div
                  key={item.labelKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                >
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{t(item.labelKey)}</p>
                  <p className="font-serif text-lg text-foreground mt-1">{t(item.valueKey)}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
