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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-24 pt-32">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>

          {isLoading ? (
            <div className="p-12 text-center text-slate-400">Loading user profile...</div>
          ) : isError || !profile ? (
            <div className="p-12 text-center text-rose-400 bg-slate-900/50 rounded-2xl border border-rose-500/20">
              Failed to load profile or user not found.
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-sky-500 to-emerald-500 opacity-60" />

              <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
                <Avatar className="h-32 w-32 border-4 border-slate-800 shadow-xl">
                  <AvatarImage src={profile.profileImage || undefined} alt={profile.username} />
                  <AvatarFallback className="bg-emerald-600/20 text-emerald-400 text-5xl font-bold">
                    {initial}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-5 mt-4 sm:mt-0">
                  <div>
                    <h1 className="text-3xl font-extrabold text-slate-50 tracking-tight">{profile.username}</h1>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-[0.7rem] font-semibold text-emerald-400 uppercase tracking-wider mt-3">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {profile.role} User
                    </span>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-800/80">
                    <div className="flex items-center gap-3 text-slate-300">
                      <Mail className="h-4 w-4 text-emerald-500/80" />
                      <span className="text-sm">{profile.email}</span>
                    </div>
                    {profile.phoneNumber && (
                      <div className="flex items-center gap-3 text-slate-300">
                        <Phone className="h-4 w-4 text-emerald-500/80" />
                        <span className="text-sm">{profile.phoneNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-slate-300">
                       <User className="h-4 w-4 text-emerald-500/80" />
                       <span className="text-sm">Joined {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'recently'}</span>
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
