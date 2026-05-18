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
  Inbox,
  Menu,
  X,
  Bell,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from './NotificationPanel';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { futsalProfile, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

  useEffect(() => {
    if (!futsalProfile?.id) return;
    const token = localStorage.getItem('token');
    fetch(`${apiBaseUrl}/futsal/${futsalProfile.id}/media/logo`, {
      credentials: 'include',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(body => { if (body?.data?.url) setLogoUrl(body.data.url); })
      .catch(() => {});

    fetch(`${apiBaseUrl}/futsal/contact`, {
      credentials: 'include',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(body => {
        const msgs = body?.data || [];
        setUnreadMessages(msgs.filter((m: any) => !m.is_read).length);
      })
      .catch(() => {});
  }, [futsalProfile?.id]);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'My Facility', href: '/facility', icon: Building2 },
    { name: 'Bookings', href: '/bookings', icon: Calendar },
    { name: 'Pitch Management', href: '/pitches', icon: MapPin },
    { name: 'Media Management', href: '/media', icon: ImageIcon },
    { name: 'Messages', href: '/messages', icon: Inbox, badge: unreadMessages },
    { name: 'Ratings & Reviews', href: '/ratings', icon: MessageSquare },
    { name: 'Your Forums', href: '/forums', icon: MessageSquare },
    { name: 'Revenue', href: '/revenue', icon: DollarSign },
    { name: 'Subscription', href: '/subscription', icon: Wallet },
    { name: 'Visitors', href: '/visitors', icon: Users },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isNavItemActive = (href: string) => {
    if (href === '/subscription') {
      return location.pathname === '/subscription' || location.pathname.startsWith('/payment/');
    }
    if (href === '/bookings') {
      return location.pathname === '/bookings' || location.pathname.startsWith('/bookings/');
    }
    return location.pathname === href;
  };

  const getHeaderTitle = () => {
    if (location.pathname.startsWith('/payment/')) return 'Subscription';
    if (location.pathname === '/notifications') return 'Notifications';
    if (location.pathname.startsWith('/bookings/')) return 'Booking Details';
    return navigation.find((item) => item.href === location.pathname)?.name || 'Dashboard';
  };

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex h-16 items-center justify-center border-b border-app-border px-4 relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)] flex-shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-app-heading text-lg leading-none pt-0.5">F</span>
            )}
          </div>
          <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent uppercase pt-0.5">
            Owner Panel
          </h1>
        </div>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden absolute right-4 p-2 text-app-muted hover:text-app-heading"
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
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-inner'
                      : 'text-app-muted border border-transparent hover:bg-app-surface-solid hover:text-app-heading'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 transition-transform ${isActive ? 'text-emerald-500 scale-110' : 'text-app-muted'}`} />
                  {item.name}
                  {item.badge ? (
                    <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-app-border">
        <button
          onClick={logout}
          className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-semibold text-app-muted transition-colors border border-transparent hover:bg-app-surface-solid hover:text-rose-500 dark:hover:text-rose-400 group"
        >
          <LogOut className="mr-3 h-5 w-5 text-app-muted group-hover:text-rose-500 transition-colors" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-app-bg text-app-text font-sans selection:bg-emerald-500/30">
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none z-0 dark:opacity-100 opacity-40" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none z-0 dark:opacity-100 opacity-40" />

      <aside className="hidden lg:block fixed inset-y-0 left-0 z-50 w-64 bg-app-sidebar backdrop-blur-xl border-r border-app-border shadow-2xl">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden fixed inset-0 z-[60] bg-black/50 dark:bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 z-[70] w-72 bg-app-sidebar shadow-2xl border-r border-app-border"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
        <header className="bg-app-header backdrop-blur-xl border-b border-app-border px-4 lg:px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-app-surface-solid text-app-muted hover:text-app-heading transition-colors border border-app-border"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h2 className="text-xl lg:text-2xl font-bold text-app-heading tracking-tight">
                {getHeaderTitle()}
              </h2>
            </div>

            <div className="flex items-center space-x-3 lg:space-x-5">
              <ThemeToggle />
              <NotificationPanel />
              <div className="flex items-center gap-3 pl-3 lg:pl-4 border-l border-app-border cursor-pointer group">
                <div className="hidden sm:block text-right">
                  <span className="block text-sm font-bold text-app-heading group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {futsalProfile?.futsalName || 'Futsal Arena'}
                  </span>
                  <span className="block text-[10px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                    {futsalProfile?.ownerName || 'Owner'}
                  </span>
                </div>
                <div className="w-8 h-8 lg:w-9 lg:h-9 text-xs rounded-full overflow-hidden bg-gradient-to-tr from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-black shadow-lg border-2 border-app-border relative group-hover:scale-105 transition-transform">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <>{futsalProfile?.futsalName?.substring(0, 2).toUpperCase() || 'FA'}</>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 relative z-10">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
