import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Calendar, 
  MapPin, 
  DollarSign,
  Wallet,
  Settings,
  Bell,
  LogOut,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { futsalProfile, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'My Facility', href: '/facility', icon: Building2 },
    { name: 'Bookings', href: '/bookings', icon: Calendar },
    { name: 'Pitch Management', href: '/pitches', icon: MapPin },
    { name: 'Media Management', href: '/media', icon: ImageIcon },
    { name: 'Revenue', href: '/revenue', icon: DollarSign },
    { name: 'Subscription', href: '/subscription', icon: Wallet },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isNavItemActive = (href: string) => {
    if (href === '/subscription') {
      return location.pathname === '/subscription' || location.pathname.startsWith('/payment/');
    }
    return location.pathname === href;
  };

  const getHeaderTitle = () => {
    if (location.pathname.startsWith('/payment/')) {
      return 'Subscription';
    }
    return navigation.find((item) => item.href === location.pathname)?.name || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans selection:bg-emerald-500/30">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/60 backdrop-blur-xl border-r border-slate-800 shadow-2xl transition-all">
        <div className="flex h-16 items-center justify-center border-b border-slate-800/80 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
               <span className="font-bold text-white text-lg leading-none pt-0.5">F</span>
            </div>
            <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent uppercase pt-0.5">
              Owner Panel
            </h1>
          </div>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = isNavItemActive(item.href);
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner'
                        : 'text-slate-400 border border-transparent hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 transition-transform ${isActive ? 'text-emerald-400 scale-110' : 'text-slate-500'}`} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button 
             onClick={logout}
             className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 transition-colors border border-transparent hover:bg-slate-800/50 hover:text-rose-400 group">
            <LogOut className="mr-3 h-5 w-5 text-slate-500 group-hover:text-rose-400 transition-colors" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64 flex flex-col min-h-screen relative overflow-hidden">
        {/* Background decorative glow elements globally so they cast over the layout */}
         <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
         <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

        <header className="bg-slate-900/30 backdrop-blur-xl border-b border-slate-800/50 px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white tracking-tight relative z-10 drop-shadow-md">
              {getHeaderTitle()}
            </h2>
            <div className="flex items-center space-x-5 relative z-10">
              <button className="rounded-full bg-slate-800/80 p-2.5 relative border border-slate-700/50 hover:border-slate-600 hover:bg-slate-700 transition-all shadow-inner hover:shadow-lg">
                <Bell className="h-4 w-4 text-slate-300" />
                <span className="absolute -top-1 -right-1 h-3 w-3 border-2 border-[#121827] bg-rose-500 rounded-full animate-pulse"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-700/50 cursor-pointer group">
                <div className="text-right">
                  <span className="block text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{futsalProfile?.futsalName || 'Futsal Arena'}</span>
                  <span className="block text-[10px] font-bold tracking-wider uppercase text-emerald-400">{futsalProfile?.ownerName || 'Owner'}</span>
                </div>
                <div className="w-9 h-9 text-xs rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-black shadow-lg border-2 border-slate-800/80 relative overflow-hidden group-hover:scale-105 transition-transform">
                  {futsalProfile?.futsalName?.substring(0, 2).toUpperCase() || 'FA'}
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-6 lg:p-8 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;