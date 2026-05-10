import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  AuthImage,
  AuthBackground,
  logo_transparent,
} from "@/assets/images";

const Login: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, futsalProfile } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  if (futsalProfile) {
    navigate('/');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Basic detection for email vs phone
      const isPhone = /^\d+$/.test(emailOrPhone.trim());
      const credentials: any = { password };

      if (isPhone) {
        credentials.phoneNumber = emailOrPhone.trim();
      } else {
        credentials.email = emailOrPhone.trim();
      }

      await login(credentials);
      toast.success('Successfully logged in');
      navigate('/');
    } catch (err: any) {
      const msg = err.message || 'Failed to login. Please check your credentials.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-slate-950 transition-colors duration-500"
      style={{
        backgroundImage: `url(${AuthBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <main className="flex flex-1 items-center justify-center py-10 px-4 mt-10">
        <div className="bg-slate-900 shadow-2xl rounded-3xl flex flex-col md:flex-row overflow-hidden max-w-5xl w-full border border-slate-800 transition-all duration-300">
          {/* Left side form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-slate-900/40 backdrop-blur-sm relative overflow-hidden">

            {/* Background Glows for consistent premium feel */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

            <div className="relative z-10">
              <Link to="/">
                <div className="flex justify-center md:justify-start mb-3">
                  <img
                    src={logo_transparent}
                    alt="AllFutsal Logo"
                    className="h-20 w-auto object-contain transition-transform duration-300 hover:scale-105 invert brightness-100"
                  />
                </div>
              </Link>

              <h2 className="text-3xl font-black text-slate-50 mb-2 tracking-tight">Futsal Portal</h2>
              <p className="text-slate-400 mb-6 font-medium">
                Sign in to manage your futsal facility.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-start gap-3 animate-in fade-in zoom-in duration-300">
                    <AlertCircle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-rose-300 font-medium">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-300">
                    Email or Phone <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter email or phone number"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 bg-slate-800 border-slate-700 text-slate-50 placeholder:text-slate-500 focus-visible:ring-emerald-500 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" title="Password" className="text-sm font-semibold text-slate-300">
                      Password <span className="text-rose-500">*</span>
                    </Label>
                    <a
                      href="http://localhost:3001/auth/forgot-password"
                      className="text-xs text-emerald-400 font-bold hover:underline"
                    >
                      Forgot?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 bg-slate-800 border-slate-700 text-slate-50 placeholder:text-slate-500 focus-visible:ring-emerald-500 rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center border-t border-slate-800 pt-6">
                <p className="text-slate-400 text-sm font-medium">
                  Need an account for your futsal?{" "}
                  <a
                    href="http://localhost:3001/auth/register/footsal"
                    className="text-emerald-400 font-bold hover:underline ml-1"
                  >
                    Register Here
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Right side illustration */}
          <div className="hidden md:flex w-1/2 bg-slate-800/30 backdrop-blur-sm justify-center items-center p-12">
            <img
              src={AuthImage}
              alt="Login Illustration"
              className="w-full h-auto object-contain drop-shadow-2xl animate-float rounded-xl"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
