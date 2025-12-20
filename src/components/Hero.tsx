import { motion } from 'framer-motion';
import cafeInterior from '@/assets/cafe-interior-1.png';
import { useLanguage } from '@/i18n/LanguageContext';

interface HeroProps {
  onExploreMenu: () => void;
  onOrderAhead: () => void;
}

const Hero = ({ onExploreMenu, onOrderAhead }: HeroProps) => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={cafeInterior}
          alt="Cherish Addis Coffee & Books interior"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content */}
      <div className="relative z-10 section-container text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Tagline above */}
          <motion.p
            className="text-sm md:text-base uppercase tracking-[0.3em] text-muted-foreground mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Main Title */}
          <motion.h1
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium tracking-wide mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="block">{t('hero.title')}</span>
            <span className="block text-primary text-3xl md:text-4xl lg:text-5xl mt-2 font-normal italic">
              {t('hero.subtitle')}
            </span>
          </motion.h1>

          {/* Decorative line */}
          <motion.div
            className="accent-line my-8"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          />

          {/* Tagline */}
          <motion.p
            className="text-lg md:text-xl text-secondary-foreground/80 max-w-2xl mx-auto mb-10 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            {t('hero.tagline')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <button
              onClick={onExploreMenu}
              className="btn-primary"
            >
              {t('hero.exploreMenu')}
            </button>
            <button
              onClick={onOrderAhead}
              className="btn-outline"
            >
              {t('hero.orderAhead')}
            </button>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
