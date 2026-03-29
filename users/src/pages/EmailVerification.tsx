import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AuthBackground, logo_transparent, OTPIllustration } from '@/assets/images';
import { verifyOtp } from '@/lib/authApi';

// NOTE: Since this must be a single, self-contained file, the external image imports
// are replaced with local placeholder constants, similar to the previous version.

// --- Type Definitions for Placeholder Components ---

interface ToastParams {
    title: string;
    description: string;
    variant?: 'default' | 'destructive';
}
const useToast = () => {
    return {
        toast: ({ title, description, variant }: ToastParams) => {
            console.log(`Toast: ${title} - ${description} (Variant: ${variant})`);
            // Placeholder for displaying notifications
        }
    };
};

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
            variant === 'outline' ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50' : 'bg-green-600 text-white hover:bg-green-700'
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
        className={`w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
    />
);

interface LabelProps {
    children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ children }) => (
    <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>
);



const EmailVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Safely retrieve the email passed via navigation state
  const state = location.state as { email?: string } | null;
  const email = state?.email || 'user@example.com';
  
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
      toast({ title: "Invalid OTP", description: "Please enter the complete 6-digit code.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await verifyOtp(email, otp);
      
      // On successful verification: Since the next step is removed, we redirect or show success.
      toast({ title: "OTP Verified", description: "Verification successful. Redirecting to login...", });

      // Simulate redirection after successful verification
      setTimeout(() => {
        navigate('/auth/login'); 
      }, 1000);


    } catch (error) {
      toast({ title: "Verification Failed", description: "The OTP entered is incorrect or expired.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to send new OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResendTimer(60); // Reset timer to 60 seconds
      setOtp(''); // Clear previous OTP
      toast({ title: "OTP Sent", description: "A new OTP has been sent to your email.", });

    } catch (error) {
      toast({ title: "Resend Failed", description: "Could not send a new OTP. Try again.", variant: "destructive" });
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
      className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-green-100"
      style={{
        backgroundImage: `url(${AuthBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <main className="flex flex-1 items-center justify-center py-10 px-4 mt-8">
        <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl flex flex-col md:flex-row overflow-hidden max-w-5xl w-full border border-green-100">
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
                className="flex items-center bg-green-200 gap-1 w-auto px-3 py-1"
              >
                <ArrowLeft size={16} /> Back
              </Button>
            </div>

            {/* OTP Verification Content */}
            <>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Verify Account
                </h2>
                <p className="text-gray-600 mb-6">
                  Please enter the 6-digit OTP sent to <b>{email}</b>
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
                    className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300"
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                    {resendTimer > 0 ? (
                      <p>Resend OTP in {resendTimer}s</p>
                    ) : (
                      <button
                        onClick={handleResendOTP}
                        disabled={isLoading}
                        className={`font-semibold ${isLoading ? 'text-gray-400' : 'text-green-600 hover:underline'}`}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              </>
          </div>

          {/* Right Illustration */}
          <div className="hidden md:flex w-1/2 bg-white justify-center items-center">
            {/* The illustration remains, showing the OTP theme */}
            <img
              src={OTPIllustration}
              alt="OTP Illustration"
              className="w-96 h-auto object-contain p-8"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmailVerification;