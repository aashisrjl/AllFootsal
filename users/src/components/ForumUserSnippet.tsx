import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserById } from '@/lib/userApi';
import { getFutsalById } from '@/lib/futsalApi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, Mail, Phone, User as UserIcon, ShieldCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogHeader } from '@/components/ui/dialog';

interface ForumUserSnippetProps {
  userId: number | null;
  futsalId: number | null;
  size?: 'sm' | 'md' | 'lg';
  isOp?: boolean;
}

export const ForumUserSnippet: React.FC<ForumUserSnippetProps> = ({ 
  userId, 
  futsalId, 
  size = 'sm',
  isOp 
}) => {
  const { data: userResponse, isLoading: isUserLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId as number),
    enabled: !!userId,
  });

  const { data: futsalResponse, isLoading: isFutsalLoading } = useQuery({
    queryKey: ['futsal', futsalId],
    queryFn: () => getFutsalById(futsalId as number),
    enabled: !!futsalId && !userId, // Fetch futsal only if it is a pure futsal post without user_id
  });

  const getSizes = () => {
    switch(size) {
      case 'lg': return { avatar: 'h-11 w-11', text: 'text-sm sm:text-base', textDetail: 'text-xs', padding: 'p-1.5 -ml-1.5 pr-4' };
      case 'md': return { avatar: 'h-8 w-8', text: 'text-sm', textDetail: 'text-[0.65rem]', padding: 'p-1 -ml-1 pr-3' };
      case 'sm': 
      default: return { avatar: 'h-6 w-6', text: 'text-xs sm:text-sm', textDetail: 'text-[0.6rem]', padding: 'p-1 -ml-1 pr-3' };
    }
  };
  const sizes = getSizes();

  const isLoading = isUserLoading || isFutsalLoading;

  if (isLoading || (!userId && !futsalId)) {
    return (
       <div className={`flex items-center gap-2 ${sizes.padding}`}>
         <div className={`${sizes.avatar} rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse border border-slate-300 dark:border-slate-700 shrink-0`} />
         <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
       </div>
    );
  }

  const profile = userResponse?.data || futsalResponse?.data;
  if (!profile) return <span className="text-slate-500 dark:text-slate-400 text-xs px-2">Unknown {futsalId ? 'Futsal' : 'User'}</span>;

  // Type bridging between user and futsal shapes
  const p = profile as any;
  const displayName = p.username || p.futsalName || p.ownerName || `Futsal #${futsalId}`;
  const displayRole = p.role || 'futsal';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button 
          className={`inline-flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800/40 rounded-full transition-colors group ${sizes.padding} text-left`}
          onClick={(e) => e.stopPropagation()} 
        >
          <Avatar className={`${sizes.avatar} shrink-0 border border-slate-200 dark:border-slate-700 group-hover:border-emerald-500/50 shadow-sm transition-colors`}>
            <AvatarImage src={profile.profileImage || undefined} alt={displayName} />
            <AvatarFallback className="bg-emerald-600/10 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 font-bold">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className={`font-bold text-slate-800 dark:text-emerald-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors ${sizes.text}`}>
                {displayName}
              </span>
              {isOp && (
                <span className={`uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-bold ${sizes.textDetail}`}>
                  OP
                </span>
              )}
            </div>
            {size === 'lg' && (
              <span className="text-xs text-slate-500 dark:text-slate-400 capitalize font-medium">{profile.role}</span>
            )}
          </div>
        </button>
      </DialogTrigger>

      <DialogContent 
        className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-50 sm:max-w-md p-0 overflow-hidden shadow-2xl" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-sky-500 to-emerald-500" />
        <div className="p-6 sm:p-8">
          <DialogHeader className="sr-only">
             <DialogTitle>{displayName}&apos;s Profile</DialogTitle>
             <DialogDescription>User contact details and information.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
            <Avatar className="h-24 w-24 border-4 border-slate-100 dark:border-slate-800 shadow-xl shrink-0">
              <AvatarImage src={profile.profileImage || undefined} alt={displayName} />
              <AvatarFallback className="bg-emerald-600/10 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 text-4xl font-black">
                {initial}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">{displayName}</h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[0.7rem] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mt-2.5 shadow-sm">
                  <ShieldCheck className="h-3 w-3" />
                  {displayRole} User
                </span>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 w-full">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium">
                  <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="text-sm truncate">{profile.email}</span>
                </div>
                {profile.phoneNumber && (
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium">
                    <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="text-sm">{profile.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium">
                   <UserIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                   <span className="text-sm">Joined {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'recently'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
