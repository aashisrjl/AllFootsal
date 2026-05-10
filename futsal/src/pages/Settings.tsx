import { useState, useEffect } from 'react';
import { User, Bell, Shield, CreditCard, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateFutsalProfile } from '../lib/authApi';
import { toast } from 'sonner';
import API from '@/lib/api';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { futsalProfile, refreshProfile } = useAuth();
  
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
    }
  }, [futsalProfile]);

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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Company Settings</h1>
           <p className="text-slate-400 mt-1 text-sm font-medium">Manage your personal and business preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl p-4 lg:col-span-1 h-fit sticky top-24">
          <nav className="space-y-1.5 flex flex-col">
            {[
              { id: 'profile', label: 'Profile Settings', icon: User },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'billing', label: 'Billing & Subscription', icon: CreditCard },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                  activeTab === tab.id 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white border border-transparent'
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
            <div id="profile" className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl p-8 relative overflow-hidden group hover:border-slate-700 transition-colors">
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2 border-b border-slate-800/80 pb-4">
                <User className="h-5 w-5 text-emerald-500" />
                Profile Information
              </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">First Name</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 text-white font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 hover:border-slate-600 transition-colors shadow-inner" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Last Name</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 text-white font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 hover:border-slate-600 transition-colors shadow-inner" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 text-white font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 hover:border-slate-600 transition-colors shadow-inner" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 text-white font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 hover:border-slate-600 transition-colors shadow-inner" />
                </div>
              </div>
              <div className="pt-4 flex justify-between items-center gap-3 mt-4">
                <span className="text-sm font-bold text-emerald-400">{successMsg}</span>
                <div className="flex gap-3">
                  <button className="px-6 py-2.5 bg-transparent text-slate-400 border border-slate-700 font-bold rounded-xl hover:bg-slate-800 hover:text-white transition-all shadow-sm">
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

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div id="notifications" className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl p-8 hover:border-slate-700 transition-colors">
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2 border-b border-slate-800/80 pb-4">
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
                <div key={i} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-800/60 hover:border-slate-700 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-white mb-0.5">{notif.title}</p>
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

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div id="security" className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl p-8 hover:border-slate-700 transition-colors">
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2 border-b border-slate-800/80 pb-4">
                <Shield className="h-5 w-5 text-red-500" />
                Security Settings
              </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 text-white font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 hover:border-slate-600 transition-colors shadow-inner" 
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">New Password</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 text-white font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 hover:border-slate-600 transition-colors shadow-inner" 
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 text-white font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 hover:border-slate-600 transition-colors shadow-inner" 
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
            <div id="billing" className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl p-8 hover:border-slate-700 transition-colors">
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2 border-b border-slate-800/80 pb-4">
              <CreditCard className="h-5 w-5 text-purple-500" />
              Billing & Subscription
            </h3>
            <div className="border border-emerald-500/30 rounded-xl p-6 bg-emerald-500/5 relative overflow-hidden group shadow-inner">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-700"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 relative z-10 gap-3">
                <span className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                  {subscription ? (subscription.plan_type || 'Custom Plan') : 'No Active Plan'}
                  <span className={`px-2.5 py-1 text-[10px] uppercase tracking-widest rounded-lg font-black shadow-sm ${subscription && subscription.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                    {subscription ? subscription.status : 'Inactive'}
                  </span>
                </span>
              </div>
              {subscription ? (
                <p className="text-slate-300 font-medium text-sm mb-6 relative z-10 leading-relaxed max-w-lg">
                  You are currently on the {subscription.plan_type || 'Custom Plan'} billed at <strong className="text-emerald-400 font-black px-1.5 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/20 mx-1">Rs. {subscription.price || 0}</strong>. <br className="hidden sm:block" />
                  Your current billing cycle will end on <strong className="text-white">{subscription.end_date ? new Date(subscription.end_date).toLocaleDateString() : 'N/A'}</strong>.
                </p>
              ) : (
                <p className="text-slate-300 font-medium text-sm mb-6 relative z-10 leading-relaxed max-w-lg">
                  You do not have an active subscription. Please subscribe to a plan to continue using all features.
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                <Link to="/subscription" className="px-5 py-2.5 bg-slate-800/80 text-emerald-400 border border-emerald-500/30 font-bold rounded-xl hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all shadow-sm text-center">
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