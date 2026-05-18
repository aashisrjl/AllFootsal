import { useEffect, useState } from 'react';
import { Users, Search, Filter, ArrowUpRight, Globe, Monitor, Smartphone, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { getVisitors } from '../lib/visitorApi';

interface Visitor {
  user_id: number | null;
  username: string | null;
  email: string | null;
  phoneNumber: string | null;
  ip_hash: string;
  user_agent: string;
  visit_count: number;
  last_seen_at: string;
  first_seen_at: string;
}

const Visitors = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const data = await getVisitors();
      if (data.success) {
        setVisitors(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch visitors');
      }
    } catch (error) {
      console.error('Error fetching visitors:', error);
      toast.error('An error occurred while fetching visitors');
    } finally {
      setLoading(false);
    }
  };

  const filteredVisitors = visitors.filter(v => 
    (v.username?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (v.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (v.ip_hash.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getDeviceIcon = (ua: string) => {
    if (/mobile/i.test(ua)) return <Smartphone className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Website Visitors
          </h1>
          <p className="text-sm text-app-muted mt-1">
            Track and analyze users visiting your facility page.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
          <Users className="w-5 h-5" />
          <span className="font-bold text-lg">{visitors.length}</span>
          <span className="text-xs uppercase tracking-wider font-bold opacity-70">Total Visitors</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by username, email or IP hash..."
            className="w-full bg-app-surface-solid border border-app-border-subtle rounded-xl py-2.5 pl-11 pr-4 text-sm text-app-text focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-app-text rounded-xl border border-app-border-subtle transition-colors text-sm font-semibold">
          <Filter className="w-4 h-4" />
          More Filters
        </button>
      </div>

      {/* Visitors List */}
      <div className="bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-app-border bg-app-surface-solid">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Visitor Info</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-app-muted text-center">IP Hash</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-app-muted text-center">Device</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-app-muted text-center">Visits</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Last Seen</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredVisitors.map((visitor, idx) => (
                <tr key={idx} className="hover:bg-app-surface-solid transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-xs font-bold text-app-text border border-app-border-subtle group-hover:border-emerald-500/30 transition-colors shrink-0">
                        {visitor.username ? visitor.username.substring(0, 2).toUpperCase() : 'GV'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-app-text truncate">
                          {visitor.username || 'Guest Visitor'}
                        </p>
                        <p className="text-xs text-app-muted truncate">
                          {visitor.email || 'Anonymous Session'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex justify-center">
                        <code className="text-[10px] bg-app-surface-solid px-2 py-1 rounded text-app-muted font-mono border border-app-border">
                            {visitor.ip_hash.substring(0, 12)}...
                        </code>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center text-slate-400">
                      <div className="flex items-center gap-1.5 bg-app-surface-solid px-2 py-1 rounded-lg border border-app-border">
                        {getDeviceIcon(visitor.user_agent)}
                        <span className="text-[10px] uppercase font-bold tracking-tight">
                            {/mobile/i.test(visitor.user_agent) ? 'Mobile' : 'Desktop'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className="bg-emerald-500/10 text-emerald-400 text-xs font-black px-3 py-1 rounded-full border border-emerald-500/20">
                        {visitor.visit_count}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs font-medium">
                        {formatDate(visitor.last_seen_at)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg transition-all text-slate-500">
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredVisitors.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Globe className="w-12 h-12 text-slate-800 mb-4 animate-pulse" />
                      <p className="text-app-muted font-medium italic">No visitors found matching your search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Visitors;
