import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, User, Mail, Phone, ShieldCheck } from "lucide-react";

import Header from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getUserById } from "@/lib/userApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PublicProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id as string),
    enabled: !!id,
  });

  const profile = response?.data;
  const initial = profile?.username?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-500">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-24 pt-32 tracking-tight">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>

          {isLoading ? (
            <div className="p-12 text-center text-slate-400 font-medium">Loading user profile...</div>
          ) : isError || !profile ? (
            <div className="p-12 text-center text-rose-600 dark:text-rose-400 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-rose-500/20 shadow-xl backdrop-blur">
              Failed to load profile or user not found.
            </div>
          ) : (
            <div className="bg-white/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur relative overflow-hidden transition-all duration-500">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-sky-500 to-emerald-500 opacity-60" />

              <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left relative z-10">
                <Avatar className="h-32 w-32 sm:h-36 sm:w-36 border-4 border-white dark:border-slate-800 shadow-2xl transition-transform hover:scale-105 duration-500">
                  <AvatarImage src={profile.profileImage || undefined} alt={profile.username} />
                  <AvatarFallback className="bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 text-5xl font-black">
                    {initial}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-6 mt-4 sm:mt-0">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight leading-none uppercase">{profile.username}</h1>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[0.7rem] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.16em] mt-3 shadow-sm">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {profile.role} User
                    </span>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 group">
                      <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                        <Mail className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-semibold tracking-tight">{profile.email}</span>
                    </div>
                    {profile.phoneNumber && (
                      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 group">
                        <div className="h-8 w-8 rounded-lg bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                          <Phone className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold tracking-tight">{profile.phoneNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 group">
                       <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-500 group-hover:scale-110 transition-transform">
                        <User className="h-4 w-4" />
                      </div>
                       <span className="text-xs font-bold uppercase tracking-wider">Joined {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'recently'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PublicProfile;
