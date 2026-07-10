import Header from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const UserProfileEdit = () => {
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
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-tight text-center">Edit Profile</h1>

          <Card className="bg-white/90 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-sky-500 to-emerald-500 opacity-60" />
            
            <CardHeader className="pb-4 pt-8">
              <CardTitle className="text-2xl font-black uppercase tracking-tight">Profile Information</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">Update your basic account details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pb-10">
              <div className="space-y-2.5">
                <Label htmlFor="name" className="text-[0.7rem] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Full Name</Label>
                <Input 
                  id="name" 
                  defaultValue={user.name} 
                  className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-[0.7rem] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Email Address</Label>
                <Input 
                  id="email" 
                  type="email"
                  disabled
                  defaultValue={user.email} 
                  className="bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-xl focus:ring-emerald-500 disabled:opacity-100 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                   onClick={() => navigate("/profile")}
                   className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest px-8 rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  Save Changes
                </Button>
                <Button 
                   variant="outline" 
                   onClick={() => navigate("/profile")}
                   className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-black uppercase tracking-widest px-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
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

export default UserProfileEdit;
