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
        variantStyle = 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl';
    } else if (variant === 'accent') {
        variantStyle = 'bg-sky-600 text-white hover:bg-sky-700 shadow-lg hover:shadow-xl';
    } else if (variant === 'outline') {
        variantStyle = 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-emerald-500';
    } else {
        variantStyle = 'bg-gray-200 text-gray-800 hover:bg-gray-300';
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
        className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
        {...props} 
    />
);

// 4. Textarea
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea: React.FC<TextareaProps> = (props) => (
    <textarea 
        className="flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
        {...props} 
    />
);

// 5. Card Components
interface CardProps { children: React.ReactNode; className?: string; }
const Card: React.FC<CardProps> = ({ children, className }) => (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-all duration-500 hover:shadow-xl ${className}`}>
        {children}
    </div>
);
const CardHeader: React.FC<CardProps> = ({ children, className }) => (
    <div className={`flex flex-col space-y-1.5 pb-4 ${className}`}>{children}</div>
);
const CardTitle: React.FC<CardProps> = ({ children, className }) => (
    <h3 className={`text-xl font-bold tracking-tight text-gray-900 ${className}`}>{children}</h3>
);
const CardDescription: React.FC<CardProps> = ({ children, className }) => (
    <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
);
const CardContent: React.FC<CardProps> = ({ children, className }) => (
    <div className={`p-0 ${className}`}>{children}</div>
);

// --- END: PLACEHOLDER UI COMPONENTS ---

// Custom Animation Class (for subtle entrance)
const ANIMATION_CLASSES = "opacity-0 translate-y-4 animate-fadeInUp fill-mode-forwards";

// CSS for the custom animation (must be inline)
const animationStyle = `
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fadeInUp {
    animation-name: fadeInUp;
    animation-duration: 0.6s;
    animation-timing-function: ease-out;
}
.fill-mode-forwards {
    animation-fill-mode: forwards;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent Successfully",
        description: "Thank you for reaching out! We aim to respond within 24 hours.",
      });
      
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const contactInfo = [
    { icon: MapPin, title: "Our Location", text: "Thamel, Kathmandu, Nepal", color: "text-emerald-600" },
    { icon: Phone, title: "Call Us (24/7 Support)", text: "+977 1 234 5678", color: "text-sky-600" },
    { icon: Mail, title: "General Inquiries", text: "info@goalfutsal.com.np", color: "text-emerald-600" },
    { icon: Clock, title: "Business Hours", text: "Sun - Fri: 9:00 AM - 5:00 PM", color: "text-sky-600" },
  ];

  return (
    <>
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Inject Custom CSS for animation */}
      <style>{animationStyle}</style>

      {/* Placeholder for imported Header component */}
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-16 pt-32">
        <div className="max-w-6xl mx-auto">

          {/* Hero/Title Section with Animation */}
          <div className={`text-center mb-16 ${ANIMATION_CLASSES}`} style={{animationDelay: '0.1s'}}>
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Get in Touch with AllFutsal
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're here to help you with pitch bookings, partnerships, or any other query.
            </p>
          </div>
          
          {/* Main Contact Grid: Form (2/3) and Info (1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* 1. Contact Form */}
            <Card className={`lg:col-span-2 p-8 shadow-2xl transition-all duration-500 hover:shadow-emerald-300/50 ${ANIMATION_CLASSES}`} style={{animationDelay: '0.3s'}}>
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-3xl font-extrabold text-emerald-600">
                  <MessageSquare className="h-7 w-7" />
                  Direct Inquiry Form
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Please provide detailed information so we can assist you efficiently.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-semibold text-gray-700">
                        Your Full Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-semibold text-gray-700">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="e.g., Pitch Booking Issue, Partnership Inquiry"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-semibold text-gray-700">
                      Your Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Describe your query in detail..."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Submitting...</>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Professional Inquiry
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            {/* 2. Contact Information & Socials */}
            <div className={`space-y-6 ${ANIMATION_CLASSES}`} style={{animationDelay: '0.5s'}}>
              
              {/* Card 1: Main Contact Details (Blue accent for contrast) */}
              <Card className="p-6 bg-green-200 border-sky-200 hover:shadow-sky-300/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
                    <Building className="h-6 w-6 text-sky-600" />
                    Office & Direct Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactInfo.map((item, index) => (
                    <div 
                      key={index} 
                      className={`flex gap-4 p-3 rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] border border-gray-100`} 
                    >
                      <item.icon className={`h-5 w-5 shrink-0 ${item.color}`} />
                      <div>
                        <h3 className="font-semibold text-gray-800 text-base">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Card 2: Social Media/Community (Black accent) */}
              <Card className="p-6 bg-gray-900 text-white border-gray-700 hover:shadow-gray-700/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-2xl ">
                    <Users className="h-6 w-6 text-emerald-400" />
                    Connect with Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    Follow us for real-time updates on pitch availability and events.
                  </p>
                  <div className="flex gap-4">
                    <Button variant="accent" size="icon" className="hover:scale-110">
                      <Facebook className="h-5 w-5" />
                    </Button>
                    <Button variant="accent" size="icon" className="hover:scale-110">
                      <Twitter className="h-5 w-5" />
                    </Button>
                    <Button variant="accent" size="icon" className="hover:scale-110">
                      <Instagram className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* FAQ Section - Below the main content */}
          <div className={`mt-16 ${ANIMATION_CLASSES}`} style={{animationDelay: '0.8s'}}>
            <Card className="bg-white p-8">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-3xl font-extrabold text-sky-600 flex items-center justify-center gap-3">
                    <HelpCircle className="h-7 w-7" />
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription className="text-base">Quick answers to common queries about booking and facilities.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 transition-all duration-300 hover:shadow-md">
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">How do I book a futsal pitch?</h3>
                            <p className="text-gray-600 text-sm">
                              Simply browse available facilities on our homepage, choose your desired time slot, and proceed to secure your reservation online.
                            </p>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 transition-all duration-300 hover:shadow-md">
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">What is your cancellation policy?</h3>
                            <p className="text-gray-600 text-sm">
                              Bookings can be cancelled up to 24 hours prior to the scheduled time for a full refund. Cancellations within 24 hours may incur a penalty fee.
                            </p>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 transition-all duration-300 hover:shadow-md">
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">How do I become a facility partner?</h3>
                            <p className="text-gray-600 text-sm">
                              Please email our dedicated partnerships team at <b className="text-emerald-600">partners@Allfutsal.com.np</b> with details about your facility.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Placeholder for imported Footer component */}
      <Footer />
    </div>
    </>
  );
};

export default Contact;