import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, Clock, User, Mail, Phone, MessageSquare, CreditCard, Building2, Zap, CheckCircle2 } from 'lucide-react';
import { MenuItem } from './Menu';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/i18n/LanguageContext';
import emailjs from '@emailjs/browser';

// LocalStorage key for order draft
const ORDER_DRAFT_KEY = 'cherish_order_draft';

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
  const [step, setStep] = useState<'cart' | 'details' | 'payment' | 'confirmation'>('cart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderType: 'dine-in' as 'dine-in' | 'order-ahead',
    preferredTime: '',
    notes: '',
    paymentOption: 'pay_at_cafe' as 'pay_at_cafe' | 'pay_now'
  });

  // Check for saved draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(ORDER_DRAFT_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        // If payment was completed, restore state and go to details for final review
        if (draft.paymentCompleted) {
          setFormData(draft.formData);
          setPaymentCompleted(true);
          setStep('details');
          localStorage.removeItem(ORDER_DRAFT_KEY);
          toast({
            title: t('order.paymentSuccess'),
            description: t('order.paymentSuccessDesc'),
          });
        }
      } catch (e) {
        localStorage.removeItem(ORDER_DRAFT_KEY);
      }
    }
  }, [isOpen, t]);

  // Save draft to localStorage
  const saveDraft = () => {
    const draft = {
      formData,
      orderItems: orderItems.map(item => ({ id: item.id, name: item.name, price: item.price })),
      timestamp: Date.now()
    };
    localStorage.setItem(ORDER_DRAFT_KEY, JSON.stringify(draft));
  };

  // Initiate Chapa payment
  const handlePaymentComplete = async () => {
    setIsSubmitting(true);
    
    // Generate unique transaction reference
    const txRef = `cherish-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Save draft before redirect to Chapa
    const draft = {
      formData,
      orderItems: orderItems.map(item => ({ 
        id: item.id, 
        name: item.name, 
        price: item.price 
      })),
      tx_ref: txRef,
      timestamp: Date.now()
    };
    localStorage.setItem(ORDER_DRAFT_KEY, JSON.stringify(draft));

    try {
      const response = await fetch('/.netlify/functions/chapa-initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalPrice,
          email: formData.email,
          first_name: formData.name.split(' ')[0],
          last_name: formData.name.split(' ').slice(1).join(' ') || formData.name,
          phone: formData.phone,
          tx_ref: txRef,
          order_items: consolidatedItems.map(i => `${i.quantity}x ${i.name}`).join(', ')
        })
      });

      const data = await response.json();
      console.log('Chapa initiate response:', data);

      if (data.status === 'success' && data.checkout_url) {
        // Redirect to Chapa checkout page
        window.location.href = data.checkout_url;
      } else {
        toast({
          title: 'Payment Error',
          description: data.error || 'Could not start payment. Please try again.',
          variant: 'destructive'
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Chapa payment error:', error);
      toast({
        title: 'Connection Error',
        description: 'Could not connect to payment service. Please try again.',
        variant: 'destructive'
      });
      setIsSubmitting(false);
    }
  };

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
      payment_status: paymentCompleted ? 'Paid Online' : 'Pay at Café',
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
    setPaymentCompleted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      orderType: 'dine-in',
      preferredTime: '',
      notes: '',
      paymentOption: 'pay_at_cafe'
    });
    localStorage.removeItem(ORDER_DRAFT_KEY);
    onClose();
  };

  // Handle proceeding to payment step
  const handleProceedToPayment = () => {
    saveDraft();
    setStep('payment');
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
                {step === 'details' && (paymentCompleted ? t('order.reviewBeforeSubmit') : t('order.yourDetails'))}
                {step === 'payment' && t('order.payment')}
                {step === 'confirmation' && t('order.confirmed')}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {step === 'cart' && `${consolidatedItems.length} ${t('order.items')}`}
                {step === 'details' && (paymentCompleted ? t('order.paymentCompleteReview') : t('order.fillDetails'))}
                {step === 'payment' && t('order.securePayment')}
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
                paymentCompleted={paymentCompleted}
                onProceedToPayment={handleProceedToPayment}
                t={t}
              />
            )}

            {step === 'payment' && (
              <PaymentStep
                items={consolidatedItems}
                total={totalPrice}
                formData={formData}
                onPaymentComplete={handlePaymentComplete}
                isSubmitting={isSubmitting}
                t={t}
              />
            )}

            {step === 'confirmation' && (
              <ConfirmationStep
                items={consolidatedItems}
                formData={formData}
                total={totalPrice}
                paymentCompleted={paymentCompleted}
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
                {/* Only show place order button - payment option is handled inside form */}
                <button
                  form="order-form"
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {isSubmitting ? t('order.submitting') : paymentCompleted 
                    ? `${t('order.confirmOrder')} — ${totalPrice} ${t('menu.etb')}`
                    : `${t('order.placeOrder')} — ${totalPrice} ${t('menu.etb')}`
                  }
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="flex gap-4">
                <button
                  onClick={() => setStep('details')}
                  className="flex-1 btn-outline"
                >
                  {t('order.back')}
                </button>
                <button
                  onClick={handlePaymentComplete}
                  disabled={isSubmitting}
                  className="flex-1 btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      {t('order.processing')}
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      {t('order.proceedToPayment')} — {totalPrice} {t('menu.etb')}
                    </>
                  )}
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
  paymentCompleted,
  onProceedToPayment,
  t
}: { 
  formData: any; 
  setFormData: (data: any) => void;
  items: OrderItem[];
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  paymentCompleted: boolean;
  onProceedToPayment: () => void;
  t: (key: string) => string;
}) => {
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Handle form submission based on payment option
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If pay now is selected and payment not completed, go to payment step
    if (formData.paymentOption === 'pay_now' && !paymentCompleted) {
      onProceedToPayment();
      return;
    }
    
    // Otherwise submit the order
    onSubmit(e);
  };

  return (
    <form id="order-form" onSubmit={handleFormSubmit} className="space-y-6">
      {/* Payment completed banner */}
      {paymentCompleted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-primary/10 border border-primary/30 rounded-xl flex items-center gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="font-medium text-primary">{t('order.paymentSuccess')}</p>
            <p className="text-sm text-muted-foreground">{t('order.readyForPriorityPrep')}</p>
          </div>
        </motion.div>
      )}

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

        {/* Payment Option - Only show if not already paid */}
        {!paymentCompleted && (
          <div>
            <label className="flex items-center gap-2 text-sm mb-3">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              {t('order.paymentMethod')}
            </label>
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentOption: 'pay_at_cafe' })}
                className={`p-4 rounded-xl border transition-all text-left ${
                  formData.paymentOption === 'pay_at_cafe'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{t('order.payAtCafe')}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t('order.payAtCafeDesc')}</p>
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentOption: 'pay_now' })}
                className={`p-4 rounded-xl border transition-all text-left ${
                  formData.paymentOption === 'pay_now'
                    ? 'border-accent bg-accent/10'
                    : 'border-border hover:border-accent/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      {t('order.payNow')}
                      <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">{t('order.recommended')}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{t('order.payNowDesc')}</p>
                  </div>
                </div>
              </button>
            </div>
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

// Payment Step Component
const PaymentStep = ({
  items,
  total,
  formData,
  onPaymentComplete,
  isSubmitting,
  t
}: {
  items: OrderItem[];
  total: number;
  formData: any;
  onPaymentComplete: () => void;
  isSubmitting: boolean;
  t: (key: string) => string;
}) => {
  return (
    <div className="space-y-6">
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
          <div className="border-t border-border pt-3 mt-3 flex justify-between font-medium">
            <span>{t('order.total')}</span>
            <span className="text-accent">{total} {t('menu.etb')}</span>
          </div>
        </div>
      </div>

      {/* Customer Info Summary */}
      <div className="p-4 bg-secondary/30 rounded-xl">
        <p className="text-sm text-muted-foreground mb-3">{t('order.customerInfo')}</p>
        <div className="space-y-2 text-sm">
          <p><span className="text-muted-foreground">{t('order.name')}:</span> {formData.name}</p>
          <p><span className="text-muted-foreground">{t('order.email')}:</span> {formData.email}</p>
          <p><span className="text-muted-foreground">{t('order.phone')}:</span> {formData.phone}</p>
        </div>
      </div>

      {/* Benefits of paying now */}
      <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl">
        <p className="font-medium text-accent mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          {t('order.payNowBenefits')}
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-accent" />
            {t('order.benefit1')}
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-accent" />
            {t('order.benefit2')}
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-accent" />
            {t('order.benefit3')}
          </li>
        </ul>
      </div>

      {/* Payment placeholder notice */}
      <div className="p-4 bg-muted/50 rounded-xl text-center">
        <p className="text-sm text-muted-foreground">
          {t('order.paymentPlaceholder')}
        </p>
      </div>
    </div>
  );
};

// Confirmation Step Component
const ConfirmationStep = ({ 
  items, 
  formData, 
  total,
  paymentCompleted,
  t
}: { 
  items: OrderItem[]; 
  formData: any;
  total: number;
  paymentCompleted: boolean;
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
        {paymentCompleted ? t('order.confirmedDescPaid') : t('order.confirmedDesc')}
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
          <p>
            <span className="text-muted-foreground">{t('order.paymentStatus')}:</span>{' '}
            <span className={paymentCompleted ? 'text-primary font-medium' : ''}>
              {paymentCompleted ? t('order.paidOnline') : t('order.payAtCafe')}
            </span>
          </p>
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
