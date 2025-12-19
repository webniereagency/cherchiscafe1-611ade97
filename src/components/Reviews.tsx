import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, ExternalLink } from 'lucide-react';

const reviews = [
  {
    name: "Abebe K.",
    rating: 5,
    text: "The perfect spot for reading and working. Great Ethiopian coffee and the atmosphere is so peaceful. Will keep coming back!",
    date: "2 weeks ago"
  },
  {
    name: "Hanna M.",
    rating: 5,
    text: "Finally, a café that understands the value of quiet. The book selection is wonderful, and their waffles are amazing.",
    date: "1 month ago"
  },
  {
    name: "Daniel T.",
    rating: 5,
    text: "Best study spot near 4 Kilo. The staff is friendly, coffee is excellent, and it's right behind Abrehot Library. Perfect location!",
    date: "3 weeks ago"
  },
  {
    name: "Sara B.",
    rating: 4,
    text: "Cozy atmosphere with great food options. Love the avocado toast and their signature lattes. A hidden gem in Addis.",
    date: "1 month ago"
  }
];

const Reviews = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
          <span className="text-sm uppercase tracking-[0.2em] text-primary">Reviews</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mt-4 mb-6">
            What Our Guests
            <span className="text-primary italic"> Say</span>
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
              <p className="text-sm text-muted-foreground mt-1">Based on 48 Google reviews</p>
            </div>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              className="glass-card p-6 rounded-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-medium text-primary">{review.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium">{review.name}</p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${star <= review.rating ? 'text-accent fill-accent' : 'text-muted'}`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground ml-auto">{review.date}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{review.text}</p>
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
            href="https://www.google.com/search?sca_esv=6680caca2d5017ee&sxsrf=AE3TifNczDwQt5wjHAlj9AcezmrUUmOinA:1766147229549&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-EwK0qWUZBMWCIg_UMxAQo-PQnMYvdAD5zJXeYIV6AJqYUFPEJlRSNHnXQUbiNreE-AeNLnMUsQg4DzSMO3zTQbYJj7a8OXJQ56Oxh8A2NMd_ib10oA%3D%3D&q=Cherish+Addis+Coffee+%26+Books+Reviews&sa=X&ved=2ahUKEwim5POR08mRAxWQTKQEHRNwBmUQ0bkNegQIKhAD&biw=1366&bih=645&dpr=1"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center gap-2"
          >
            Leave a Review
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;
