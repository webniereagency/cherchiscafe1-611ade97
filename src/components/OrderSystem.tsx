import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { MenuItem } from './Menu';
import { toast } from '@/hooks/use-toast';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate order submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setStep('confirmation');
    setIsSubmitting(false);
    
    toast({
      title: "Order Received!",
      description: "We'll prepare your order with care.",
    });
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
                {step === 'cart' && 'Your Order'}
                {step === 'details' && 'Complete Your Order'}
                {step === 'confirmation' && 'Order Confirmed'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {step === 'cart' && `${consolidatedItems.length} item${consolidatedItems.length !== 1 ? 's' : ''}`}
                {step === 'details' && 'Fill in your details below'}
                {step === 'confirmation' && 'Thank you for your order'}
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
              />
            )}

            {step === 'details' && (
              <DetailsStep
                formData={formData}
                setFormData={setFormData}
                items={consolidatedItems}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}

            {step === 'confirmation' && (
              <ConfirmationStep
                items={consolidatedItems}
                formData={formData}
                total={totalPrice}
              />
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            {step === 'cart' && (
              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span>Total</span>
                  <span className="font-medium text-accent">{totalPrice} ETB</span>
                </div>
                <button
                  onClick={() => setStep('details')}
                  disabled={consolidatedItems.length === 0}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Details
                </button>
              </div>
            )}

            {step === 'details' && (
              <div className="flex gap-4">
                <button
                  onClick={() => setStep('cart')}
                  className="flex-1 btn-outline"
                >
                  Back
                </button>
                <button
                  form="order-form"
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : `Place Order — ${totalPrice} ETB`}
                </button>
              </div>
            )}

            {step === 'confirmation' && (
              <button
                onClick={resetOrder}
                className="w-full btn-primary"
              >
                Done
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
  onClear
}: { 
  items: OrderItem[]; 
  onRemove: (id: string) => void;
  onClear: () => void;
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-lg text-muted-foreground">Your order is empty</p>
        <p className="text-sm text-muted-foreground mt-2">Browse our menu to add items</p>
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
              {item.quantity} × {item.price} ETB
            </p>
          </div>
          <p className="font-medium text-accent">{item.price * item.quantity} ETB</p>
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
          Clear all items
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
  isSubmitting
}: { 
  formData: any; 
  setFormData: (data: any) => void;
  items: OrderItem[];
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}) => {
  return (
    <form id="order-form" onSubmit={onSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="p-4 bg-secondary/30 rounded-xl">
        <p className="text-sm text-muted-foreground mb-3">Order Summary</p>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.quantity}× {item.name}</span>
              <span>{item.price * item.quantity} ETB</span>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Details */}
      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm mb-2">
            <User className="w-4 h-4 text-muted-foreground" />
            Your Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm mb-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input-field"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm mb-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            Phone Number
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="input-field"
            placeholder="+251 9X XXX XXXX"
          />
        </div>

        {/* Order Type */}
        <div>
          <label className="flex items-center gap-2 text-sm mb-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            Order Type
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
              <p className="font-medium">Dine-in Now</p>
              <p className="text-xs text-muted-foreground mt-1">Ready when you arrive</p>
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
              <p className="font-medium">Order Ahead</p>
              <p className="text-xs text-muted-foreground mt-1">Pick a time</p>
            </button>
          </div>
        </div>

        {formData.orderType === 'order-ahead' && (
          <div>
            <label className="text-sm mb-2 block">Preferred Time</label>
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
            Special Notes (optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="input-field min-h-[80px] resize-none"
            placeholder="Any special requests or dietary requirements..."
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
  total 
}: { 
  items: OrderItem[]; 
  formData: any;
  total: number;
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

      <h3 className="font-serif text-2xl mb-2">Thank You, {formData.name}!</h3>
      <p className="text-muted-foreground mb-8">
        Your order has been received. We'll prepare it with care.
      </p>

      <div className="text-left p-6 bg-secondary/30 rounded-xl">
        <p className="text-sm text-muted-foreground mb-4">Order Details</p>
        
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.quantity}× {item.name}</span>
              <span className="text-muted-foreground">{item.price * item.quantity} ETB</span>
            </div>
          ))}
          <div className="border-t border-border pt-3 mt-3 flex justify-between font-medium">
            <span>Total</span>
            <span className="text-accent">{total} ETB</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border space-y-2 text-sm">
          <p><span className="text-muted-foreground">Type:</span> {formData.orderType === 'dine-in' ? 'Dine-in' : 'Order Ahead'}</p>
          {formData.preferredTime && (
            <p><span className="text-muted-foreground">Time:</span> {formData.preferredTime}</p>
          )}
          {formData.notes && (
            <p><span className="text-muted-foreground">Notes:</span> {formData.notes}</p>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mt-6">
        A confirmation has been sent to {formData.email}
      </p>
    </div>
  );
};

export default OrderSystem;
