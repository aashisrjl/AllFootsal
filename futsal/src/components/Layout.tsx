import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Calendar, 
  MapPin, 
  DollarSign,
  Wallet,
  Settings,
  LogOut,
  Image as ImageIcon,
  MessageSquare,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from './NotificationPanel';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { futsalProfile, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'My Facility', href: '/facility', icon: Building2 },
    { name: 'Bookings', href: '/bookings', icon: Calendar },
    { name: 'Pitch Management', href: '/pitches', icon: MapPin },
    { name: 'Media Management', href: '/media', icon: ImageIcon },
    { name: 'Ratings', href: '/ratings', icon: MessageSquare },
    { name: 'Your Forums', href: '/forums', icon: MessageSquare },
    { name: 'Revenue', href: '/revenue', icon: DollarSign },
    { name: 'Subscription', href: '/subscription', icon: Wallet },
    { name: 'Notifications', href: '/notifications', icon: Bell },
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
    if (location.pathname === '/notifications') return 'Notifications';
    return navigation.find((item) => item.href === location.pathname)?.name || 'Dashboard';
  };

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex h-16 items-center justify-center border-b border-slate-800/80 px-4 relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
             <span className="font-bold text-white text-lg leading-none pt-0.5">F</span>
          </div>
          <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent uppercase pt-0.5">
            Owner Panel
          </h1>
        </div>
        {/* Mobile close button */}
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden absolute right-4 p-2 text-slate-400 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <nav className="mt-8 px-4 flex-1 overflow-y-auto">
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

      <div className="p-4 border-t border-slate-800/50">
        <button 
           onClick={logout}
           className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 transition-colors border border-transparent hover:bg-slate-800/50 hover:text-rose-400 group">
          <LogOut className="mr-3 h-5 w-5 text-slate-500 group-hover:text-rose-400 transition-colors" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans selection:bg-emerald-500/30">
      {/* Dynamic Background Glyphs */}
       <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
       <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/60 backdrop-blur-xl border-r border-slate-800 shadow-2xl">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 z-[70] w-72 bg-slate-900 shadow-2xl border-r border-slate-800"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content wrapper */}
      <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
        <header className="bg-slate-900/40 backdrop-blur-xl border-b border-slate-800/50 px-4 lg:px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile menu toggle */}
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-slate-800/50 text-slate-300 hover:text-white transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight drop-shadow-md">
                {getHeaderTitle()}
              </h2>
            </div>

            <div className="flex items-center space-x-3 lg:space-x-5">
              <NotificationPanel />
              <div className="flex items-center gap-3 pl-3 lg:pl-4 border-l border-slate-700/50 cursor-pointer group">
                <div className="hidden sm:block text-right">
                  <span className="block text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                    {futsalProfile?.futsalName || 'Futsal Arena'}
                  </span>
                  <span className="block text-[10px] font-bold tracking-wider uppercase text-emerald-400">
                    {futsalProfile?.ownerName || 'Owner'}
                  </span>
                </div>
                <div className="w-8 h-8 lg:w-9 lg:h-9 text-xs rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-black shadow-lg border-2 border-slate-800/80 relative overflow-hidden group-hover:scale-105 transition-transform">
                  {futsalProfile?.futsalName?.substring(0, 2).toUpperCase() || 'FA'}
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-4 lg:p-8 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;