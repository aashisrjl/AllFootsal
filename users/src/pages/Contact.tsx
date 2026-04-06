import React, { useState } from "react";
// NOTE: Assuming Header and Footer components are available in your environment, 
// they are imported here but not defined within this single file.
import Header from "@/components/Navigation";
import Footer from "@/components/Footer";

import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  HelpCircle,
  Users,
  Building,
  Loader2,
  MessageSquare,
  Facebook,
  Twitter,
  Instagram
} from "lucide-react";
import { FaTiktok } from "react-icons/fa";

// --- START: PLACEHOLDER UI COMPONENTS (Simulating external dependencies like shadcn/ui) ---

// 1. Toast Utility
interface ToastParams {
    title: string;
    description: string;
    variant?: 'default' | 'destructive';
}
const useToast = () => {
    // In a real app, this would show a notification, here we just log.
    return {
        toast: ({ title, description, variant }: ToastParams) => {
            console.log(`[TOAST - ${variant || 'default'}] ${title}: ${description}`);
            // In a real browser context, you might alert or set a temporary state to show a banner
        }
    };
};
const toast = useToast().toast;

// 2. Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'link' | 'accent';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
    variant = 'default', 
    size = 'default', 
    className = '', 
    children, 
    ...props 
}) => {
    // Base styles for professional appearance and animation
    let baseStyle = "font-medium rounded-lg transition-all duration-300 active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";
    
    let sizeStyle = {
        default: 'h-10 px-4 py-2 text-base',
        sm: 'h-9 px-3 text-sm',
        lg: 'h-11 px-8 text-lg',
        icon: 'h-10 w-10 p-0',
    }[size];

    // Color logic: Green (default) and Blue (accent)
    let variantStyle = '';
    if (variant === 'default') {
        variantStyle = 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl hover:shadow-emerald-200';
    } else if (variant === 'accent') {
        variantStyle = 'bg-sky-600 text-white hover:bg-sky-700 shadow-lg hover:shadow-xl hover:shadow-sky-200';
    } else if (variant === 'outline') {
        variantStyle = 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-emerald-500';
    } else {
        variantStyle = 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }

    return (
        <button className={`${baseStyle} ${sizeStyle} ${variantStyle} ${className}`} {...props}>
            {children}
        </button>
    );
};

// 3. Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = (props) => (
    <input 
        className="flex h-11 w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800 px-3 py-2 text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white dark:focus:bg-slate-700 transition-all duration-200"
        {...props} 
    />
);

// 4. Textarea
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea: React.FC<TextareaProps> = (props) => (
    <textarea 
        className="flex min-h-[120px] w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800 px-3 py-2 text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white dark:focus:bg-slate-700 transition-all duration-200"
        {...props} 
    />
);

