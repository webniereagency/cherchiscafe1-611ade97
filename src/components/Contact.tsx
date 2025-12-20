import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Send, Phone, Mail, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/i18n/LanguageContext';

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: t('contact.messageSent'),
      description: t('contact.messageSuccess'),
    });
    
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/251927957171', '_blank');
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-background" ref={ref}>
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Side - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-sm uppercase tracking-[0.2em] text-primary">{t('contact.label')}</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mt-4 mb-6">
              {t('contact.title')}
              <span className="text-primary italic"> {t('contact.titleHighlight')}</span>
            </h2>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              {t('contact.description')}
            </p>

            <div className="space-y-6">
              {/* Phone */}
              <a 
                href="tel:+251927957171"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('contact.callUs')}</p>
                  <p className="font-medium group-hover:text-primary transition-colors">+251 92 795 7171</p>
                </div>
              </a>

              {/* Email */}
              <a 
                href="mailto:cherchiscafeandbook@gmail.com"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('contact.emailUs')}</p>
                  <p className="font-medium group-hover:text-primary transition-colors">cherchiscafeandbook@gmail.com</p>
                </div>
              </a>

              {/* WhatsApp Button */}
              <button
                onClick={openWhatsApp}
                className="flex items-center gap-3 px-6 py-3 bg-[#25D366]/10 text-[#25D366] rounded-full hover:bg-[#25D366]/20 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">{t('contact.whatsApp')}</span>
              </button>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl">
              <h3 className="font-serif text-2xl mb-6">{t('contact.sendMessage')}</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">{t('contact.name')}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder={t('contact.namePlaceholder')}
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">{t('contact.email')}</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    placeholder={t('contact.emailPlaceholder')}
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">{t('contact.message')}</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input-field min-h-[140px] resize-none"
                    placeholder={t('contact.messagePlaceholder')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    t('contact.sending')
                  ) : (
                    <>
                      {t('contact.send')}
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
