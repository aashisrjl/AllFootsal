import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getForumById, 
  getRepliesByForumId, 
  createForumReply, 
  createForumLike, 
  countLikesByForumId,
  countLikesByReplyId,
  createReplyLike,
  ForumReplyApiData 
} from '@/lib/forumApi';
import Header from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ArrowLeft, MessageCircle, Clock, Tag, User, Loader2, ThumbsUp, Send } from 'lucide-react';
import { ForumUserSnippet } from '@/components/ForumUserSnippet';

const ReplyCard: React.FC<{ reply: ForumReplyApiData; isOp?: boolean }> = ({ reply, isOp }) => {
  const queryClient = useQueryClient();

  const { data: likesRes } = useQuery({
    queryKey: ['replyLikes', reply.id],
    queryFn: () => countLikesByReplyId(reply.id),
  });

  const likesData = likesRes?.data;
  const likeCount = Array.isArray(likesData) ? likesData.length : (typeof likesData === 'number' ? likesData : 0);

  const likeMutation = useMutation({
    mutationFn: () => createReplyLike(reply.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['replyLikes', reply.id] });
    },
  });

  return (
    <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 mt-4 transition-all hover:bg-slate-900/80">
      <div className="flex justify-between items-start mb-2">
        <ForumUserSnippet userId={reply.user_id} futsalId={reply.footsal_id} size="md" isOp={isOp} />
        {reply.createdAt && (
          <span className="text-xs text-slate-500 mt-1.5 shrink-0">
            {new Date(reply.createdAt).toLocaleDateString()}
          </span>
        )}
      </div>
      <div className="min-w-0 mt-1">
        
        {reply.is_solution && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[0.65rem] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
            Accepted Solution
          </span>
        )}
        
        <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
          {reply.content}
        </p>
        
        <div className="mt-3 flex items-center gap-4">
          <button 
            onClick={() => likeMutation.mutate()}
            disabled={likeMutation.isPending}
            className="group flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <div className="p-1.5 rounded-full bg-slate-800/50 group-hover:bg-emerald-500/10 transition-colors">
              <ThumbsUp className={`h-3.5 w-3.5 ${likeMutation.isPending ? 'animate-pulse text-emerald-500' : ''}`} />
            </div>
            <span className="font-medium">{likeCount} Likes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ForumDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [replyContent, setReplyContent] = useState("");

  // -- Queries --
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['forum', id],
    queryFn: () => getForumById(id as string),
    enabled: !!id,
  });

  const { data: repliesRes, isLoading: repliesLoading } = useQuery({
    queryKey: ['forumReplies', id],
    queryFn: () => getRepliesByForumId(id as string),
    enabled: !!id,
  });

  const { data: forumLikesRes } = useQuery({
    queryKey: ['forumLikes', id],
    queryFn: () => countLikesByForumId(id as string),
    enabled: !!id,
  });

  const forum = response?.data;
  const replies = repliesRes?.data || [];
  
  const forumLikesData = forumLikesRes?.data;
  const forumLikesCount = Array.isArray(forumLikesData) ? forumLikesData.length : (typeof forumLikesData === 'number' ? forumLikesData : 0);

  // -- Mutations --
  const likeForumMutation = useMutation({
    mutationFn: () => createForumLike(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forumLikes', id] });
    },
  });

  const createReplyMutation = useMutation({
    mutationFn: (content: string) => createForumReply({ forumId: id as string, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forumReplies', id] });
      setReplyContent("");
    },
  });

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    createReplyMutation.mutate(replyContent);
  };

  const categoryBadgeClass =
    forum?.category === 'Help'
      ? 'bg-amber-500/15 text-amber-200 border-amber-400/40'
      : forum?.category === 'Announcement'
      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/40'
      : 'bg-sky-500/10 text-sky-200 border-sky-400/40';

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-16 pt-28">
        <section className="max-w-4xl mx-auto space-y-6">
          <button 
            onClick={() => navigate('/forum')} 
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Forums
          </button>
          
          {isLoading ? (
             <div className="flex flex-col items-center justify-center p-20 text-slate-400 gap-3">
               <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
               <p className="text-sm">Loading topic details...</p>
             </div>
          ) : isError || !forum ? (
             <div className="flex flex-col items-center justify-center p-20 text-slate-400 gap-3 border border-slate-800 bg-slate-950/50 rounded-2xl">
               <MessageCircle className="h-10 w-10 text-rose-500 opacity-50" />
               <p className="text-sm">Forum topic not found or failed to load.</p>
             </div>
          ) : (
            <>
              {/* Main Forum Post */}
              <article className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 sm:p-8 shadow-xl backdrop-blur relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-emerald-500 opacity-50" />

                <div className="flex flex-wrap items-center gap-3 mb-5 mt-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[0.7rem] font-semibold uppercase tracking-[0.16em] ${categoryBadgeClass}`}>
                    <Tag className="h-3 w-3" />
                    {forum.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(forum.createdAt).toLocaleString()}
                  </span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-50 mb-6 leading-tight tracking-tight">
                  {forum.title}
                </h1>
                
                <div className="mb-8 pb-8 border-b border-slate-800/80 inline-block overflow-hidden">
                  <ForumUserSnippet userId={forum.user_id} futsalId={forum.futsal_id} size="lg" />
                </div>

                <div className="prose prose-invert max-w-none prose-emerald">
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                    {forum.content}
                  </p>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-800/80 flex justify-between items-center text-sm text-slate-400">
                  <div className="flex gap-3">
                    <button 
                      onClick={() => likeForumMutation.mutate()}
                      disabled={likeForumMutation.isPending}
                      className="inline-flex items-center gap-2 bg-slate-900/80 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/50 px-3.5 py-1.5 rounded-full border border-slate-700 transition-all font-medium"
                    >
                      <ThumbsUp className={`h-4 w-4 ${likeForumMutation.isPending ? "animate-bounce text-emerald-500" : ""}`} />
                      <span>{forumLikesCount} Likes</span>
                    </button>
                    
                    <div className="inline-flex items-center gap-2 bg-slate-900/60 px-3.5 py-1.5 rounded-full border border-slate-800 cursor-default">
                      <MessageCircle className="h-4 w-4 text-sky-400" />
                      <span className="font-medium text-slate-300">{replies.length}</span> Replies
                    </div>
                  </div>
                  
                  <div className="inline-flex items-center gap-2 text-slate-500">
                    {forum.views_count} Views
                  </div>
                </div>
              </article>

              {/* Replies Section */}
              <div className="mt-8 space-y-6">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 ml-2">
                  <MessageCircle className="h-5 w-5 text-emerald-400" />
                  Discussion ({replies.length})
                </h3>

                {repliesLoading ? (
                  <div className="flex justify-center p-10"><Loader2 className="h-6 w-6 animate-spin text-slate-500" /></div>
                ) : replies.length > 0 ? (
                  <div className="space-y-4">
                    {replies.map(reply => (
                      <ReplyCard 
                        key={reply.id} 
                        reply={reply} 
                        isOp={(reply.user_id !== null && reply.user_id === forum.user_id) || (reply.footsal_id !== null && reply.footsal_id === forum.futsal_id)} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center rounded-2xl border border-slate-800 border-dashed bg-slate-900/30 text-slate-400">
                    No replies yet. Be the first to start the conversation!
                  </div>
                )}
                
                {/* Reply Form */}
                <form 
                  onSubmit={handleReplySubmit} 
                  className="mt-6 rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur shadow-lg"
                >
                  <label htmlFor="reply" className="block text-sm font-medium text-slate-300 mb-2">
                    Add a reply
                  </label>
                  <textarea
                    id="reply"
                    rows={3}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write your thoughts..."
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 p-3 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none transition-colors"
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={createReplyMutation.isPending || !replyContent.trim()}
                      className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
                    >
                      {createReplyMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      Post Reply
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ForumDetails;
