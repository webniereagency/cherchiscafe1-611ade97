import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Coffee, BookOpen, Sun, Moon } from 'lucide-react';
import cafeInterior2 from '@/assets/cafe-interior-2.png';
import wafflesWindow from '@/assets/waffles-window.png';
import { useLanguage } from '@/i18n/LanguageContext';

const Atmosphere = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  const experiences = [
    {
      icon: Sun,
      timeKey: "atmosphere.morningTime",
      titleKey: "atmosphere.morning",
      descriptionKey: "atmosphere.morningDesc"
    },
    {
      icon: Coffee,
      timeKey: "atmosphere.afternoonTime",
      titleKey: "atmosphere.afternoon",
      descriptionKey: "atmosphere.afternoonDesc"
    },
    {
      icon: BookOpen,
      timeKey: "atmosphere.eveningTime",
      titleKey: "atmosphere.evening",
      descriptionKey: "atmosphere.eveningDesc"
    },
    {
      icon: Moon,
      timeKey: "atmosphere.weekendTime",
      titleKey: "atmosphere.weekend",
      descriptionKey: "atmosphere.weekendDesc"
    }
  ];

  return (
    <section id="atmosphere" className="py-24 md:py-32 bg-secondary/30" ref={ref}>
      <div className="section-container">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-sm uppercase tracking-[0.2em] text-primary">{t('atmosphere.label')}</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mt-4 mb-6">
            {t('atmosphere.title')}
            <span className="text-primary italic"> {t('atmosphere.titleHighlight')}</span>
          </h2>
          <div className="accent-line mb-6" />
          <p className="text-muted-foreground">
            {t('atmosphere.description')}
          </p>
        </motion.div>

        {/* Image Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <motion.div
            className="relative aspect-[4/3] rounded-2xl overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src={cafeInterior2}
              alt="Cherish Addis café atmosphere"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-sm uppercase tracking-wider text-primary">{t('atmosphere.dailyLife')}</p>
              <p className="font-serif text-xl text-foreground">{t('atmosphere.conversations')}</p>
            </div>
          </motion.div>

          <motion.div
            className="relative aspect-[4/3] rounded-2xl overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <img
              src={wafflesWindow}
              alt="Evening at Cherish Addis"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-sm uppercase tracking-wider text-primary">{t('atmosphere.eveningBliss')}</p>
              <p className="font-serif text-xl text-foreground">{t('atmosphere.sweetEndings')}</p>
            </div>
          </motion.div>
        </div>

        {/* Experience Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.titleKey}
              className="glass-card p-6 rounded-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <exp.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs uppercase tracking-wider text-primary mb-1">{t(exp.timeKey)}</p>
              <h3 className="font-serif text-xl mb-3">{t(exp.titleKey)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(exp.descriptionKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Atmosphere;
