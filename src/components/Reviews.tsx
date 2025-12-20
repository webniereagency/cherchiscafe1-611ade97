import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

const Reviews = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  const reviews = [
    {
      nameKey: 'reviews.r1Author',
      roleKey: 'reviews.r1Role',
      textKey: 'reviews.r1',
      rating: 5,
      date: "2 weeks ago"
    },
    {
      nameKey: 'reviews.r2Author',
      roleKey: 'reviews.r2Role',
      textKey: 'reviews.r2',
      rating: 5,
      date: "1 month ago"
    },
    {
      nameKey: 'reviews.r3Author',
      roleKey: 'reviews.r3Role',
      textKey: 'reviews.r3',
      rating: 5,
      date: "3 weeks ago"
    }
  ];

  return (
    <section id="reviews" className="py-24 md:py-32 bg-background" ref={ref}>
      <div className="section-container">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-sm uppercase tracking-[0.2em] text-primary">{t('reviews.label')}</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mt-4 mb-6">
            {t('reviews.title')}
            <span className="text-primary italic"> {t('reviews.titleHighlight')}</span>
          </h2>
          <div className="accent-line mb-6" />
          
          {/* Overall Rating */}
          <div className="flex items-center justify-center gap-3">
            <span className="font-serif text-5xl text-foreground">4.8</span>
            <div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= 4 ? 'text-accent fill-accent' : 'text-accent/50 fill-accent/50'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{t('reviews.basedOn')}</p>
            </div>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {reviews.map((review, index) => (
            <motion.div
              key={review.nameKey}
              className="glass-card p-6 rounded-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-medium text-primary">{t(review.nameKey).charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium">{t(review.nameKey)}</p>
                  <p className="text-xs text-muted-foreground">{t(review.roleKey)}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${star <= review.rating ? 'text-accent fill-accent' : 'text-muted'}`}
                  />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed">{t(review.textKey)}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <a
            href="https://www.google.com/search?q=Cherish+Addis+Coffee+%26+Books+Reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center gap-2"
          >
            {t('reviews.leaveReview')}
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;
