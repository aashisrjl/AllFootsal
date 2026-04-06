import Header from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const UserProfileSettings = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-500">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-16 pt-32 tracking-tight">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-tight text-center">Settings</h1>

          <Card className="bg-white/90 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-sky-500 to-emerald-500 opacity-60" />
            
            <CardHeader className="pb-6 pt-8">
              <CardTitle className="text-2xl font-black uppercase tracking-tight">Account Preferences</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">Manage your notification and account preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pb-10">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:border-emerald-500/30">
                <div className="space-y-1">
                  <Label htmlFor="email-notifications" className="text-base font-bold text-slate-800 dark:text-slate-200">Email Notifications</Label>
                  <p className="text-xs font-medium text-slate-500">Receive booking and account updates via email.</p>
                </div>
                <Switch id="email-notifications" defaultChecked className="data-[state=checked]:bg-emerald-500" />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:border-emerald-500/30">
                <div className="space-y-1">
                  <Label htmlFor="marketing-notifications" className="text-base font-bold text-slate-800 dark:text-slate-200">Promotional Notifications</Label>
                  <p className="text-xs font-medium text-slate-500">Receive offers and feature updates.</p>
                </div>
                <Switch id="marketing-notifications" className="data-[state=checked]:bg-emerald-500" />
              </div>

              <div className="pt-4">
                <Button 
                   onClick={() => navigate("/profile")}
                   className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest px-8 rounded-xl shadow-lg shadow-emerald-500/20"
                >
                   Back to Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfileSettings;
