import React from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, CreditCard, Check } from 'lucide-react';

const Settings = () => {
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
              { label: 'Profile Settings', icon: User, active: true },
              { label: 'Notifications', icon: Bell, active: false },
              { label: 'Security', icon: Shield, active: false },
              { label: 'Billing & Subscription', icon: CreditCard, active: false },
            ].map((tab, i) => (
              <a 
                key={i}
                href={`#${tab.label.split(' ')[0].toLowerCase()}`} 
                className={`flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                  tab.active 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white border border-transparent'
                }`}
              >
                <tab.icon className={`h-4 w-4 mr-3 ${tab.active ? 'text-emerald-400' : 'text-slate-500'}`} />
                {tab.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Profile Settings */}
          <div id="profile" className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl p-8 relative overflow-hidden group hover:border-slate-700 transition-colors">
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2 border-b border-slate-800/80 pb-4">
              <User className="h-5 w-5 text-emerald-500" />
              Profile Information
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">First Name</label>
                  <input type="text" defaultValue="John" className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 text-white font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 hover:border-slate-600 transition-colors shadow-inner" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Last Name</label>
                  <input type="text" defaultValue="Smith" className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 text-white font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 hover:border-slate-600 transition-colors shadow-inner" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                  <input type="email" defaultValue="john.smith@example.com" className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 text-white font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 hover:border-slate-600 transition-colors shadow-inner" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Phone Number</label>
                  <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 text-white font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 hover:border-slate-600 transition-colors shadow-inner" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 mt-4">
                <button className="px-6 py-2.5 bg-transparent text-slate-400 border border-slate-700 font-bold rounded-xl hover:bg-slate-800 hover:text-white transition-all shadow-sm">
                  Cancel
                </button>
                <button className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center hover:-translate-y-0.5 active:translate-y-0">
                  <Check className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div id="notifications" className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl p-8 hover:border-slate-700 transition-colors">
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2 border-b border-slate-800/80 pb-4">
              <Bell className="h-5 w-5 text-blue-500" />
              Notification Preferences
            </h3>
            <div className="space-y-4">
              {[
                { title: 'New Bookings', desc: 'Get notified when you receive new bookings', on: true },
                { title: 'Cancellations', desc: 'Get notified when bookings are cancelled', on: true },
                { title: 'Payment Confirmations', desc: 'Get notified when payments are received', on: false }
              ].map((notif, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-800/60 hover:border-slate-700 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-white mb-0.5">{notif.title}</p>
                    <p className="text-[11px] font-medium text-slate-400">{notif.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input type="checkbox" defaultChecked={notif.on} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner peer-checked:after:bg-white"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription Info */}
          <div id="billing" className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl p-8 hover:border-slate-700 transition-colors">
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2 border-b border-slate-800/80 pb-4">
              <CreditCard className="h-5 w-5 text-purple-500" />
              Current Subscription
            </h3>
            <div className="border border-emerald-500/30 rounded-xl p-6 bg-emerald-500/5 relative overflow-hidden group shadow-inner">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-700"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 relative z-10 gap-3">
                <span className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                  Premium Plan
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase tracking-widest rounded-lg font-black shadow-sm">Active</span>
                </span>
              </div>
              <p className="text-slate-300 font-medium text-sm mb-6 relative z-10 leading-relaxed max-w-lg">
                You are currently on the Premium Plan billed at <strong className="text-emerald-400 font-black px-1.5 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/20 mx-1">$199/month</strong>. <br className="hidden sm:block" />
                Your next billing cycle will automatically start on <strong className="text-white">Feb 15, 2024</strong>.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                <button className="px-5 py-2.5 bg-slate-800/80 text-emerald-400 border border-emerald-500/30 font-bold rounded-xl hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all shadow-sm">
                  Change Plan
                </button>
                <button className="px-5 py-2.5 bg-transparent text-slate-300 font-bold rounded-xl border border-slate-700 hover:bg-slate-800 hover:text-white transition-all shadow-sm">
                  View Billing History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;