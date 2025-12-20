import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { MenuItem } from './Menu';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/i18n/LanguageContext';
import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_xpy2g8e';
const EMAILJS_CAFE_TEMPLATE_ID = 'template_z4roxwe';
const EMAILJS_CUSTOMER_TEMPLATE_ID = 'template_6w8wgjt';
const EMAILJS_PUBLIC_KEY = 'v24iEbEf-xtQcUm0e';

interface OrderItem extends MenuItem {
  quantity: number;
}

interface OrderSystemProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: MenuItem[];
  onRemoveItem: (id: string) => void;
  onClearOrder: () => void;
}

const OrderSystem = ({ isOpen, onClose, orderItems, onRemoveItem, onClearOrder }: OrderSystemProps) => {
  const [step, setStep] = useState<'cart' | 'details' | 'confirmation'>('cart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderType: 'dine-in' as 'dine-in' | 'order-ahead',
    preferredTime: '',
    notes: ''
  });

  // Consolidate items with quantities
  const consolidatedItems = orderItems.reduce((acc, item) => {
    const existing = acc.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      acc.push({ ...item, quantity: 1 });
    }
    return acc;
  }, [] as OrderItem[]);

  const totalPrice = consolidatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Format order items for email (HTML format for better display)
  const formatOrderItems = () => {
    return consolidatedItems
      .map(item => `${item.quantity}x ${item.name} - ${item.price * item.quantity} ETB`)
      .join('<br>');
  };

  // Format order items as plain text
  const formatOrderItemsText = () => {
    return consolidatedItems
      .map(item => `${item.quantity}x ${item.name} - ${item.price * item.quantity} ETB`)
      .join(', ');
  };

  // Get current date formatted
  const getOrderDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderItemsFormatted = formatOrderItems();
    const orderItemsText = formatOrderItemsText();

    const emailParams = {
      customer_name: formData.name || 'Guest',
      customer_email: formData.email || '',
      customer_phone: formData.phone || 'Not provided',
      order_type: formData.orderType === 'dine-in' ? 'Dine-In' : 'Order Ahead',
      preferred_time: formData.preferredTime || 'Not specified',
      special_notes: formData.notes || 'None',
      order_items: orderItemsFormatted,
      order_items_text: orderItemsText,
      total_price: totalPrice.toString(),
      order_date: getOrderDate(),
    };

    try {
      // Send email to café
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_CAFE_TEMPLATE_ID,
        emailParams,
        EMAILJS_PUBLIC_KEY
      );

      // Send confirmation email to customer
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_CUSTOMER_TEMPLATE_ID,
        emailParams,
        EMAILJS_PUBLIC_KEY
      );

      setStep('confirmation');
      toast({
        title: t('order.confirmed'),
        description: t('order.confirmedDesc'),
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      toast({
        title: 'Order Error',
        description: 'Failed to send order. Please try again or contact us directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('cart');
    onClose();
  };

  const resetOrder = () => {
    onClearOrder();
    setStep('cart');
    setFormData({
      name: '',
      email: '',
      phone: '',
      orderType: 'dine-in',
      preferredTime: '',
      notes: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-background/95 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-card rounded-2xl overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
        >
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl">
                {step === 'cart' && t('order.title')}
                {step === 'details' && t('order.yourDetails')}
                {step === 'confirmation' && t('order.confirmed')}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {step === 'cart' && `${consolidatedItems.length} ${t('order.items')}`}
                {step === 'details' && t('order.fillDetails')}
                {step === 'confirmation' && t('order.thankYou')}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            {step === 'cart' && (
              <CartStep
                items={consolidatedItems}
                onRemove={onRemoveItem}
                onClear={onClearOrder}
                t={t}
              />
            )}

            {step === 'details' && (
              <DetailsStep
                formData={formData}
                setFormData={setFormData}
                items={consolidatedItems}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                t={t}
              />
            )}

            {step === 'confirmation' && (
              <ConfirmationStep
                items={consolidatedItems}
                formData={formData}
                total={totalPrice}
                t={t}
              />
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            {step === 'cart' && (
              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span>{t('order.total')}</span>
                  <span className="font-medium text-accent">{totalPrice} {t('menu.etb')}</span>
                </div>
                <button
                  onClick={() => setStep('details')}
                  disabled={consolidatedItems.length === 0}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('order.continueDetails')}
                </button>
              </div>
            )}

            {step === 'details' && (
              <div className="flex gap-4">
                <button
                  onClick={() => setStep('cart')}
                  className="flex-1 btn-outline"
                >
                  {t('order.back')}
                </button>
                <button
                  form="order-form"
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {isSubmitting ? t('order.submitting') : `${t('order.placeOrder')} — ${totalPrice} ${t('menu.etb')}`}
                </button>
              </div>
            )}

            {step === 'confirmation' && (
              <button
                onClick={resetOrder}
                className="w-full btn-primary"
              >
                {t('order.close')}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Cart Step Component
const CartStep = ({ 
  items, 
  onRemove,
  onClear,
  t
}: { 
  items: OrderItem[]; 
  onRemove: (id: string) => void;
  onClear: () => void;
  t: (key: string) => string;
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-lg text-muted-foreground">{t('order.empty')}</p>
        <p className="text-sm text-muted-foreground mt-2">{t('order.emptyDesc')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <motion.div
          key={item.id}
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h4 className="font-medium">{item.name}</h4>
            <p className="text-sm text-muted-foreground">
              {item.quantity} × {item.price} {t('menu.etb')}
            </p>
          </div>
          <p className="font-medium text-accent">{item.price * item.quantity} {t('menu.etb')}</p>
          <button
            onClick={() => onRemove(item.id)}
            className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </motion.div>
      ))}
      
      {items.length > 0 && (
        <button
          onClick={onClear}
          className="text-sm text-muted-foreground hover:text-destructive transition-colors"
        >
          {t('order.clearAll')}
        </button>
      )}
    </div>
  );
};

// Details Step Component
const DetailsStep = ({ 
  formData, 
  setFormData, 
  items,
  onSubmit,
  isSubmitting,
  t
}: { 
  formData: any; 
  setFormData: (data: any) => void;
  items: OrderItem[];
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  t: (key: string) => string;
}) => {
  return (
    <form id="order-form" onSubmit={onSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="p-4 bg-secondary/30 rounded-xl">
        <p className="text-sm text-muted-foreground mb-3">{t('order.orderSummary')}</p>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.quantity}× {item.name}</span>
              <span>{item.price * item.quantity} {t('menu.etb')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Details */}
      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm mb-2">
            <User className="w-4 h-4 text-muted-foreground" />
            {t('order.name')}
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field"
            placeholder={t('order.namePlaceholder')}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm mb-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            {t('order.email')}
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input-field"
            placeholder={t('order.emailPlaceholder')}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm mb-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            {t('order.phone')}
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="input-field"
            placeholder={t('order.phonePlaceholder')}
          />
        </div>

        {/* Order Type */}
        <div>
          <label className="flex items-center gap-2 text-sm mb-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            {t('order.orderType')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, orderType: 'dine-in' })}
              className={`p-4 rounded-xl border transition-all ${
                formData.orderType === 'dine-in'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <p className="font-medium">{t('order.dineIn')}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('order.dineInDesc')}</p>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, orderType: 'order-ahead' })}
              className={`p-4 rounded-xl border transition-all ${
                formData.orderType === 'order-ahead'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <p className="font-medium">{t('order.orderAhead')}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('order.orderAheadDesc')}</p>
            </button>
          </div>
        </div>

        {formData.orderType === 'order-ahead' && (
          <div>
            <label className="text-sm mb-2 block">{t('order.preferredTime')}</label>
            <input
              type="time"
              required={formData.orderType === 'order-ahead'}
              value={formData.preferredTime}
              onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
              className="input-field"
            />
          </div>
        )}

        <div>
          <label className="flex items-center gap-2 text-sm mb-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            {t('order.specialNotes')}
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="input-field min-h-[80px] resize-none"
            placeholder={t('order.notesPlaceholder')}
          />
        </div>
      </div>
    </form>
  );
};

// Confirmation Step Component
const ConfirmationStep = ({ 
  items, 
  formData, 
  total,
  t
}: { 
  items: OrderItem[]; 
  formData: any;
  total: number;
  t: (key: string) => string;
}) => {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center"
      >
        <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>

      <h3 className="font-serif text-2xl mb-2">{t('order.thankYouName')}, {formData.name}!</h3>
      <p className="text-muted-foreground mb-8">
        {t('order.confirmedDesc')}
      </p>

      <div className="text-left p-6 bg-secondary/30 rounded-xl">
        <p className="text-sm text-muted-foreground mb-4">{t('order.orderDetails')}</p>
        
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.quantity}× {item.name}</span>
              <span className="text-muted-foreground">{item.price * item.quantity} {t('menu.etb')}</span>
            </div>
          ))}
          <div className="border-t border-border pt-3 mt-3 flex justify-between font-medium">
            <span>{t('order.total')}</span>
            <span className="text-accent">{total} {t('menu.etb')}</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border space-y-2 text-sm">
          <p><span className="text-muted-foreground">{t('order.type')}:</span> {formData.orderType === 'dine-in' ? t('order.dineIn') : t('order.orderAhead')}</p>
          {formData.preferredTime && (
            <p><span className="text-muted-foreground">{t('order.time')}:</span> {formData.preferredTime}</p>
          )}
          {formData.notes && (
            <p><span className="text-muted-foreground">{t('order.notes')}:</span> {formData.notes}</p>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mt-6">
        {t('order.confirmationSent')} {formData.email}
      </p>
    </div>
  );
};

export default OrderSystem;
