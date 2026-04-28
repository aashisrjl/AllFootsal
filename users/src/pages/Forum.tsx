import React, { useState } from "react";
import { MessageCircle, Users, Tag, Clock, ThumbsUp, Lock, Loader2, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import Header from "@/components/Navigation";
import Footer from "@/components/Footer";
import { 
  getAllForums, 
  getForumsByCategory, 
  createForum, 
  countLikesByForumId, 
  createForumLike, 
  deleteForumLike,
  deleteForum,
  ForumApiData 
} from "@/lib/forumApi";
import { ForumUserSnippet } from "@/components/ForumUserSnippet";

const categoryColors: Record<string, string> = {
  Announcement: "bg-emerald-500/15 text-emerald-700 border-emerald-400/40 dark:text-emerald-300",
  General: "bg-sky-500/10 text-sky-700 border-sky-400/40 dark:text-sky-200",
  Help: "bg-amber-500/15 text-amber-700 border-amber-400/40 dark:text-amber-200",
};

const getCategoryColor = (category: string) => {
  return categoryColors[category] || categoryColors["General"];
};

const ForumCard: React.FC<{ thread: ForumApiData }> = ({ thread }) => {
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { data: likesRes } = useQuery({
    queryKey: ['forumLikes', thread.id],
    queryFn: () => countLikesByForumId(thread.id)
  });
  
  const likeMutation = useMutation({
    mutationFn: () => createForumLike(thread.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forumLikes', thread.id] });
    }
  });

  const unlikeMutation = useMutation({
    mutationFn: () => deleteForumLike(thread.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forumLikes', thread.id] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteForum(thread.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forums"] });
      queryClient.invalidateQueries({ queryKey: ["forums", "All"] });
      setShowDeleteConfirm(false);
    }
  });

  const likesData = likesRes?.data;
  const likesCount = Array.isArray(likesData) ? likesData.length : (typeof likesData === 'number' ? likesData : 0);

  return (
    <article className="flex flex-col sm:flex-row gap-3 sm:gap-4 px-4 sm:px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-900/80 transition border-b border-slate-200 dark:border-slate-800/50 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[0.7rem] font-semibold uppercase tracking-[0.16em] ${getCategoryColor(
              thread.category
            )}`}
          >
            <Tag className="h-3 w-3" />
            {thread.category}
          </span>
          {thread.is_locked && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-900 dark:bg-slate-950 border border-slate-700 dark:border-slate-800 text-[0.7rem] text-slate-300">
              <Lock className="h-3 w-3" />
              Locked
            </span>
          )}
        </div>
        <Link to={`/forum/${thread.id}`}>
          <h3 className="mt-2 text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-50 line-clamp-2 hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline transition-colors block shrink-0">
            {thread.title}
          </h3>
        </Link>
        <div className="mt-1.5 flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
          Started by 
          <ForumUserSnippet userId={thread.user_id} futsalId={thread.futsal_id} size="sm" />
        </div>
      </div>
      <div className="flex items-end sm:items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2 sm:mt-0">
        <div className="flex flex-col items-start sm:items-end gap-1.5 min-w-[120px]">
          <button 
            onClick={(e) => { e.preventDefault(); likeMutation.mutate(); }}
            disabled={likeMutation.isPending}
            className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-2.5 py-1 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/50 transition-colors"
          >
            <ThumbsUp className={`h-3.3 w-3.3 ${likeMutation.isPending ? 'animate-bounce text-emerald-400' : ''}`} />
            <span className="font-medium">{likesCount} Likes</span>
          </button>
          <button
            onClick={(e) => { e.preventDefault(); unlikeMutation.mutate(); }}
            disabled={unlikeMutation.isPending}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            Unlike
          </button>
          <div className="flex items-center gap-3 mt-1">
            <span className="inline-flex items-center gap-1 text-[0.7rem]">
              <MessageCircle className="h-3 w-3 text-sky-500 dark:text-sky-400" />
              {thread.views_count} views
            </span>
            <span className="inline-flex items-center gap-1 text-[0.7rem]">
              <Clock className="h-3 w-3 text-slate-400 dark:text-slate-500" />
              {new Date(thread.createdAt).toLocaleDateString()}
            </span>
            <button 
              onClick={(e) => { e.preventDefault(); setShowDeleteConfirm(true); }}
              disabled={deleteMutation.isPending}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 max-w-sm mx-4 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">Delete Forum Post?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              This action cannot be undone. All replies and likes will also be deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

const Forum: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<"All" | string>("All");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("General");
  const [content, setContent] = useState("");
  const [infoMessage, setInfoMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const queryClient = useQueryClient();

  // Fetch forums based on active filter
  const { data: forumsResponse, isLoading } = useQuery({
    queryKey: ["forums", activeFilter],
    queryFn: () => (activeFilter === "All" ? getAllForums() : getForumsByCategory(activeFilter)),
  });

  const forumsList: ForumApiData[] = forumsResponse?.data || [];

  // Submit new forum topic
  const createForumMutation = useMutation({
    mutationFn: createForum,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forums"] });
      queryClient.invalidateQueries({ queryKey: ["forums", "All"] });
      queryClient.invalidateQueries({ queryKey: ["forums", category] });
      setTitle("");
      setCategory("General");
      setContent("");
      setInfoMessage({ type: "success", text: "Your topic has been posted successfully!" });
      setTimeout(() => setInfoMessage(null), 3500);
    },
    onError: () => {
      setInfoMessage({ type: "error", text: "Failed to post topic. Please try again later." });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setInfoMessage({ type: "error", text: "Please add a title and some details before posting." });
      return;
    }

    setInfoMessage(null);
    createForumMutation.mutate({ title, content, category });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-16 pt-28">
        <section className="max-w-7xl mx-auto space-y-10">
          {/* Hero */}
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-400/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-300 animate-pulse" />
                Futsal Community Forum
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
                Talk tactics,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-sky-600 to-emerald-500 dark:from-emerald-400 dark:via-sky-400 dark:to-emerald-300">
                  find teammates
                </span>
                , and grow together.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
                A dedicated space for players, organizers, and futsal owners across Nepal to
                ask questions, share experiences, and organize matches.
              </p>
              <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 px-3 py-1.5">
                  <Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300" />
                  Open to all registered members
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 px-3 py-1.5">
                  <MessageCircle className="h-3.5 w-3.5 text-sky-600 dark:text-sky-300" />
                  Match talk • Venue tips • Help & support
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-emerald-200 dark:border-emerald-500/40 shadow-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white dark:text-slate-950 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-200">
                    Be respectful. Play fair.
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    This forum is moderated. Keep conversations friendly and on-topic.
                  </p>
                </div>
              </div>
              <ul className="text-xs text-slate-500 dark:text-slate-300 space-y-1.5 font-medium">
                <li>• No hate speech, spam, or off-topic promotions.</li>
                <li>• Use &quot;Help&quot; for support and bug reports.</li>
                <li>• Protect personal details—share contact info in DMs only.</li>
              </ul>
            </div>
          </div>

          {/* Main layout: threads + new topic */}
          <div className="grid gap-8 lg:grid-cols-[1.7fr_1.1fr]">
            {/* Threads */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-50 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-300" />
                  Latest Topics
                </h2>
                <div className="flex gap-2 text-xs sm:text-sm">
                  {(["All", "Announcement", "General", "Help"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 py-1.5 rounded-full border text-xs sm:text-[0.8rem] transition ${activeFilter === filter
                          ? "bg-emerald-500 text-white dark:text-slate-950 border-emerald-400 shadow-md"
                          : "bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-400/60"
                        }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/70 divide-y divide-slate-100 dark:divide-slate-800 shadow-xl overflow-hidden min-h-[300px]">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                    <p className="text-sm">Loading topics...</p>
                  </div>
                ) : forumsList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-3">
                    <MessageCircle className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm">No topics found in this category.</p>
                  </div>
                ) : (
                  forumsList.map((thread) => (
                    <ForumCard key={thread.id} thread={thread} />
                  ))
                )}
              </div>
            </section>

            {/* New topic + guidelines */}
            <aside className="space-y-4">
              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-500/40 bg-emerald-50/50 dark:bg-slate-950/80 p-5 sm:p-6 shadow-lg backdrop-blur">
                <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-50 flex items-center gap-2 mb-3">
                  <MessageCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-300" />
                  Start a new topic
                </h2>
                <form className="space-y-3" onSubmit={handleSubmit}>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="What would you like to discuss?"
                      className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-800 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      disabled={createForumMutation.isPending}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-800 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      disabled={createForumMutation.isPending}
                    >
                      <option value="General">General</option>
                      <option value="Announcement">Announcement</option>
                      <option value="Help">Help</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Details</label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={4}
                      placeholder="Share context, times, venue details, or what you’re looking for..."
                      className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-800 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none transition-colors"
                      disabled={createForumMutation.isPending}
                    />
                  </div>

                  {infoMessage && (
                    <p
                      className={`text-xs font-medium ${
                        infoMessage.type === "error" ? "text-rose-500 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {infoMessage.text}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={createForumMutation.isPending}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 text-white dark:text-slate-950 font-semibold text-sm py-2.5 mt-1 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-lg shadow-emerald-500/25"
                  >
                    {createForumMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <ThumbsUp className="h-4 w-4" />
                        Post to community
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 p-5 sm:p-6 space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 backdrop-blur">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Forum tips</h3>
                <ul className="space-y-1.5 font-medium">
                  <li>• Use descriptive titles so others can help quickly.</li>
                  <li>• Add location and preferred time when looking for players.</li>
                  <li>• Check if a question already exists before creating a new one.</li>
                  <li>• Mark helpful replies so others can find answers faster.</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Forum;