// 5. Card Components
interface CardProps { children: React.ReactNode; className?: string; style?: React.CSSProperties }
const Card: React.FC<CardProps> = ({ children, className, style }) => (
    <div style={style} className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden ${className}`}>
        {children}
    </div>
);
const CardHeader: React.FC<CardProps> = ({ children, className }) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);
const CardTitle: React.FC<CardProps> = ({ children, className }) => (
    <h3 className={`text-xl font-bold tracking-tight text-gray-900 dark:text-slate-100 ${className}`}>{children}</h3>
);
const CardDescription: React.FC<CardProps> = ({ children, className }) => (
    <p className={`text-sm text-gray-500 dark:text-slate-400 ${className}`}>{children}</p>
);
const CardContent: React.FC<CardProps> = ({ children, className }) => (
    <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

// --- END: PLACEHOLDER UI COMPONENTS ---

// Custom Animation Styles
const animationStyle = `
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-14px); }
}
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
}
.animate-fadeInUp {
    animation: fadeInUp 0.6s ease-out forwards;
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}
.animate-pulseGlow {
  animation: pulseGlow 2s infinite;
}
`;

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      toast({
        title: "Message Sent Successfully",
        description: "Thank you for reaching out! We aim to respond within 24 hours.",
      });
      
      setShowSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1500);
  };

  const contactDetails = [
    { icon: MapPin, title: "Our Location", text: "Thamel, Kathmandu, Nepal", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
    { icon: Phone, title: "Support Line", text: "+977 1 234 5678", color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-50 dark:bg-sky-900/30" },
    { icon: Mail, title: "Email Us", text: "info@goalfutsal.com.np", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
    { icon: Clock, title: "Open Hours", text: "Sun - Fri: 9am - 9pm", color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-50 dark:bg-sky-900/30" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 font-sans relative overflow-x-hidden transition-colors duration-300">
      <style>{animationStyle}</style>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-emerald-100/50 dark:from-emerald-900/20 to-sky-100/50 dark:to-sky-900/20 blur-3xl animate-float" />
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-sky-100/40 dark:bg-sky-900/20 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 pt-24 relative z-10">
        <div className="max-w-6xl mx-auto space-y-16">

          {/* 1. Hero Section */}
          <div className="text-center space-y-6 animate-fadeInUp">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-800 shadow-sm mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">We respond fast</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-slate-50 tracking-tight">
              Get in touch with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-sky-600 dark:from-emerald-400 dark:to-sky-400">AllFutsal</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Have questions about pitch booking, technical support, or partnership opportunities? We're here to help you get back in the game.
            </p>
          </div>

          {/* 2. Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Contact Form (7 columns) */}
            <div className="lg:col-span-7 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
              <Card className="shadow-xl border-gray-100/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a message</CardTitle>
                  <CardDescription>Fill out the form below and our team will get back to you.</CardDescription>
                </CardHeader>
                <CardContent>
                  {showSuccess ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800/50 animate-fadeInUp">
                      <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
                         <Send className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200">Message Sent!</h3>
                      <p className="text-emerald-600 dark:text-emerald-400 max-w-xs">We've received your inquiry and will contact you shortly.</p>
                      <Button variant="outline" onClick={() => setShowSuccess(false)} className="mt-4 dark:border-emerald-800 dark:hover:bg-emerald-900/20">
                        Send another message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-slate-300">Full Name</label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="e.g. Roshan Thapa"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-slate-300">Email Address</label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-slate-300">Subject</label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="How can we help you?"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-slate-300">Message</label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us more about your inquiry..."
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="pt-2">
                        <Button type="submit" className="w-full md:w-auto min-w-[160px]" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Contact Info & Socials (5 columns) */}
            <div className="lg:col-span-5 space-y-6 animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
              
              {/* Contact Details Card */}
              <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-950 border-gray-100 dark:border-slate-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {contactDetails.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-slate-700">
                      <div className={`p-3 rounded-lg ${item.bg}`}>
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{item.title}</p>
                        <p className="text-sm text-gray-600 dark:text-slate-400 tracking-wide">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Social Media Card */}
              <Card className="bg-white dark:bg-slate-900 border-emerald-100 dark:border-slate-800 shadow-xl overflow-hidden relative group">
                <div className="absolute -right-10 -bottom-10 h-32 w-32 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-2xl" />
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    Join the Community
                  </CardTitle>
                  <CardDescription className="text-slate-500 dark:text-slate-400">
                    Follow us for updates, tournament news, and venue highlights.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4 relative z-10">
                   <a href="#" className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg hover:bg-[#1877F2] transition-colors duration-300 group/fb">
                      <Facebook className="h-5 w-5 text-slate-600 dark:text-slate-300 group-hover/fb:text-white" />
                   </a>
                   <a href="#" className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg hover:bg-[#1DA1F2] transition-colors duration-300 group/tw">
                      <Twitter className="h-5 w-5 text-slate-600 dark:text-slate-300 group-hover/tw:text-white" />
                   </a>
                   <a href="#" className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg hover:bg-[#E1306C] transition-colors duration-300 group/ig">
                      <Instagram className="h-5 w-5 text-slate-600 dark:text-slate-300 group-hover/ig:text-white" />
                   </a>
                   <a href="#" className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg hover:bg-black transition-colors duration-300 group/tk">
                      <FaTiktok className="h-5 w-5 text-slate-600 dark:text-slate-300 group-hover/tk:text-white" />
                   </a>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 3. FAQ Section */}
          <div className="animate-fadeInUp" style={{ animationDelay: "0.4s" }}>
             <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Frequently Asked Questions</h2>
                <p className="text-gray-500 dark:text-slate-400 mt-2">Quick answers to common questions.</p>
             </div>
             
             <div className="grid md:grid-cols-3 gap-6">
                {[
                  { q: "How do I book a pitch?", a: "Simply log in, search for your preferred venue, select a time slot, and proceed to payment." },
                  { q: "Can I cancel my booking?", a: "Yes, cancellations made 24 hours prior to the match time are eligible for a full refund." },
                  { q: "Do you offer memberships?", a: "Some venues offer membership cards directly through our platform for discounted rates." },
                ].map((faq, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                    <div className="h-10 w-10 bg-sky-50 dark:bg-sky-900/30 rounded-full flex items-center justify-center mb-4">
                      <HelpCircle className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-slate-100 mb-2">{faq.q}</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed font-medium">{faq.a}</p>
                  </div>
                ))}
             </div>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;