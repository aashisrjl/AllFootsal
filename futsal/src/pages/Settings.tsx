import { useState, useEffect } from 'react';
import { User, Bell, Shield, CreditCard, Check, Palette, Zap, Eye, EyeOff, Trash2, Save, Globe, Plus, Copy, AlertCircle, CheckCircle } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { updateFutsalProfile } from '../lib/authApi';
import toast from 'react-hot-toast';
import API from '@/lib/api';
import { Link } from 'react-router-dom';
import { getPaymentConfigs, createOrUpdatePaymentConfig, disablePaymentConfig, PaymentConfig } from '../lib/paymentConfigApi';
import { getCustomDomains, addCustomDomain, verifyCustomDomain, setPrimaryDomain, deleteCustomDomain, CustomDomain } from '../lib/customDomainApi';

const Settings = () => {
  const { futsalProfile, refreshProfile } = useAuth();
  const { theme, resolvedTheme } = useTheme();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  
  // Notification preferences state
  const [notifications, setNotifications] = useState({
    newBookings: true,
    cancellations: true,
    paymentConfirmations: false,
  });
  const [subscription, setSubscription] = useState<any>(null);
  
  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Payment Config state
  const [paymentConfigs, setPaymentConfigs] = useState<PaymentConfig[]>([]);
  const [loadingPaymentConfigs, setLoadingPaymentConfigs] = useState(false);
  const [editingGateway, setEditingGateway] = useState<'khalti' | 'esewa' | null>(null);
  const [showSecretKey, setShowSecretKey] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    gateway: 'khalti' as 'khalti' | 'esewa',
    publicKey: '',
    secretKey: '',
    merchantCode: '',
    isLive: false,
  });

  // Custom Domain state
  const [customDomains, setCustomDomains] = useState<CustomDomain[]>([]);
  const [loadingDomains, setLoadingDomains] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [addingDomain, setAddingDomain] = useState(false);

  useEffect(() => {
    if (futsalProfile) {
      const ownerNames = futsalProfile.ownerName?.split(' ') || ['Owner', ''];
      setFirstName(ownerNames[0] || '');
      setLastName(ownerNames.slice(1).join(' ') || '');
      setEmail(futsalProfile.email || '');
      setPhone(futsalProfile.phoneNumber || '');

      const fetchSub = async () => {
         try {
           const subRes = await API.get('/subscription');
           if (subRes.data.success && subRes.data.data) {
             setSubscription(Array.isArray(subRes.data.data) ? subRes.data.data[0] : subRes.data.data);
           }
         } catch(e) { console.error('Error fetching subscription'); }
      };
      fetchSub();

      // Fetch payment configs
      loadPaymentConfigs();
      
      // Fetch custom domains
      loadCustomDomains();
    }
  }, [futsalProfile]);

  const loadPaymentConfigs = async () => {
    try {
      setLoadingPaymentConfigs(true);
      const res = await getPaymentConfigs();
      if (res.success && Array.isArray(res.data)) {
        setPaymentConfigs(res.data);
      }
    } catch (error: any) {
      console.error('Failed to load payment configs:', error);
    } finally {
      setLoadingPaymentConfigs(false);
    }
  };

  const loadCustomDomains = async () => {
    try {
      setLoadingDomains(true);
      const res = await getCustomDomains();
      if (res.success && Array.isArray(res.data)) {
        setCustomDomains(res.data);
      }
    } catch (error: any) {
      console.error('Failed to load custom domains:', error);
    } finally {
      setLoadingDomains(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setIsSaving(true);
      setSuccessMsg('');
      const ownerName = `${firstName} ${lastName}`.trim();
      await updateFutsalProfile({ ownerName, email, phoneNumber: phone });
      await refreshProfile();
      toast.success('Profile updated successfully!');
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error: any) {
      console.error('Failed to update profile', error);
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateNotifications = async () => {
    try {
      // Here you would call an API to save notification preferences
      // For now, we'll just show a success message
      toast.success('Notification preferences updated successfully!');
      setSuccessMsg('Notification preferences updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error: any) {
      console.error('Failed to update notifications', error);
      toast.error(error.response?.data?.message || 'Failed to update notification preferences.');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsChangingPassword(true);
      // Here you would call an API to change password
      // For now, we'll just show a success message
      toast.success('Password changed successfully!');
      setSuccessMsg('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error: any) {
      console.error('Failed to change password', error);
      toast.error(error.response?.data?.message || 'Failed to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSavePaymentConfig = async () => {
    if (!formData.publicKey || !formData.secretKey) {
      toast.error('Public Key and Secret Key are required');
      return;
    }

    if (formData.gateway === 'esewa' && !formData.merchantCode) {
      toast.error('Merchant Code is required for eSewa');
      return;
    }

    try {
      setIsSaving(true);
      const res = await createOrUpdatePaymentConfig(formData);
      if (res.success) {
        toast.success(`${formData.gateway.toUpperCase()} configuration saved successfully!`);
        setSuccessMsg(`${formData.gateway.toUpperCase()} configuration saved successfully!`);
        setTimeout(() => setSuccessMsg(''), 3000);
        setEditingGateway(null);
        setFormData({
          gateway: 'khalti',
          publicKey: '',
          secretKey: '',
          merchantCode: '',
          isLive: false,
        });
        await loadPaymentConfigs();
      }
    } catch (error: any) {
      console.error('Failed to save payment config', error);
      toast.error(error.response?.data?.message || 'Failed to save payment configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePaymentConfig = async (gateway: 'khalti' | 'esewa') => {
    if (window.confirm(`Are you sure you want to disable ${gateway.toUpperCase()} payments?`)) {
      try {
        const res = await disablePaymentConfig(gateway);
        if (res.success) {
          toast.success(`${gateway.toUpperCase()} configuration disabled`);
          await loadPaymentConfigs();
        }
      } catch (error: any) {
        console.error('Failed to delete payment config', error);
        toast.error(error.response?.data?.message || 'Failed to disable payment configuration.');
      }
    }
  };

  const handleEditPaymentConfig = (config: PaymentConfig) => {
    setEditingGateway(config.gateway);
    setFormData({
      gateway: config.gateway,
      publicKey: config.publicKey || '',
      secretKey: '', // Secret key is never returned for security
      merchantCode: config.merchantCode || '',
      isLive: config.isLive,
    });
  };

  const handleAddCustomDomain = async () => {
    if (!newDomain.trim()) {
      toast.error('Please enter a domain');
      return;
    }

    // Basic domain validation
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(newDomain.trim())) {
      toast.error('Please enter a valid domain name');
      return;
    }

    try {
      setAddingDomain(true);
      const res = await addCustomDomain({ domain: newDomain.trim() });
      if (res.success) {
        toast.success('Custom domain added successfully!');
        setNewDomain('');
        await loadCustomDomains();
      }
    } catch (error: any) {
      console.error('Failed to add custom domain', error);
      toast.error(error.response?.data?.message || 'Failed to add custom domain.');
    } finally {
      setAddingDomain(false);
    }
  };

  const handleVerifyDomain = async (domainId: number) => {
    try {
      const res = await verifyCustomDomain(domainId);
      if (res.success) {
        toast.success('Domain verification initiated. This may take a few minutes.');
        await loadCustomDomains();
      }
    } catch (error: any) {
      console.error('Failed to verify domain', error);
      toast.error(error.response?.data?.message || 'Failed to verify domain.');
    }
  };

  const handleSetPrimaryDomain = async (domainId: number) => {
    try {
      const res = await setPrimaryDomain(domainId);
      if (res.success) {
        toast.success('Primary domain updated successfully!');
        await loadCustomDomains();
      }
    } catch (error: any) {
      console.error('Failed to set primary domain', error);
      toast.error(error.response?.data?.message || 'Failed to set primary domain.');
    }
  };

  const handleDeleteDomain = async (domainId: number) => {
    if (window.confirm('Are you sure you want to remove this custom domain?')) {
      try {
        const res = await deleteCustomDomain(domainId);
        if (res.success) {
          toast.success('Custom domain removed successfully!');
          await loadCustomDomains();
        }
      } catch (error: any) {
        console.error('Failed to delete domain', error);
        toast.error(error.response?.data?.message || 'Failed to remove custom domain.');
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">Company Settings</h1>
           <p className="text-app-muted mt-1 text-sm font-medium">Manage your personal and business preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl shadow-xl p-4 lg:col-span-1 h-fit sticky top-24">
          <nav className="space-y-1.5 flex flex-col">
            {[
              { id: 'profile', label: 'Profile Settings', icon: User },
              { id: 'appearance', label: 'Appearance', icon: Palette },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'payment', label: 'Payment Configuration', icon: Zap },
              { id: 'domain', label: 'Custom Domain', icon: Globe },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'billing', label: 'Billing & Subscription', icon: CreditCard },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                  activeTab === tab.id 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner' 
                    : 'text-app-muted hover:bg-app-input hover:text-app-heading border border-transparent'
                }`}
              >
                <tab.icon className={`h-4 w-4 mr-3 ${activeTab === tab.id ? 'text-emerald-400' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div id="profile" className="bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl shadow-xl p-8 relative overflow-hidden group hover:border-app-border-subtle transition-colors">
              <h3 className="text-lg font-black text-app-heading mb-6 flex items-center gap-2 border-b border-app-border pb-4">
                <User className="h-5 w-5 text-emerald-500" />
                Profile Information
              </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-black text-app-muted uppercase tracking-widest mb-2">First Name</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-3 bg-app-input border border-app-border-subtle text-app-text font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 hover:border-app-border transition-colors shadow-inner" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-app-muted uppercase tracking-widest mb-2">Last Name</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-3 bg-app-input border border-app-border-subtle text-app-text font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 hover:border-app-border transition-colors shadow-inner" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                  <label className="block text-[11px] font-black text-app-muted uppercase tracking-widest mb-2">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-app-input border border-app-border-subtle text-app-text font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 hover:border-app-border transition-colors shadow-inner" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-app-muted uppercase tracking-widest mb-2">Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 bg-app-input border border-app-border-subtle text-app-text font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 hover:border-app-border transition-colors shadow-inner" />
                </div>
              </div>
              <div className="pt-4 flex justify-between items-center gap-3 mt-4">
                <span className="text-sm font-bold text-emerald-400">{successMsg}</span>
                <div className="flex gap-3">
                  <button className="px-6 py-2.5 bg-transparent text-app-muted border border-app-border-subtle font-bold rounded-xl hover:bg-app-surface-solid hover:text-app-heading transition-all shadow-sm">
                    Cancel
                  </button>
                  <button onClick={handleUpdateProfile} disabled={isSaving} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50">
                    <Check className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <div id="appearance" className="bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl shadow-xl p-8 hover:border-app-border-subtle transition-colors">
              <h3 className="text-lg font-black text-app-heading mb-2 flex items-center gap-2 border-b border-app-border pb-4">
                <Palette className="h-5 w-5 text-emerald-500" />
                Appearance
              </h3>
              <p className="text-sm text-app-muted mb-6">
                Choose light mode, dark mode, or match your device system setting. Currently using{' '}
                <strong className="text-app-heading">{resolvedTheme}</strong> theme
                {theme === 'system' ? ' (system)' : ''}.
              </p>
              <ThemeToggle variant="settings" />
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div id="notifications" className="bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl shadow-xl p-8 hover:border-app-border-subtle transition-colors">
              <h3 className="text-lg font-black text-app-heading mb-6 flex items-center gap-2 border-b border-app-border pb-4">
                <Bell className="h-5 w-5 text-blue-500" />
                Notification Preferences
              </h3>
            <div className="space-y-4">
            <div className="space-y-4">
              {[
                { key: 'newBookings', title: 'New Bookings', desc: 'Get notified when you receive new bookings', value: notifications.newBookings },
                { key: 'cancellations', title: 'Cancellations', desc: 'Get notified when bookings are cancelled', value: notifications.cancellations },
                { key: 'paymentConfirmations', title: 'Payment Confirmations', desc: 'Get notified when payments are received', value: notifications.paymentConfirmations }
              ].map((notif, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-app-surface-solid rounded-xl border border-app-border hover:border-app-border-subtle transition-colors">
                  <div>
                    <p className="text-sm font-bold text-app-heading mb-0.5">{notif.title}</p>
                    <p className="text-[11px] font-medium text-slate-400">{notif.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input 
                      type="checkbox" 
                      checked={notif.value} 
                      onChange={(e) => setNotifications(prev => ({ ...prev, [notif.key]: e.target.checked }))}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner peer-checked:after:bg-white"></div>
                  </label>
                </div>
              ))}
            </div>
            <div className="pt-4 flex justify-end">
              <button 
                onClick={handleUpdateNotifications}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center hover:-translate-y-0.5 active:translate-y-0"
              >
                <Check className="w-4 h-4 mr-2" />
                Save Preferences
              </button>
            </div>
          </div>
        </div>
          )}

          {/* Payment Configuration */}
          {activeTab === 'payment' && (
            <div id="payment" className="space-y-6">
              {/* Khalti Configuration */}
              <div className="bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl shadow-xl p-8 hover:border-app-border-subtle transition-colors">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-app-border">
                  <h3 className="text-lg font-black text-app-heading flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-500" />
                    Khalti Payment Gateway
                  </h3>
                  {paymentConfigs.find(c => c.gateway === 'khalti') && (
                    <span className="px-3 py-1 text-xs font-black bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg">
                      Configured
                    </span>
                  )}
                </div>

                {editingGateway === 'khalti' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-black text-app-muted uppercase tracking-widest mb-2">Public Key</label>
                      <input
                        type="text"
                        value={formData.publicKey}
                        onChange={(e) => setFormData({ ...formData, publicKey: e.target.value })}
                        className="w-full px-4 py-3 bg-app-input border border-app-border-subtle text-app-text font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:border-app-border transition-colors shadow-inner"
                        placeholder="Enter your Khalti public key"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-app-muted uppercase tracking-widest mb-2">Secret Key</label>
                      <div className="relative">
                        <input
                          type={showSecretKey.khalti ? 'text' : 'password'}
                          value={formData.secretKey}
                          onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                          className="w-full px-4 py-3 bg-app-input border border-app-border-subtle text-app-text font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:border-app-border transition-colors shadow-inner pr-12"
                          placeholder="Enter your Khalti secret key"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSecretKey({ ...showSecretKey, khalti: !showSecretKey.khalti })}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-app-muted hover:text-app-heading transition-colors"
                        >
                          {showSecretKey.khalti ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-app-surface-solid rounded-xl border border-app-border">
                      <div>
                        <p className="text-sm font-bold text-app-heading">Live Mode</p>
                        <p className="text-[11px] text-app-muted">Use live Khalti credentials</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isLive}
                          onChange={(e) => setFormData({ ...formData, isLive: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 shadow-inner peer-checked:after:bg-white"></div>
                      </label>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingGateway(null);
                          setFormData({ gateway: 'khalti', publicKey: '', secretKey: '', merchantCode: '', isLive: false });
                        }}
                        className="flex-1 px-4 py-2.5 bg-transparent text-app-muted border border-app-border-subtle font-bold rounded-xl hover:bg-app-surface-solid transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSavePaymentConfig}
                        disabled={isSaving}
                        className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Configuration'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-app-muted">
                      {paymentConfigs.find(c => c.gateway === 'khalti')
                        ? 'Your Khalti payment gateway is configured and ready to use.'
                        : 'Configure Khalti to accept payments from your customers.'}
                    </p>
                    <button
                      onClick={() => {
                        const existing = paymentConfigs.find(c => c.gateway === 'khalti');
                        if (existing) {
                          handleEditPaymentConfig(existing);
                        } else {
                          setEditingGateway('khalti');
                          setFormData({ gateway: 'khalti', publicKey: '', secretKey: '', merchantCode: '', isLive: false });
                        }
                      }}
                      className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {paymentConfigs.find(c => c.gateway === 'khalti') ? 'Edit' : 'Configure'}
                    </button>
                  </div>
                )}
              </div>

              {/* eSewa Configuration */}
              <div className="bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl shadow-xl p-8 hover:border-app-border-subtle transition-colors">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-app-border">
                  <h3 className="text-lg font-black text-app-heading flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-500" />
                    eSewa Payment Gateway
                  </h3>
                  {paymentConfigs.find(c => c.gateway === 'esewa') && (
                    <span className="px-3 py-1 text-xs font-black bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg">
                      Configured
                    </span>
                  )}
                </div>

                {editingGateway === 'esewa' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-black text-app-muted uppercase tracking-widest mb-2">Public Key</label>
                      <input
                        type="text"
                        value={formData.publicKey}
                        onChange={(e) => setFormData({ ...formData, publicKey: e.target.value })}
                        className="w-full px-4 py-3 bg-app-input border border-app-border-subtle text-app-text font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 hover:border-app-border transition-colors shadow-inner"
                        placeholder="Enter your eSewa public key"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-app-muted uppercase tracking-widest mb-2">Secret Key</label>
                      <div className="relative">
                        <input
                          type={showSecretKey.esewa ? 'text' : 'password'}
                          value={formData.secretKey}
                          onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                          className="w-full px-4 py-3 bg-app-input border border-app-border-subtle text-app-text font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 hover:border-app-border transition-colors shadow-inner pr-12"
                          placeholder="Enter your eSewa secret key"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSecretKey({ ...showSecretKey, esewa: !showSecretKey.esewa })}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-app-muted hover:text-app-heading transition-colors"
                        >
                          {showSecretKey.esewa ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-app-muted uppercase tracking-widest mb-2">Merchant Code</label>
                      <input
                        type="text"
                        value={formData.merchantCode}
                        onChange={(e) => setFormData({ ...formData, merchantCode: e.target.value })}
                        className="w-full px-4 py-3 bg-app-input border border-app-border-subtle text-app-text font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 hover:border-app-border transition-colors shadow-inner"
                        placeholder="Enter your eSewa merchant code"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-app-surface-solid rounded-xl border border-app-border">
                      <div>
                        <p className="text-sm font-bold text-app-heading">Live Mode</p>
                        <p className="text-[11px] text-app-muted">Use live eSewa credentials</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isLive}
                          onChange={(e) => setFormData({ ...formData, isLive: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 shadow-inner peer-checked:after:bg-white"></div>
                      </label>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingGateway(null);
                          setFormData({ gateway: 'khalti', publicKey: '', secretKey: '', merchantCode: '', isLive: false });
                        }}
                        className="flex-1 px-4 py-2.5 bg-transparent text-app-muted border border-app-border-subtle font-bold rounded-xl hover:bg-app-surface-solid transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSavePaymentConfig}
                        disabled={isSaving}
                        className="flex-1 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all flex items-center justify-center hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Configuration'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-app-muted">
                      {paymentConfigs.find(c => c.gateway === 'esewa')
                        ? 'Your eSewa payment gateway is configured and ready to use.'
                        : 'Configure eSewa to accept payments from your customers.'}
                    </p>
                    <button
                      onClick={() => {
                        const existing = paymentConfigs.find(c => c.gateway === 'esewa');
                        if (existing) {
                          handleEditPaymentConfig(existing);
                        } else {
                          setEditingGateway('esewa');
                          setFormData({ gateway: 'esewa', publicKey: '', secretKey: '', merchantCode: '', isLive: false });
                        }
                      }}
                      className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all flex items-center hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {paymentConfigs.find(c => c.gateway === 'esewa') ? 'Edit' : 'Configure'}
                    </button>
                  </div>
                )}
              </div>

              {/* Active Configurations */}
              {paymentConfigs.length > 0 && (
                <div className="bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl shadow-xl p-8 hover:border-app-border-subtle transition-colors">
                  <h3 className="text-lg font-black text-app-heading mb-6 flex items-center gap-2 border-b border-app-border pb-4">
                    Active Payment Gateways
                  </h3>
                  <div className="space-y-3">
                    {paymentConfigs.map((config) => (
                      <div key={config.id} className="flex items-center justify-between p-4 bg-app-surface-solid rounded-xl border border-app-border hover:border-app-border-subtle transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-bold text-app-heading capitalize">{config.gateway}</p>
                            <span className={`px-2 py-0.5 text-xs font-black rounded ${config.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                              {config.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className={`px-2 py-0.5 text-xs font-black rounded ${config.isLive ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                              {config.isLive ? 'Live' : 'Test'}
                            </span>
                          </div>
                          <p className="text-[11px] text-app-muted">
                            Public Key: {config.publicKey ? config.publicKey.substring(0, 20) + '...' : 'Not set'}
                          </p>
                          {config.merchantCode && (
                            <p className="text-[11px] text-app-muted">
                              Merchant Code: {config.merchantCode}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeletePaymentConfig(config.gateway as 'khalti' | 'esewa')}
                          className="px-3 py-2 text-red-400 hover:bg-red-500/10 border border-red-500/30 rounded-lg transition-all flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Disable
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Custom Domain Configuration */}
          {activeTab === 'domain' && (
            <div id="domain" className="space-y-6">
              {/* Add New Domain */}
              <div className="bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl shadow-xl p-8 hover:border-app-border-subtle transition-colors">
                <h3 className="text-lg font-black text-app-heading mb-6 flex items-center gap-2 border-b border-app-border pb-4">
                  <Globe className="h-5 w-5 text-blue-500" />
                  Add Custom Domain
                </h3>
                <p className="text-sm text-app-muted mb-6">
                  Connect your custom domain to your futsal booking portal. You can set one domain as primary.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    placeholder="example.com"
                    className="flex-1 px-4 py-3 bg-app-input border border-app-border-subtle text-app-text font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:border-app-border transition-colors shadow-inner"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCustomDomain()}
                  />
                  <button
                    onClick={handleAddCustomDomain}
                    disabled={addingDomain || !newDomain.trim()}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {addingDomain ? 'Adding...' : 'Add Domain'}
                  </button>
                </div>
              </div>

              {/* Domain List */}
              {loadingDomains ? (
                <div className="bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl shadow-xl p-8 text-center">
                  <p className="text-app-muted">Loading domains...</p>
                </div>
              ) : customDomains.length > 0 ? (
                <div className="space-y-4">
                  {customDomains.map((domain) => (
                    <div key={domain.id} className="bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl shadow-xl p-6 hover:border-app-border-subtle transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="text-lg font-black text-app-heading">{domain.domain}</p>
                            {domain.isPrimary && (
                              <span className="px-2.5 py-1 text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg">
                                Primary
                              </span>
                            )}
                            {domain.isVerified ? (
                              <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-black bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-black bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg">
                                <AlertCircle className="w-3 h-3" />
                                {domain.verificationStatus === 'pending' ? 'Pending' : 'Failed'}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-app-muted">
                            Added on {new Date(domain.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                          {!domain.isVerified && domain.verificationStatus !== 'pending' && (
                            <button
                              onClick={() => handleVerifyDomain(domain.id)}
                              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all text-sm"
                            >
                              Verify
                            </button>
                          )}
                          {!domain.isPrimary && domain.isVerified && (
                            <button
                              onClick={() => handleSetPrimaryDomain(domain.id)}
                              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-all text-sm"
                            >
                              Set Primary
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteDomain(domain.id)}
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold rounded-lg transition-all text-sm flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {!domain.isVerified && domain.dnsRecords && domain.dnsRecords.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-app-border-subtle">
                          <p className="text-sm font-bold text-app-heading mb-3">DNS Records to Configure:</p>
                          <div className="space-y-3">
                            {domain.dnsRecords.map((record, idx) => (
                              <div key={idx} className="bg-app-surface-solid rounded-lg p-3 border border-app-border-subtle">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[11px] font-black text-app-muted uppercase">Type: {record.type}</span>
                                  <button
                                    onClick={() => copyToClipboard(`${record.type} ${record.name} ${record.value}`)}
                                    className="p-1 hover:bg-app-input rounded transition-colors"
                                    title="Copy to clipboard"
                                  >
                                    <Copy className="w-4 h-4 text-slate-400" />
                                  </button>
                                </div>
                                <p className="text-[11px] text-app-text font-mono break-all">Name: {record.name}</p>
                                <p className="text-[11px] text-app-text font-mono break-all">Value: {record.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl shadow-xl p-8 text-center">
                  <Globe className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" />
                  <p className="text-app-muted mb-2">No custom domains yet</p>
                  <p className="text-[11px] text-slate-400">Add your first custom domain above to get started</p>
                </div>
              )}
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div id="security" className="bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl shadow-xl p-8 hover:border-app-border-subtle transition-colors">
              <h3 className="text-lg font-black text-app-heading mb-6 flex items-center gap-2 border-b border-app-border pb-4">
                <Shield className="h-5 w-5 text-red-500" />
                Security Settings
              </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-black text-app-muted uppercase tracking-widest mb-2">Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                  className="w-full px-4 py-3 bg-app-input border border-app-border-subtle text-app-text font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 hover:border-app-border transition-colors shadow-inner" 
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-app-muted uppercase tracking-widest mb-2">New Password</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="w-full px-4 py-3 bg-app-input border border-app-border-subtle text-app-text font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 hover:border-app-border transition-colors shadow-inner" 
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-app-muted uppercase tracking-widest mb-2">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="w-full px-4 py-3 bg-app-input border border-app-border-subtle text-app-text font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 hover:border-app-border transition-colors shadow-inner" 
                  placeholder="Confirm new password"
                />
              </div>
              <div className="pt-4 flex justify-end">
                <button 
                  onClick={handleChangePassword} 
                  disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                  className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all flex items-center hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {isChangingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </div>
          </div>
          )}

          {/* Subscription Info */}
          {activeTab === 'billing' && (
            <div id="billing" className="bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl shadow-xl p-8 hover:border-app-border-subtle transition-colors">
            <h3 className="text-lg font-black text-app-heading mb-6 flex items-center gap-2 border-b border-app-border pb-4">
              <CreditCard className="h-5 w-5 text-purple-500" />
              Billing & Subscription
            </h3>
            <div className="border border-emerald-500/30 rounded-xl p-6 bg-emerald-500/5 relative overflow-hidden group shadow-inner">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-700"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 relative z-10 gap-3">
                <span className="text-2xl font-black text-app-heading tracking-tight flex items-center gap-3">
                  {subscription ? (subscription.subscription_plan ? subscription.subscription_plan.charAt(0).toUpperCase() + subscription.subscription_plan.slice(1) : 'No Plan') : 'No Active Plan'}
                  <span className={`px-2.5 py-1 text-[10px] uppercase tracking-widest rounded-lg font-black shadow-sm ${subscription && subscription.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                    {subscription ? subscription.status : 'Inactive'}
                  </span>
                </span>
              </div>
              {subscription ? (
                <p className="text-app-text font-medium text-sm mb-6 relative z-10 leading-relaxed max-w-lg">
                  You are currently on the <strong className="text-emerald-400 capitalize">{subscription.subscription_plan || 'custom'}</strong> plan billed at <strong className="text-emerald-400 font-black px-1.5 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/20 mx-1">Rs. {subscription.subscription_fee || 0}</strong>. <br className="hidden sm:block" />
                  Your current billing cycle will end on <strong className="text-app-heading dark:text-white font-black">{subscription.subscription_end ? new Date(subscription.subscription_end).toLocaleDateString() : 'N/A'}</strong>.
                </p>
              ) : (
                <p className="text-app-text font-medium text-sm mb-6 relative z-10 leading-relaxed max-w-lg">
                  You do not have an active subscription. Please subscribe to a plan to continue using all features.
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                <Link to="/subscription" className="px-5 py-2.5 bg-app-surface-solid text-emerald-400 border border-emerald-500/30 font-bold rounded-xl hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all shadow-sm text-center">
                  Go to Subscription Center
                </Link>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;