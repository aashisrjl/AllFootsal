import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, RefreshCw, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';

type SubscriptionPlan = 'trial' | 'monthly' | 'half-yearly' | 'yearly';
type PaymentMethod = 'esewa' | 'khalti' | 'cash' | 'bank_transfer';

interface SubscriptionResponse {
  id: number;
  subscription_plan: SubscriptionPlan;
  subscription_start: string;
  subscription_end: string;
  subscription_fee: number;
  status: string;
  is_trial: boolean;
}

interface PaymentResponse {
  id: number;
  amount: number;
  payment_method: PaymentMethod;
  payment_status: string;
  transaction_id: string;
  remarks?: string;
  createdAt: string;
}

interface CreatePaymentRes {
  success: boolean;
  paymentGateway?: 'esewa' | 'khalti';
  data: PaymentResponse;
  payment_url?: string;
  pidx?: string;
  esewaConfig?: Record<string, string | number>;
}

interface PendingPaymentCache {
  transaction_uuid: string;
  payment_method: PaymentMethod;
  pidx?: string;
}

const ESEWA_GATEWAY_URL = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
const PENDING_KEY = 'futsal_pending_subscription_payment';

const planOptions: Array<{ plan: SubscriptionPlan; label: string; price: string }> = [
  { plan: 'trial', label: 'Trial', price: 'Free for 14 days' },
  { plan: 'monthly', label: 'Monthly', price: 'Rs 1,500 / month' },
  { plan: 'half-yearly', label: 'Half-yearly', price: 'Rs 8,400 / 6 months' },
  { plan: 'yearly', label: 'Yearly', price: 'Rs 15,000 / year' },
];

