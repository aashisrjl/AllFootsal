import { useState, useEffect } from 'react';
import { MessageSquare, User, Calendar, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getFutsalForums } from '../lib/forumApi';

interface ForumPost {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  user_name?: string;
}

const ForumsAndPosts = () => {
  const { futsalProfile } = useAuth();
  const [forums, setForums] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (futsalProfile?.id) {
      fetchForums();
    }
  }, [futsalProfile?.id]);

  const fetchForums = async () => {
    try {
      setLoading(true);
      const response = await getFutsalForums();
      if (response.success) {
        setForums(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error('Error fetching forums:', err);
      setError('Failed to load forums. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-emerald-400" />
        <span className="ml-2 text-slate-400">Loading forums...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <AlertCircle className="h-8 w-8 text-red-400" />
        <span className="ml-2 text-red-400">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Your Forums</h2>
        <div className="text-sm text-slate-400">
          {forums.length} post{forums.length !== 1 ? 's' : ''}
        </div>
      </div>

      {forums.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">No forum posts yet</h3>
          <p className="text-slate-500">Forum posts related to your futsal will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {forums.map((forum) => (
            <div
              key={forum.id}
              onClick={() => window.open(`http://localhost:3001/forum/${forum.id}`, '_blank')}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{forum.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {forum.user_name || 'Anonymous'}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(forum.createdAt)}
                      </span>
                      <span className="px-2 py-1 bg-slate-700 rounded-full text-xs">
                        {forum.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">{forum.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForumsAndPosts;