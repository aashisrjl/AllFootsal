import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getUserById } from '@/lib/userApi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield } from 'lucide-react';

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
  const { data: userResponse, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId as number),
    enabled: !!userId,
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

  if (futsalId && !userId) {
    return (
      <div className={`flex items-center gap-3 ${sizes.padding}`}>
         <div className={`${sizes.avatar} rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shadow-sm shrink-0`}>
           <Shield className="h-1/2 w-1/2 text-emerald-400" />
         </div>
         <div className="flex flex-col">
           <span className={`font-semibold text-emerald-100 ${sizes.text}`}>
             Futsal #{futsalId}
           </span>
         </div>
      </div>
    );
  }

  if (isLoading || !userId) {
    return (
       <div className={`flex items-center gap-2 ${sizes.padding}`}>
         <div className={`${sizes.avatar} rounded-full bg-slate-800 animate-pulse border border-slate-700 shrink-0`} />
         <div className="h-4 w-24 bg-slate-800 animate-pulse rounded" />
       </div>
    );
  }

  const profile = userResponse?.data;
  if (!profile) return <span className="text-slate-500 text-xs">Unknown User</span>;

  const displayName = profile.username;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <Link 
      to={`/user/${userId}`} 
      className={`inline-flex items-center gap-3 hover:bg-slate-800/40 rounded-full transition-colors group ${sizes.padding}`}
      onClick={(e) => e.stopPropagation()}
    >
      <Avatar className={`${sizes.avatar} shrink-0 border border-slate-700 group-hover:border-emerald-500/50 shadow-sm transition-colors`}>
        <AvatarImage src={profile.profileImage || undefined} alt={displayName} />
        <AvatarFallback className="bg-emerald-600/20 text-emerald-400 font-medium">
          {initial}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`font-semibold text-emerald-100 group-hover:text-emerald-400 transition-colors ${sizes.text}`}>
            {displayName}
          </span>
          {isOp && (
            <span className={`uppercase tracking-wider bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded ${sizes.textDetail}`}>
              OP
            </span>
          )}
        </div>
        {size === 'lg' && (
          <span className="text-xs text-slate-500 capitalize">{profile.role}</span>
        )}
      </div>
    </Link>
  );
};
