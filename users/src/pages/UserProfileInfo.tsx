import Header from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  deleteProfileImage,
  getProfile,
  updateProfile,
  updateProfileImage,
  changePassword,
  type UserProfileApiData,
} from "@/lib/userApi";

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

  // ✅ useEffect BEFORE any conditional return
  useEffect(() => {
    if (!isAuthenticated || !user) return; // guard inside, not outside

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
  }, [isAuthenticated, user?.id]);

  const displayName = useMemo(() => profile?.username || user?.name, [profile?.username, user?.name]);
  const displayEmail = useMemo(() => profile?.email || user?.email, [profile?.email, user?.email]);
  const displayRole = useMemo(() => profile?.role || user?.role, [profile?.role, user?.role]);
  const displayImage = profile?.profileImage || "";
  const initial = displayName?.trim()?.charAt(0)?.toUpperCase() || "U";

  // ✅ All conditional returns AFTER all hooks
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Checking session...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (isFetchingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const handleProfileUpdate = async () => {
    try {
      setIsSavingProfile(true);
      const res = await updateProfile({
        username: formValues.username,
        email: formValues.email,
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
    // Validation
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

      // Logout after successful password change
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

  if (isFetchingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const renderProfileSection = () => {
    if (activeSection === "bookings") {
      return (
        <Card>
          <CardHeader>
            <CardTitle>My Bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">View and manage your futsal bookings.</p>
            <Button onClick={() => navigate("/bookings")}>View All Bookings</Button>
          </CardContent>
        </Card>
      );
    }

    if (activeSection === "forums") {
      return (
        <Card>
          <CardHeader>
            <CardTitle>My Forums</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Visit the futsal forums and discussion board.</p>
            <Button onClick={() => navigate("/forum")}>Go to Forums</Button>
          </CardContent>
        </Card>
      );
    }

    if (activeSection === "changePassword") {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Update your password to keep your account secure.</p>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
              />
              <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={passwordForm.cNewPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    cNewPassword: e.target.value,
                  }))
                }
              />
            </div>

            <Button onClick={handlePasswordChange} disabled={isChangingPassword} className="w-full">
              {isChangingPassword ? "Changing Password..." : "Change Password"}
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (activeSection === "logout") {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Logout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Are you sure you want to logout?</p>
            <Button onClick={handleLogout} disabled={isLoggingOut} variant="destructive">
              {isLoggingOut ? "Logging out..." : "Confirm Logout"}
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (activeSection === "data") {
      return (
        <Card>
          <CardHeader className="items-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src={displayImage} alt={displayName} />
              <AvatarFallback className="bg-green-600 text-white text-2xl">{initial}</AvatarFallback>
            </Avatar>
            <CardTitle className="mt-3">{displayName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{displayName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{displayEmail}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">{profile?.phoneNumber || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium capitalize">{displayRole}</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Label htmlFor="profile-image">Profile Image</Label>
              <Input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setSelectedImageFile(file);
                }}
              />
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleProfileImageUpload} disabled={!selectedImageFile || isUploadingImage}>
                  {isUploadingImage ? "Uploading..." : "Upload Image"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleProfileImageDelete}
                  disabled={isDeletingImage || !displayImage}
                >
                  {isDeletingImage ? "Removing..." : "Delete Image"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (activeSection === "info") {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">User ID</p>
              <p className="font-medium break-all">{profile?.id ?? user.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Account Type</p>
              <p className="font-medium capitalize">{displayRole}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Primary Contact</p>
              <p className="font-medium">{displayEmail}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">{profile?.createdAt ? new Date(profile.createdAt).toLocaleString() : "-"}</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (activeSection === "settings") {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive booking and account updates via email.</p>
              </div>
              <Switch id="email-notifications" checked={Boolean(profile?.notifications)} disabled />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Your backend dark mode preference.</p>
              </div>
              <Switch id="dark-mode" checked={Boolean(profile?.darkMode)} disabled />
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formValues.username}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formValues.email}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={formValues.phoneNumber}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  phoneNumber: e.target.value,
                }))
              }
            />
          </div>

          <Button onClick={handleProfileUpdate} disabled={isSavingProfile}>
            {isSavingProfile ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">My Profile</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="md:col-span-1 h-fit">
              <CardContent className="pt-6 space-y-2">
                <Button
                  variant={activeSection === "data" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("data")}
                >
                  Profile Data
                </Button>
                <Button
                  variant={activeSection === "info" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("info")}
                >
                  Info
                </Button>
                <Button
                  variant={activeSection === "settings" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("settings")}
                >
                  Settings
                </Button>
                <Button
                  variant={activeSection === "edit" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("edit")}
                >
                  Edit
                </Button>
                <Button
                  variant={activeSection === "bookings" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("bookings")}
                >
                  Bookings
                </Button>
                <Button
                  variant={activeSection === "forums" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("forums")}
                >
                  My Forums
                </Button>
                <Button
                  variant={activeSection === "changePassword" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("changePassword")}
                >
                  Change Password
                </Button>
                <Button
                  variant={activeSection === "logout" ? "destructive" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("logout")}
                >
                  Logout
                </Button>
              </CardContent>
            </Card>

            <div className="md:col-span-3">{renderProfileSection()}</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfileInfo;
