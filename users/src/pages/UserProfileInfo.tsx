import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import {
  deleteProfileImage,
  getProfile,
  updateProfile,
  updateProfileImage,
  changePassword,
  getUserBookings,
  type UserProfileApiData,
} from "@/lib/userApi";
import { getForumsByUserId } from "@/lib/forumApi";
import { useQuery } from "@tanstack/react-query";
import { 
  User, Info, Settings, Edit3, Calendar, MessageSquare, Lock, LogOut, 
  Phone, Mail, Upload, Trash2, Loader2, ShieldCheck, ChevronRight
} from "lucide-react";

type ProfileSection = "data" | "info" | "settings" | "edit" | "bookings" | "forums" | "changePassword" | "logout";

const UserProfileInfo = () => {
  const { isAuthenticated, user, isLoading, setCurrentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<ProfileSection>("data");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [profile, setProfile] = useState<UserProfileApiData | null>(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    phoneNumber: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    cNewPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const { data: userBookingsData, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['user-bookings'],
    queryFn: getUserBookings,
    enabled: isAuthenticated && activeSection === 'bookings'
  });

  const { data: userForumsData, isLoading: isLoadingForums } = useQuery({
    queryKey: ['user-forums'],
    queryFn: getForumsByUserId,
    enabled: isAuthenticated && activeSection === 'forums'
  });

  useEffect(() => {
    if (user && ((user.role as string) === 'futsal' || user.role === 'footsal')) {
      window.location.replace("http://localhost:3002/settings");
      return;
    }

    if (!isAuthenticated || !user) return;

    const loadProfile = async () => {
      try {
        setIsFetchingProfile(true);
        const res = await getProfile();
        
        setProfile(res.data);
        
        setCurrentUser({
          id: String(res.data.id),
          name: res.data.username,
          email: res.data.email,
          phoneNumber: res.data.phoneNumber || "",
          profileImage: res.data.profileImage || "",
          role: res.data.role,
        });
        
        setFormValues({
          username: res.data?.username || "",
          email: res.data?.email || "",
          phoneNumber: res.data?.phoneNumber || "",
        });
      } catch (err: any) {
        toast({
          title: "Failed to fetch profile",
          description: err?.response?.data?.message || "Unable to load profile data.",
          variant: "destructive",
        });
      } finally {
        setIsFetchingProfile(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, user?.id, user?.role]);

  const displayName = useMemo(() => profile?.username || user?.name, [profile?.username, user?.name]);
  const displayEmail = useMemo(() => profile?.email || user?.email, [profile?.email, user?.email]);
  const displayRole = useMemo(() => profile?.role || user?.role, [profile?.role, user?.role]);
  const displayImage = profile?.profileImage || "";
  const initial = displayName?.trim()?.charAt(0)?.toUpperCase() || "U";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center gap-4 text-slate-500 dark:text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <p className="font-semibold tracking-tight">Checking session...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (isFetchingProfile) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center gap-4 text-slate-500 dark:text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <p className="font-semibold tracking-tight">Loading profile...</p>
      </div>
    );
  }

  const handleProfileUpdate = async () => {
    try {
      setIsSavingProfile(true);
      const res = await updateProfile({
        username: formValues.username,
        phoneNumber: formValues.phoneNumber,
      });

      setProfile(res.data);
      setCurrentUser({
        id: String(res.data.id),
        name: res.data.username,
        email: res.data.email,
        phoneNumber: res.data.phoneNumber || "",
        profileImage: res.data.profileImage || "",
        role: res.data.role,
      });
      toast({
        title: "Profile updated",
        description: res.message || "Your profile has been updated successfully.",
      });
      setActiveSection("data");
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err?.response?.data?.message || "Unable to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleProfileImageUpload = async () => {
    if (!selectedImageFile) {
      toast({
        title: "Image is required",
        description: "Please choose an image file first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploadingImage(true);
      const res = await updateProfileImage(selectedImageFile);
      setProfile(res.data);
      setCurrentUser({
        id: String(res.data.id),
        name: res.data.username,
        email: res.data.email,
        phoneNumber: res.data.phoneNumber || "",
        profileImage: res.data.profileImage || "",
        role: res.data.role,
      });
      setSelectedImageFile(null);
      toast({
        title: "Profile image updated",
        description: res.message || "Your profile image has been updated.",
      });
    } catch (err: any) {
      toast({
        title: "Image upload failed",
        description: err?.response?.data?.message || "Unable to upload profile image.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleProfileImageDelete = async () => {
    try {
      setIsDeletingImage(true);
      const res = await deleteProfileImage();
      setProfile(res.data);
      setCurrentUser({
        id: String(res.data.id),
        name: res.data.username,
        email: res.data.email,
        phoneNumber: res.data.phoneNumber || "",
        profileImage: res.data.profileImage || "",
        role: res.data.role,
      });
      toast({
        title: "Profile image removed",
        description: res.message || "Your profile image has been removed.",
      });
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description: err?.response?.data?.message || "Unable to remove profile image.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingImage(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.newPassword || !passwordForm.cNewPassword) {
      toast({
        title: "Validation error",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.cNewPassword) {
      toast({
        title: "Passwords do not match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsChangingPassword(true);
      await changePassword({
        newPassword: passwordForm.newPassword,
        cNewPassword: passwordForm.cNewPassword,
      });

      toast({
        title: "Password changed successfully",
        description: "Your password has been updated. Please login again.",
      });

      setPasswordForm({ newPassword: "", cNewPassword: "" });
      setActiveSection("data");

      setTimeout(() => {
        logout();
      }, 1500);
    } catch (err: any) {
      toast({
        title: "Password change failed",
        description: err?.response?.data?.error || "Unable to change password.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate("/");
    } catch (err: any) {
      toast({
        title: "Logout failed",
        description: err?.response?.data?.message || "Unable to logout.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
    { id: "data", label: "Profile Data", icon: User },
    { id: "info", label: "Account Info", icon: Info },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "edit", label: "Edit Profile", icon: Edit3 },
    { id: "bookings", label: "My Bookings", icon: Calendar },
    { id: "forums", label: "My Forums", icon: MessageSquare },
    { id: "changePassword", label: "Password", icon: Lock },
    { id: "logout", label: "Logout", icon: LogOut, danger: true },
  ];

  const renderProfileSection = () => {
    if (activeSection === "bookings") {
      const bookings = userBookingsData?.data || [];
      return (
        <div className="space-y-6 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 uppercase tracking-tight">My Bookings</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">View and manage your futsal match bookings and timeslots.</p>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900/40 p-4 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col gap-3 min-h-[150px] flex-1">
             {isLoadingBookings ? (
                <div className="flex justify-center items-center h-full my-auto"><Loader2 className="h-6 w-6 animate-spin text-emerald-500" /></div>
             ) : bookings.length === 0 ? (
                <p className="text-slate-500 text-sm italic m-auto text-center">You have no booking history.</p>
             ) : (
                 <div className="max-h-[350px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                   {bookings.map((b: any) => (
                      <div 
                         key={b.id} 
                         onClick={() => navigate('/bookings')}
                         className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center hover:border-emerald-500/50 dark:hover:border-emerald-500/50 cursor-pointer shadow-sm hover:shadow-md transition-all group"
                      >
                         <div>
                            <p className="text-slate-900 dark:text-slate-200 font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{b.pitch_name || "Pitch"}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-bold">
                               {new Date(b.booking_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'})} &middot; {b.start_time} - {b.end_time}
                            </p>
                         </div>
                         <div className="text-right">
                            <span className={`inline-block px-2.5 py-1 text-[0.65rem] font-black rounded-full uppercase tracking-wider ${b.status === 'confirmed' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : b.status === 'cancelled' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'}`}>
                               {b.status}
                            </span>
                            <p className="text-emerald-600 dark:text-emerald-400 font-black mt-1.5 text-sm tracking-tight">Rs. {b.amount}</p>
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </div>
          
          <button 
            onClick={() => navigate("/bookings")}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-lg shadow-emerald-500/20 w-fit"
          >
            <Calendar className="h-4 w-4" />
            View All Bookings
          </button>
        </div>
      );
    }

    if (activeSection === "forums") {
      const forums = userForumsData?.data || [];
      return (
        <div className="space-y-6 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 uppercase tracking-tight">My Forums</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Visit the futsal forums and participate in the community discussion board.</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/40 p-4 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col gap-3 min-h-[150px] flex-1">
             {isLoadingForums ? (
                <div className="flex justify-center items-center h-full my-auto"><Loader2 className="h-6 w-6 animate-spin text-emerald-500" /></div>
             ) : forums.length === 0 ? (
                <p className="text-slate-500 text-sm italic m-auto text-center">You haven't created any forums yet.</p>
             ) : (
                 <div className="max-h-[350px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                   {forums.slice(0, 6).map((f: any) => (
                      <div 
                         key={f.id} 
                         onClick={() => navigate(`/forum/${f.id}`)}
                         className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2.5 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 cursor-pointer shadow-sm hover:shadow-md transition-all group"
                      >
                         <h3 className="text-slate-900 dark:text-slate-100 font-black text-md leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{f.title}</h3>
                         <div className="flex items-center gap-2.5 text-[0.7rem] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                             <span className="bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-500/20 px-2.5 py-0.5 rounded-md">{f.category || "General"}</span>
                             <span>{new Date(f.createdAt).toLocaleDateString()}</span>
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </div>

          <button 
            onClick={() => navigate("/forum")}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-lg shadow-emerald-500/20 w-fit"
          >
            <MessageSquare className="h-4 w-4" />
            Go to Forums
          </button>
        </div>
      );
    }

    if (activeSection === "changePassword") {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 uppercase tracking-tight">Security & Password</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Update your password to keep your Futsal account secure.</p>

          <div className="space-y-5 mt-6 max-w-md">
            <div className="space-y-2.5">
              <Label htmlFor="new-password" className="text-[0.7rem] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-emerald-500 shadow-sm"
              />
              <p className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Minimum 6 characters required.</p>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="confirm-password" className="text-[0.7rem] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Repeat new password"
                value={passwordForm.cNewPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, cNewPassword: e.target.value }))}
                className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-emerald-500 shadow-sm"
              />
            </div>

            <button 
              onClick={handlePasswordChange} 
              disabled={isChangingPassword} 
              className="w-full inline-flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 px-5 py-2.5 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
            >
              {isChangingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {isChangingPassword ? "Saving..." : "Change Password"}
            </button>
          </div>
        </div>
      );
    }

    if (activeSection === "logout") {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-black text-rose-600 dark:text-rose-400 uppercase tracking-tight">Account Logout</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Are you sure you want to end your current session?</p>
          <button 
            onClick={handleLogout} 
            disabled={isLoggingOut} 
            className="inline-flex justify-center items-center gap-2 bg-rose-50 dark:bg-rose-500/20 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-rose-50 border border-rose-200 dark:border-rose-500/30 disabled:opacity-50 px-6 py-2.5 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg"
          >
            {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            {isLoggingOut ? "Logging out..." : "Confirm Logout"}
          </button>
        </div>
      );
    }

    if (activeSection === "edit") {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 uppercase tracking-tight">Edit Profile</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Modify your core account information here.</p>

          <div className="space-y-5 mt-6 max-w-md">
            <div className="space-y-2.5">
              <Label htmlFor="name" className="text-[0.7rem] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Name / Username</Label>
              <Input
                id="name"
                value={formValues.username}
                onChange={(e) => setFormValues((prev) => ({ ...prev, username: e.target.value }))}
                className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 focus-visible:ring-emerald-500 shadow-sm"
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-[0.7rem] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formValues.email}
                disabled
                className="bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700/80 text-slate-500 dark:text-slate-400 focus-visible:ring-emerald-500 shadow-sm disabled:opacity-100 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="phoneNumber" className="text-[0.7rem] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formValues.phoneNumber}
                onChange={(e) => setFormValues((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 focus-visible:ring-emerald-500 shadow-sm"
              />
            </div>

            <button 
              onClick={handleProfileUpdate} 
              disabled={isSavingProfile}
              className="w-full inline-flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 px-5 py-2.5 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
            >
               {isSavingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit3 className="h-4 w-4" />}
               {isSavingProfile ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      );
    }

    if (activeSection === "info") {
      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 uppercase tracking-tight">Account Information</h2>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80">
              <div className="space-y-1.5">
                 <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <User className="h-4 w-4" /> User ID
                 </div>
                 <p className="font-extrabold text-slate-900 dark:text-slate-200 text-lg break-all tracking-tight">{profile?.id ?? user.id}</p>
              </div>
              <div className="space-y-1.5">
                 <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="h-4 w-4" /> Account Type
                 </div>
                 <p className="font-extrabold text-slate-900 dark:text-slate-200 text-lg capitalize tracking-tight">{displayRole}</p>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                 <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <Calendar className="h-4 w-4" /> Created At
                 </div>
                 <p className="font-extrabold text-slate-900 dark:text-slate-200 text-lg tracking-tight">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' }) : "-"}
                 </p>
              </div>
           </div>
        </div>
      );
    }

    if (activeSection === "settings") {
      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 uppercase tracking-tight">System Settings</h2>
          
          <div className="space-y-6">
            <div className="flex items-start sm:items-center justify-between bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80">
              <div className="space-y-1 pr-6">
                <Label htmlFor="email-notifications" className="text-base text-slate-200">Email Notifications</Label>
                <p className="text-sm text-slate-500">Receive booking and account updates via email.</p>
              </div>
              <Switch id="email-notifications" checked={Boolean(profile?.notifications)} disabled className="data-[state=checked]:bg-emerald-500" />
            </div>

            <div className="flex items-start sm:items-center justify-between bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80">
              <div className="space-y-1 pr-6">
                <Label htmlFor="dark-mode" className="text-base font-bold text-slate-800 dark:text-slate-200">Dark Mode</Label>
                <p className="text-sm font-medium text-slate-500">Your core interface preference is automatically dark.</p>
              </div>
              <Switch id="dark-mode" checked={true} disabled className="data-[state=checked]:bg-emerald-500" />
            </div>
          </div>
        </div>
      );
    }

    // Default "data" view
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-slate-50 dark:bg-slate-900/40 p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-inner">
           <Avatar className="h-28 w-28 border-4 border-white dark:border-slate-800 shadow-2xl shrink-0">
            <AvatarImage src={displayImage} alt={displayName} />
             <AvatarFallback className="bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 text-4xl font-black">
                {initial}
             </AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center text-center sm:text-left">
            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight leading-none uppercase">{displayName}</h2>
            <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3">
               <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[0.7rem] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest shadow-sm">
                  <ShieldCheck className="h-3 w-3" />
                  {displayRole}
               </span>
               <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[0.7rem] font-black text-slate-500 dark:text-slate-300 uppercase tracking-widest shadow-sm">
                  <Mail className="h-3 w-3" />
                  {displayEmail}
               </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div className="bg-white dark:bg-slate-950/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50 space-y-1 shadow-sm">
             <p className="text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Full Name</p>
             <p className="font-extrabold text-slate-900 dark:text-slate-200 tracking-tight">{displayName}</p>
           </div>
           <div className="bg-white dark:bg-slate-950/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50 space-y-1 shadow-sm">
             <p className="text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Primary Email</p>
             <p className="font-extrabold text-slate-900 dark:text-slate-200 truncate tracking-tight">{displayEmail}</p>
           </div>
           <div className="bg-white dark:bg-slate-950/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50 space-y-1 sm:col-span-2 shadow-sm">
             <p className="text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Mobile Number</p>
             <p className="font-extrabold text-slate-900 dark:text-slate-200 tracking-tight">{profile?.phoneNumber || "Not provided"}</p>
           </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <Label htmlFor="profile-image" className="text-[0.7rem] text-slate-500 dark:text-slate-300 font-bold uppercase tracking-widest block">Update Profile Picture</Label>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
             <Input
               id="profile-image"
               type="file"
               accept="image/*"
               className="max-w-[250px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-300 file:text-emerald-600 dark:file:text-emerald-400 file:font-bold file:bg-slate-50 dark:file:bg-slate-900 file:border-0 hover:file:text-emerald-500 dark:hover:file:text-emerald-300 cursor-pointer shadow-sm"
               onChange={(e) => {
                 const file = e.target.files?.[0] || null;
                 setSelectedImageFile(file);
               }}
             />
             <div className="flex gap-3">
               <button 
                 onClick={handleProfileImageUpload} 
                 disabled={!selectedImageFile || isUploadingImage}
                 className="inline-flex items-center gap-2 bg-emerald-500/10 dark:bg-emerald-500/20 hover:bg-emerald-500 hover:text-white dark:hover:text-slate-950 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 dark:border-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-sm"
               >
                 {isUploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                 Upload
               </button>
               <button
                 onClick={handleProfileImageDelete}
                 disabled={isDeletingImage || !displayImage}
                 className="inline-flex items-center gap-2 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 disabled:opacity-30 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-sm"
               >
                 {isDeletingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                 Remove
               </button>
             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-500">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-16 pt-24 tracking-tight">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
             <h1 className="text-4xl font-black tracking-tight uppercase leading-none">Your Dashboard</h1>
             <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm sm:text-base font-medium">Manage your Futsal identity, match preferences, and security settings.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
            {/* Sidebar Navigation */}
            <aside className="bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl p-5 backdrop-blur h-fit space-y-1.5 flex flex-col transition-all duration-500">
               {menuItems.map((item) => {
                 const Icon = item.icon;
                 const isActive = activeSection === item.id;
                 const isDanger = item.danger;
                 
                 let btnClasses = "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ";
                 if (isActive) {
                    btnClasses += isDanger 
                       ? "bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 shadow-sm" 
                       : "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 shadow-sm";
                 } else {
                    btnClasses += isDanger
                       ? "text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 border border-transparent"
                       : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent";
                 }

                 return (
                   <button
                     key={item.id}
                     onClick={() => setActiveSection(item.id as ProfileSection)}
                     className={btnClasses}
                   >
                     <Icon className={`h-5 w-5 ${isActive && !isDanger ? 'text-emerald-600 dark:text-emerald-400' : isActive && isDanger ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors'}`} />
                     {item.label}
                     {isActive && <ChevronRight className="h-4 w-4 ml-auto opacity-70" />}
                   </button>
                 );
               })}
            </aside>

            {/* Main Content Pane */}
            <section className="bg-white/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl p-6 sm:p-12 backdrop-blur relative overflow-hidden min-h-[60vh] transition-all duration-500">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-sky-500 to-emerald-500 opacity-60" />
              {renderProfileSection()}
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfileInfo;