const Subscription = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('monthly');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const hasAutoSelectedPlan = useRef(false);

  const canPay = useMemo(() => {
    if (!subscription) return false;
    if (subscription.subscription_plan === 'trial') return false;
    return subscription.status === 'pending' && Number(subscription.subscription_fee) > 0;
  }, [subscription]);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      setError('');

      const [subscriptionRes, paymentsRes] = await Promise.all([
        api.get('/subscription').catch((err) => {
          if (err?.response?.status === 404) {
            return { data: { success: false, data: null } };
          }
          throw err;
        }),
        api.get('/futsal/payment').catch(() => ({ data: { data: [] } })),
      ]);

      if (subscriptionRes?.data?.success) {
        setSubscription(subscriptionRes.data.data as SubscriptionResponse);
      } else {
        setSubscription(null);
      }

      const paymentList = (paymentsRes?.data?.data || []) as PaymentResponse[];
      setPayments(paymentList);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to load subscription data';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const savePendingPayment = (payload: PendingPaymentCache) => {
    localStorage.setItem(PENDING_KEY, JSON.stringify(payload));
  };

  const getPendingPayment = (): PendingPaymentCache | null => {
    const value = localStorage.getItem(PENDING_KEY);
    if (!value) return null;
    try {
      return JSON.parse(value) as PendingPaymentCache;
    } catch {
      return null;
    }
  };

  const clearPendingPayment = () => {
    localStorage.removeItem(PENDING_KEY);
  };

  const submitEsewaForm = (esewaConfig: Record<string, string | number>) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = ESEWA_GATEWAY_URL;

    Object.entries(esewaConfig).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const handleCreateSubscription = async (plan: SubscriptionPlan) => {
    try {
      setActionLoading(true);
      setError('');
      setMessage('');

      const res = await api.post('/subscription/create', { subscription_plan: plan });
      if (res?.data?.success) {
        setSubscription(res.data.data as SubscriptionResponse);
        setMessage(
          plan === 'trial'
            ? 'Trial activated successfully.'
            : 'Subscription created. Complete payment to activate it.'
        );
      }

      await loadSubscriptionData();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to create subscription';
      setError(errMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const verifyManualPayment = async (method: PaymentMethod, transactionId: string) => {
    await api.post('/futsal/payment-verify', {
      payment_method: method,
      transaction_uuid: transactionId,
      status: 'completed',
    });
  };

  const handleInitiatePayment = async (method: PaymentMethod) => {
    try {
      setActionLoading(true);
      setError('');
      setMessage('');

      const res = await api.post('/futsal/payment-create', {
        payment_method: method,
      });

      const payload = res.data as CreatePaymentRes;
      const transactionId = payload?.data?.transaction_id;

      if (!transactionId) {
        throw new Error('Transaction id missing from payment response');
      }

      if (method === 'khalti' && payload.payment_url) {
        savePendingPayment({
          transaction_uuid: transactionId,
          payment_method: method,
          pidx: payload.pidx,
        });
        window.location.href = payload.payment_url;
        return;
      }

      if (method === 'esewa' && payload.esewaConfig) {
        savePendingPayment({ transaction_uuid: transactionId, payment_method: method });
        submitEsewaForm(payload.esewaConfig);
        return;
      }

      if (method === 'cash' || method === 'bank_transfer') {
        await verifyManualPayment(method, transactionId);
        setMessage('Manual payment marked completed and subscription activated.');
      }

      await loadSubscriptionData();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to initiate payment';
      setError(errMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const verifyGatewayReturn = async () => {
    const params = new URLSearchParams(location.search);
    const paymentMethod = (params.get('payment_method') || '') as PaymentMethod;
    const path = location.pathname;

    if (path !== '/payment/success' && path !== '/payment/failure') {
      return;
    }

    if (path === '/payment/failure') {
      setError('Payment failed or cancelled. Please try again.');
      return;
    }

    try {
      setActionLoading(true);
      const pending = getPendingPayment();

      if (paymentMethod === 'esewa') {
        const data = params.get('data');
        if (!data) {
          throw new Error('Missing eSewa payload for verification');
        }

        await api.post('/futsal/payment-verify', {
          payment_method: 'esewa',
          data,
        });
      } else {
        const pidx = params.get('pidx') || pending?.pidx;
        const transaction_uuid = params.get('transaction_uuid') || pending?.transaction_uuid;

        if (!pidx || !transaction_uuid) {
          throw new Error('Missing Khalti verification details');
        }

        await api.post('/futsal/payment-verify', {
          payment_method: 'khalti',
          pidx,
          transaction_uuid,
        });
      }

      clearPendingPayment();
      setMessage('Payment verified and subscription activated successfully.');
      await loadSubscriptionData();
      navigate('/subscription', { replace: true });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Payment verification failed';
      setError(errMsg);
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    void loadSubscriptionData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const plan = params.get('plan');

    if (!plan || hasAutoSelectedPlan.current) {
      return;
    }

    if (plan === 'trial' || plan === 'monthly' || plan === 'half-yearly' || plan === 'yearly') {
      hasAutoSelectedPlan.current = true;
      setSelectedPlan(plan);
      void handleCreateSubscription(plan);
    }
  }, [location.search]);

  useEffect(() => {
    void verifyGatewayReturn();
  }, [location.pathname, location.search]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">Subscription & Payments</h1>
          <p className="text-app-muted mt-1 text-sm font-medium">Manage your futsal subscription and complete payments securely.</p>
        </div>
        <button
          onClick={() => void loadSubscriptionData()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-app-surface-solid border border-app-border-subtle rounded-xl text-sm font-semibold text-app-text hover:border-slate-500"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {message ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</div>
      ) : null}
      {error ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>
      ) : null}

      <div className="bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-app-heading mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Choose a Plan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {planOptions.map((option) => {
            const active = selectedPlan === option.plan;
            return (
              <button
                key={option.plan}
                onClick={() => setSelectedPlan(option.plan)}
                className={`text-left rounded-xl p-4 border transition-all ${
                  active
                    ? 'border-emerald-500/60 bg-emerald-500/10'
                    : 'border-app-border-subtle bg-app-surface-solid hover:border-emerald-500/30'
                }`}
              >
                <p className="text-sm font-bold text-app-heading capitalize">{option.label}</p>
                <p className="text-xs text-app-muted mt-1">{option.price}</p>
              </button>
            );
          })}
        </div>
        <div className="mt-4">
          <button
            disabled={actionLoading}
            onClick={() => void handleCreateSubscription(selectedPlan)}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-bold rounded-xl"
          >
            {actionLoading ? 'Processing...' : 'Create / Update Subscription'}
          </button>
        </div>
      </div>

      <div className="bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-app-heading mb-4">Current Subscription</h2>
        {loading ? (
          <p className="text-app-muted text-sm">Loading subscription...</p>
        ) : subscription ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="rounded-xl bg-app-surface-solid border border-app-border-subtle p-4">
              <p className="text-[11px] uppercase tracking-widest text-slate-500">Plan</p>
              <p className="text-app-heading font-bold capitalize">{subscription.subscription_plan}</p>
            </div>
            <div className="rounded-xl bg-app-surface-solid border border-app-border-subtle p-4">
              <p className="text-[11px] uppercase tracking-widest text-slate-500">Status</p>
              <p className="text-app-heading font-bold capitalize">{subscription.status}</p>
            </div>
            <div className="rounded-xl bg-app-surface-solid border border-app-border-subtle p-4">
              <p className="text-[11px] uppercase tracking-widest text-slate-500">Fee</p>
              <p className="text-app-heading font-bold">Rs {Number(subscription.subscription_fee || 0).toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-app-surface-solid border border-app-border-subtle p-4">
              <p className="text-[11px] uppercase tracking-widest text-slate-500">Valid Till</p>
              <p className="text-app-heading font-bold">{new Date(subscription.subscription_end).toLocaleDateString()}</p>
            </div>
          </div>
        ) : (
          <p className="text-app-muted text-sm">No subscription found. Create one from the section above.</p>
        )}
      </div>

      <div className="bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-app-heading mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-400" />
          Complete Payment
        </h2>
        <p className="text-sm text-app-muted mb-4">
          Choose a method below. Online payments redirect to gateway and return here for verification.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {(['khalti', 'esewa', 'cash', 'bank_transfer'] as PaymentMethod[]).map((method) => (
            <button
              key={method}
              disabled={!canPay || actionLoading}
              onClick={() => void handleInitiatePayment(method)}
              className="px-4 py-3 rounded-xl border border-app-border-subtle bg-app-surface-solid text-app-heading font-semibold capitalize disabled:opacity-40 hover:border-emerald-500/40 hover:bg-emerald-500/5"
            >
              Pay with {method.replace('_', ' ')}
            </button>
          ))}
        </div>
        {!canPay ? (
          <p className="text-xs text-amber-300 mt-3">Payment is available when a paid subscription is in pending status.</p>
        ) : null}
      </div>

      <div className="bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-app-heading mb-4">Recent Payments</h2>
        {payments.length === 0 ? (
          <p className="text-app-muted text-sm">No payments found yet.</p>
        ) : (
          <div className="space-y-3">
            {payments.slice(0, 6).map((payment) => (
              <div key={payment.id} className="rounded-xl border border-app-border-subtle bg-app-surface-solid p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-app-heading font-semibold">Rs {Number(payment.amount).toLocaleString()}</p>
                  <p className="text-xs text-slate-400">
                    {payment.payment_method} • {new Date(payment.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold capitalize text-app-text">{payment.payment_status}</p>
                  <p className="text-xs text-slate-500">{payment.transaction_id}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscription;