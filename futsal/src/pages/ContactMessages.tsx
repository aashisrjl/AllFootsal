import { useState, useEffect } from 'react';
import {
  Mail, Phone, Trash2, CheckCheck, MessageSquare, Loader,
  AlertCircle, Clock, RefreshCw, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { getContactMessages, markContactAsRead, deleteContactMessage } from '../lib/contactApi';

interface ContactMessage {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  is_read: boolean | number;
  created_at: string;
}

const ContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getContactMessages();
      if (res?.success) {
        setMessages(res?.data || []);
      } else {
        setError(res?.message || 'Failed to load messages');
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Failed to load messages';
      setError(status ? `Error ${status}: ${msg}` : msg);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (msg: ContactMessage) => {
    if (msg.is_read) return;
    try {
      await markContactAsRead(msg.id);
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
      if (selectedMessage?.id === msg.id) setSelectedMessage({ ...msg, is_read: true });
    } catch {
      toast.error('Failed to mark message as read');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this message?')) return;
    setDeletingId(id);
    try {
      await deleteContactMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      toast.success('Message deleted successfully');
    } catch {
      toast.error('Failed to delete message');
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpen = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.is_read) handleMarkRead(msg);
  };

  const filtered = messages.filter(m => {
    if (filter === 'unread') return !m.is_read;
    if (filter === 'read') return !!m.is_read;
    return true;
  });

  const unreadCount = messages.filter(m => !m.is_read).length;

  const formatDate = (dt: string) => {
    const d = new Date(dt);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Contact Messages</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Messages sent by users from your facility's "Get In Touch" form
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700/40 text-sm font-medium transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: messages.length, color: 'text-slate-200', bg: 'bg-slate-700/40', border: 'border-slate-700' },
          { label: 'Unread', value: unreadCount, color: 'text-amber-300', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
          { label: 'Read', value: messages.length - unreadCount, color: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} border ${stat.border} rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'unread', 'read'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${filter === f
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-slate-700/40 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
          >
            {f} {f === 'unread' && unreadCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-amber-500 text-white rounded-full text-xs">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Main content */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader className="h-8 w-8 text-emerald-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/40 rounded-xl border border-slate-700">
          <MessageSquare className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No messages yet</p>
          <p className="text-xs text-slate-500 mt-1">Messages from your facility page will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Message list */}
          <div className="lg:col-span-2 space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {filtered.map(msg => (
              <button
                key={msg.id}
                onClick={() => handleOpen(msg)}
                className={`w-full text-left p-4 rounded-xl border transition-all group relative ${selectedMessage?.id === msg.id
                    ? 'border-emerald-500/50 bg-emerald-500/10'
                    : !msg.is_read
                      ? 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10'
                      : 'border-slate-700 bg-slate-800/40 hover:bg-slate-700/40'
                  }`}
              >
                {/* Unread dot */}
                {!msg.is_read && (
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400/60" />
                )}

                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${!msg.is_read ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-700 text-slate-400'
                    }`}>
                    {msg.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold truncate ${!msg.is_read ? 'text-slate-100' : 'text-slate-300'}`}>
                      {msg.name || 'Anonymous'}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{msg.message}</p>
                    <p className="text-[10px] text-slate-600 mt-1">
                      {msg.created_at ? formatDate(msg.created_at) : ''}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-3">
            {selectedMessage ? (
              <div className="bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden h-full flex flex-col">
                {/* Detail header */}
                <div className="p-5 border-b border-slate-700 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-lg">
                      {selectedMessage.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-base">{selectedMessage.name || 'Anonymous'}</h3>
                      <div className="flex flex-wrap gap-3 mt-1">
                        {selectedMessage.email && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Mail className="h-3 w-3" />{selectedMessage.email}
                          </span>
                        )}
                        {selectedMessage.phone && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Phone className="h-3 w-3" />{selectedMessage.phone}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {selectedMessage.created_at ? formatDate(selectedMessage.created_at) : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    disabled={deletingId === selectedMessage.id}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                    title="Delete message"
                  >
                    {deletingId === selectedMessage.id ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Message body */}
                <div className="p-5 flex-1">
                  <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
                    <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>

                  {/* Reply options */}
                  <div className="mt-5">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      Reply via
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {/* Email reply */}
                      {selectedMessage.email ? (
                        <a
                          href={`mailto:${selectedMessage.email}?subject=Re: Your Message to ${encodeURIComponent('our futsal')}&body=Hi ${encodeURIComponent(selectedMessage.name || '')},\n\nThank you for contacting us!\n\n---\nYour message:\n"${encodeURIComponent(selectedMessage.message)}"\n---\n\n`}
                          className="flex items-center gap-2 px-5 py-2.5 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 text-blue-300 rounded-xl text-sm font-semibold transition-all"
                        >
                          <Mail className="h-4 w-4" />
                          Reply via Email
                          <ExternalLink className="h-3 w-3 opacity-60" />
                        </a>
                      ) : (
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-700/30 border border-slate-700 text-slate-500 rounded-xl text-sm cursor-not-allowed">
                          <Mail className="h-4 w-4" />
                          No email provided
                        </div>
                      )}

                      {/* Phone / SMS reply */}
                      {selectedMessage.phone ? (
                        <a
                          href={`sms:${selectedMessage.phone}?body=Hi ${encodeURIComponent(selectedMessage.name || '')}, thank you for contacting us!`}
                          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 rounded-xl text-sm font-semibold transition-all"
                        >
                          <Phone className="h-4 w-4" />
                          Reply via SMS
                          <ExternalLink className="h-3 w-3 opacity-60" />
                        </a>
                      ) : (
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-700/30 border border-slate-700 text-slate-500 rounded-xl text-sm cursor-not-allowed">
                          <Phone className="h-4 w-4" />
                          No phone provided
                        </div>
                      )}

                      {/* Call option */}
                      {selectedMessage.phone && (
                        <a
                          href={`tel:${selectedMessage.phone}`}
                          className="flex items-center gap-2 px-5 py-2.5 bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/40 text-violet-300 rounded-xl text-sm font-semibold transition-all"
                        >
                          <Phone className="h-4 w-4" />
                          Call
                          <ExternalLink className="h-3 w-3 opacity-60" />
                        </a>
                      )}
                    </div>

                    {/* Read status badge */}
                    <div className="mt-5 flex items-center gap-2">
                      <CheckCheck className={`h-4 w-4 ${selectedMessage.is_read ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span className={`text-xs font-medium ${selectedMessage.is_read ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {selectedMessage.is_read ? 'Marked as read' : 'Unread'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-60 lg:h-full bg-slate-800/20 border border-dashed border-slate-700 rounded-xl text-center p-8">
                <MessageSquare className="h-10 w-10 text-slate-600 mb-3" />
                <p className="text-slate-400 font-medium text-sm">Select a message to view details</p>
                <p className="text-xs text-slate-500 mt-1">Click any message on the left to read it and reply</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default ContactMessages;
