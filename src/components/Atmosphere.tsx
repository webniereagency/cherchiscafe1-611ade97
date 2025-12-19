import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Coffee, BookOpen, Sun, Moon } from 'lucide-react';
import cafeInterior2 from '@/assets/cafe-interior-2.png';
import wafflesWindow from '@/assets/waffles-window.png';

const Atmosphere = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const experiences = [
    {
      icon: Sun,
      time: "Morning",
      title: "Quiet Beginnings",
      description: "Start your day with traditional Ethiopian coffee and the soft rustle of pages. The morning light filters through our windows as students and early risers find their focus."
    },
    {
      icon: Coffee,
      time: "Afternoon",
      title: "Creative Flow",
      description: "The café hums with quiet productivity. Laptops open, notebooks fill, and our specialty drinks fuel the afternoon's work. Perfect for studying or remote work."
    },
    {
      icon: BookOpen,
      time: "Evening",
      title: "Winding Down",
      description: "As the city slows, conversations deepen. Friends gather over pastries, couples share quiet moments, and the day's stories find their endings."
    },
    {
      icon: Moon,
      time: "Weekend",
      title: "Cherished Moments",
      description: "Weekend brunches extend into lazy afternoons. Browse our book collection, try our signature waffles, and let time move at its own pace."
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
          <span className="text-sm uppercase tracking-[0.2em] text-primary">Experience</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mt-4 mb-6">
            The Rhythm of
            <span className="text-primary italic"> Our Days</span>
          </h2>
          <div className="accent-line mb-6" />
          <p className="text-muted-foreground">
            Every hour at Cherish Addis has its own character. Discover your perfect moment.
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
              <p className="text-sm uppercase tracking-wider text-primary">Daily Life</p>
              <p className="font-serif text-xl text-foreground">Where conversations flow</p>
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
              <p className="text-sm uppercase tracking-wider text-primary">Evening Bliss</p>
              <p className="font-serif text-xl text-foreground">Sweet endings to your day</p>
            </div>
          </motion.div>
        </div>

        {/* Experience Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.time}
              className="glass-card p-6 rounded-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <exp.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs uppercase tracking-wider text-primary mb-1">{exp.time}</p>
              <h3 className="font-serif text-xl mb-3">{exp.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Atmosphere;
