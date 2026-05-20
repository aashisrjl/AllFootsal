import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { AuthBackground, OTPIllustration } from '@/assets/images';
import logo_transparent  from '/logo_transparent.png';
import { verifyOtp, resendOtp } from '@/lib/authApi';

// NOTE: Since this must be a single, self-contained file, the external image imports
// are replaced with local placeholder constants, similar to the previous version.

// --- Type Definitions for Placeholder Components ---

interface ButtonProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'default' | 'outline';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, disabled, className, type = 'button', variant = 'default' }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2 font-semibold rounded-lg transition-all duration-300 ${className} ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${
            variant === 'outline' 
              ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700' 
              : 'bg-green-600 text-white hover:bg-green-700 dark:bg-emerald-600 dark:hover:bg-emerald-700'
        }`}
    >
        {children}
    </button>
);

interface InputProps {
    id?: string;
    type: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Explicitly typed
    required?: boolean;
    className?: string;
    inputMode?: 'text' | 'numeric' | 'decimal' | 'tel';
    maxLength?: number;
}

const Input: React.FC<InputProps> = ({ id, type, placeholder, value, onChange, required, className, inputMode = 'text', maxLength }) => (
    <input
        id={id}
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-emerald-500 ${className}`}
    />
);

interface LabelProps {
    children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ children }) => (
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{children}</label>
);



const EmailVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Safely retrieve the email and type passed via navigation state
  const state = location.state as { email?: string; type?: string } | null;
  const email = state?.email || 'user@example.com';
  const type = state?.type || 'user_registration';
  
  // State for OTP and flow control
  const [otp, setOtp] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(30);
  
  // --- OTP Resend Timer Logic ---
  useEffect(() => {
    let timerId: number | undefined;
    // Timer runs if greater than 0 and not loading
    if (resendTimer > 0 && !isLoading) { 
      // Use window.setInterval to get a number type for timerId
      timerId = window.setInterval(() => {
        setResendTimer(prevTime => prevTime - 1);
      }, 1000);
    }
    return () => {
        if (timerId !== undefined) {
            window.clearInterval(timerId);
        }
    };
  }, [resendTimer, isLoading]);

  // --- Handlers ---

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }

    setIsLoading(true);
    try {
      await verifyOtp(email, otp);
      
      // On successful verification: Since the next step is removed, we redirect or show success.
      toast.success("Verification successful. Redirecting to login...");

      // Simulate redirection after successful verification
      setTimeout(() => {
        navigate('/auth/login'); 
      }, 1000);


    } catch (error) {
      toast.error("The OTP entered is incorrect or expired.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await resendOtp(email, type);
      
      setResendTimer(60); // Reset timer to 60 seconds
      setOtp(''); // Clear previous OTP
      toast.success("A new OTP has been sent to your email.");

    } catch (error) {
      toast.error("Could not send a new OTP. Try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Explicitly type the input change event
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setOtp(e.target.value.replace(/[^0-9]/g, ""));
  };


  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
      style={{
        backgroundImage: `url(${AuthBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <main className="flex flex-1 items-center justify-center py-10 px-4 mt-8">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-2xl rounded-3xl flex flex-col md:flex-row overflow-hidden max-w-5xl w-full border border-green-100 dark:border-slate-800">
          {/* Left Section (OTP Form) */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            {/* Logo */}
            <div className="flex justify-center md:justify-start mb-3">
              <img
                src={logo_transparent}
                alt="AllFutsal Logo"
                className="h-16 w-auto object-contain transition-transform duration-300 hover:scale-105 drop-shadow-md"
              />
            </div>

            {/* Back Button */}
            <div className="flex justify-start mb-6">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex items-center bg-green-200 dark:bg-emerald-900/30 gap-1 w-auto px-3 py-1 border-none"
              >
                <ArrowLeft size={16} /> Back
              </Button>
            </div>

            {/* OTP Verification Content */}
            <>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Verify Account
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Please enter the 6-digit OTP sent to <b className="text-gray-900 dark:text-gray-200">{email}</b>
                </p>

                <div className="space-y-5 mt-6">
                  <div className="space-y-2">
                    <Label>OTP (6 digits)</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={handleOtpChange}
                      placeholder="Enter OTP"
                      className="h-11 text-center text-lg tracking-widest focus-visible:ring-green-500"
                    />
                  </div>

                  <Button
                    onClick={handleVerifyOTP}
                    disabled={isLoading || otp.length !== 6}
                    className="w-full h-11 bg-green-600 hover:bg-green-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all duration-300"
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </Button>

                  <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    {resendTimer > 0 ? (
                      <p>Resend OTP in {resendTimer}s</p>
                    ) : (
                      <button
                        onClick={handleResendOTP}
                        disabled={isLoading}
                        className={`font-semibold ${isLoading ? 'text-gray-400 dark:text-gray-600' : 'text-green-600 hover:underline dark:text-emerald-400'}`}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              </>
          </div>

          {/* Right Illustration */}
          <div className="hidden md:flex w-1/2 bg-white dark:bg-slate-900 border-l border-green-100 dark:border-slate-800 justify-center items-center">
            {/* The illustration remains, showing the OTP theme */}
            <img
              src={OTPIllustration}
              alt="OTP Illustration"
              className="w-96 h-auto object-contain p-8 dark:opacity-90"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmailVerification;