import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

const ORDER_DRAFT_KEY = 'cherish_order_draft';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      // Chapa may return tx_ref or trx_ref
      const txRef = searchParams.get('tx_ref') || searchParams.get('trx_ref');
      
      if (!txRef) {
        setError('No transaction reference found');
        setVerifying(false);
        return;
      }

      try {
        const response = await fetch('/.netlify/functions/chapa-verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tx_ref: txRef })
        });

        const data = await response.json();
        console.log('Verification result:', data);

        if (data.verified) {
          setVerified(true);
          // Update localStorage to mark payment as completed
          const savedDraft = localStorage.getItem(ORDER_DRAFT_KEY);
          if (savedDraft) {
            const draft = JSON.parse(savedDraft);
            draft.paymentCompleted = true;
            draft.tx_ref = txRef;
            draft.verifiedAt = Date.now();
            localStorage.setItem(ORDER_DRAFT_KEY, JSON.stringify(draft));
          }
        } else {
          setError(data.message || 'Payment could not be verified');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError('Verification failed. Please contact us if payment was deducted.');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        {verifying ? (
          <>
            <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin" />
            <h1 className="text-2xl font-serif font-bold">Verifying Payment...</h1>
            <p className="text-muted-foreground">Please wait while we confirm your payment with Chapa.</p>
          </>
        ) : verified ? (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-serif font-bold text-green-600">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Your payment has been confirmed. Click below to complete your order.
            </p>
            <button
              onClick={handleContinue}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Complete Your Order
            </button>
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-serif font-bold text-destructive">Payment Issue</h1>
            <p className="text-muted-foreground">{error}</p>
            <p className="text-sm text-muted-foreground">
              If your payment was deducted, please contact us at cherchiscafeandbook@gmail.com
            </p>
            <button
              onClick={handleContinue}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Return to Site
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
