import React, { useState } from "react";
import { MessageCircle, Users, Tag, Clock, ThumbsUp, Lock } from "lucide-react";

import Header from "@/components/Navigation";
import Footer from "@/components/Footer";

interface Thread {
  id: number;
  title: string;
  category: "Announcements" | "General" | "Help";
  author: string;
  replies: number;
  lastActivity: string;
  isLocked?: boolean;
}

const mockThreads: Thread[] = [
  {
    id: 1,
    title: "Welcome to the AllFutsal Community 👋",
    category: "Announcements",
    author: "AllFutsal Team",
    replies: 18,
    lastActivity: "2 hours ago",
  },
  {
    id: 2,
    title: "Looking for players this Saturday in Kathmandu",
    category: "General",
    author: "Ramesh",
    replies: 7,
    lastActivity: "1 hour ago",
  },
  {
    id: 3,
    title: "Best futsal venues with late-night slots?",
    category: "General",
    author: "Priya",
    replies: 12,
    lastActivity: "5 hours ago",
  },
  {
    id: 4,
    title: "Unable to complete payment for booking",
    category: "Help",
    author: "Sujan",
    replies: 3,
    lastActivity: "10 minutes ago",
  },
  {
    id: 5,
    title: "Official: Community Rules & Fair Play Guidelines",
    category: "Announcements",
    author: "Moderator",
    replies: 0,
    lastActivity: "1 day ago",
    isLocked: true,
  },
];

const categoryColors: Record<Thread["category"], string> = {
  Announcements: "bg-emerald-500/15 text-emerald-300 border-emerald-400/40",
  General: "bg-sky-500/10 text-sky-200 border-sky-400/40",
  Help: "bg-amber-500/15 text-amber-200 border-amber-400/40",
};

const Forum: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<"All" | Thread["category"]>("All");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Thread["category"]>("General");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const filteredThreads =
    activeFilter === "All"
      ? mockThreads
      : mockThreads.filter((t) => t.category === activeFilter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setInfoMessage("Please add a title and some details before posting.");
      return;
    }

    setSubmitting(true);
    setInfoMessage(null);

    setTimeout(() => {
      setSubmitting(false);
      setTitle("");
      setCategory("General");
      setContent("");
      setInfoMessage(
        "Your topic has been created! In a real app it would now appear in the list for all members."
      );
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-16 pt-28">
        <section className="max-w-7xl mx-auto space-y-10">
          {/* Hero */}
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-400/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                Futsal Community Forum
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Talk tactics,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-sky-400 to-emerald-300">
                  find teammates
                </span>
                , and grow together.
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl">
                A dedicated space for players, organizers, and futsal owners across Nepal to
                ask questions, share experiences, and organize matches.
              </p>
              <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-slate-300">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 border border-slate-700 px-3 py-1.5">
                  <Users className="h-3.5 w-3.5 text-emerald-300" />
                  Open to all registered members
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 border border-slate-700 px-3 py-1.5">
                  <MessageCircle className="h-3.5 w-3.5 text-sky-300" />
                  Match talk • Venue tips • Help & support
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900/80 border border-emerald-500/40 shadow-[0_18px_45px_rgba(16,185,129,0.35)] p-6 space-y-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-200">
                    Be respectful. Play fair.
                  </p>
                  <p className="text-xs text-slate-300">
                    This forum is moderated. Keep conversations friendly and on-topic.
                  </p>
                </div>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5">
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
                <h2 className="text-lg sm:text-xl font-semibold text-slate-50 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-emerald-300" />
                  Latest Topics
                </h2>
                <div className="flex gap-2 text-xs sm:text-sm">
                  {(["All", "Announcements", "General", "Help"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() =>
                        setActiveFilter(filter === "All" ? "All" : filter)
                      }
                      className={`px-3 py-1.5 rounded-full border text-xs sm:text-[0.8rem] transition ${
                        activeFilter === filter
                          ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md"
                          : "bg-slate-900/60 border-slate-700 text-slate-300 hover:border-emerald-300/60"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 divide-y divide-slate-800 shadow-xl overflow-hidden">
                {filteredThreads.map((thread) => (
                  <article
                    key={thread.id}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 px-4 sm:px-5 py-4 hover:bg-slate-900/80 transition"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[0.7rem] font-semibold uppercase tracking-[0.16em] ${
                            categoryColors[thread.category]
                          }`}
                        >
                          <Tag className="h-3 w-3" />
                          {thread.category}
                        </span>
                        {thread.isLocked && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-900 border border-slate-700 text-[0.7rem] text-slate-300">
                            <Lock className="h-3 w-3" />
                            Locked
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 text-sm sm:text-base font-semibold text-slate-50 line-clamp-2">
                        {thread.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400">
                        Started by <span className="font-medium">{thread.author}</span>
                      </p>
                    </div>
                    <div className="flex items-end sm:items-center gap-4 text-xs text-slate-400">
                      <div className="flex flex-col items-start sm:items-end gap-1">
                        <span className="inline-flex items-center gap-1">
                          <MessageCircle className="h-3.5 w-3.5 text-emerald-300" />
                          {thread.replies} replies
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {thread.lastActivity}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* New topic + guidelines */}
            <aside className="space-y-4">
              <div className="rounded-2xl border border-emerald-500/40 bg-slate-950/80 p-5 sm:p-6 shadow-[0_18px_45px_rgba(16,185,129,0.4)] backdrop-blur">
                <h2 className="text-base sm:text-lg font-semibold text-slate-50 flex items-center gap-2 mb-3">
                  <MessageCircle className="h-5 w-5 text-emerald-300" />
                  Start a new topic
                </h2>
                <form className="space-y-3" onSubmit={handleSubmit}>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="What would you like to discuss?"
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) =>
                        setCategory(e.target.value as Thread["category"])
                      }
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="General">General</option>
                      <option value="Announcements">Announcements</option>
                      <option value="Help">Help</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Details
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={4}
                      placeholder="Share context, times, venue details, or what you’re looking for..."
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                    />
                  </div>

                  {infoMessage && (
                    <p className="text-xs text-emerald-300">{infoMessage}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 text-slate-950 font-semibold text-sm py-2.5 mt-1 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-lg shadow-emerald-500/25"
                  >
                    {submitting ? (
                      "Posting..."
                    ) : (
                      <>
                        <ThumbsUp className="h-4 w-4" />
                        Post to community
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 sm:p-6 space-y-3 text-xs sm:text-sm text-slate-300 backdrop-blur">
                <h3 className="text-sm font-semibold text-slate-100">
                  Forum tips
                </h3>
                <ul className="space-y-1.5">
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

