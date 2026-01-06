import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <XCircle className="w-16 h-16 text-amber-500 mx-auto" />
        <h1 className="text-2xl font-serif font-bold">Payment Cancelled</h1>
        <p className="text-muted-foreground">
          Your payment was cancelled. Your order has been saved — you can try again or choose to pay at the café.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          Return to Order
        </button>
      </div>
    </div>
  );
};

export default PaymentCancel;
