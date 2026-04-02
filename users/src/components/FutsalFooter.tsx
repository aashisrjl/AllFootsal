import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFutsalById, getFutsalInfo, getFutsalLocation, getFutsalMedia, sendContactMessage } from "@/lib/futsalApi";
import { Mail, Phone, MapPin, Facebook, Instagram, Loader2, Globe, Send, Home, Info, Image, Map } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const safelyParse = (str: string) => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

export default function FutsalFooter() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { data: baseData } = useQuery({ queryKey: ['futsal-base', id], queryFn: () => getFutsalById(id as string), enabled: !!id });
  const { data: infoData } = useQuery({ queryKey: ['futsal-info', id], queryFn: () => getFutsalInfo(id as string), enabled: !!id });
  const { data: locData } = useQuery({ queryKey: ['futsal-loc', id], queryFn: () => getFutsalLocation(id as string), enabled: !!id });
  const { data: logoMedia } = useQuery({ queryKey: ['futsal-media-logo', id], queryFn: () => getFutsalMedia(id as string, 'logo'), enabled: !!id });

  if (!id) return null;

  const futsal = baseData?.data;
  if (!futsal) return null;

  const info = infoData?.data?.[0];
  const loc = locData?.data?.[0];
  
  const logoData = Array.isArray(logoMedia) ? logoMedia : logoMedia?.data;
  const logoUrl = logoData?.[0]?.url || logoData?.[0]?.media_url;

  const socialLinks = info?.social_links ? safelyParse(info.social_links) : null;
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSending(true);
    try {
      await sendContactMessage(id, message);
      toast.success("Message sent successfully!");
      setMessage("");
    } catch(err) {
      toast.error("Failed to send message. Please log in or try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleNav = (hash: string) => {
      if (hash === 'gallery') {
          navigate(`/futsals/${id}/gallery`);
          return;
      }
      if (location.pathname !== `/futsals/${id}`) {
          navigate(`/futsals/${id}#${hash}`);
          setTimeout(() => {
              document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 300);
      } else {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
  };

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-8 border-t-4 border-emerald-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Logo & Basic Info */}
          <div>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${futsal.futsalName} Logo`}
                className="h-20 w-auto object-contain mb-5 transition-transform duration-300 hover:scale-105 bg-white/10 rounded-2xl p-2 backdrop-blur-sm"
              />
            ) : (
                <div className="h-20 w-20 flex items-center justify-center bg-emerald-500 text-white font-extrabold text-3xl rounded-2xl mb-5 shadow-lg shadow-emerald-500/30">
                    {futsal.futsalName?.charAt(0) || "F"}
                </div>
            )}
            
            <h3 className="text-xl font-bold mb-3 text-emerald-400">{futsal.futsalName}</h3>
            <p className="text-slate-300/80 mb-4 leading-relaxed text-sm">
              {info?.additional_info?.substring(0, 120)}{info?.additional_info?.length > 120 ? "..." : ""}
            </p>
            
            <div className="flex gap-4">
              {socialLinks?.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="text-white/70 hover:text-[#1877F2] transition hover:scale-110">
                  <Facebook size={24} />
                </a>
              )}
              {socialLinks?.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-white/70 hover:text-[#E4405F] transition hover:scale-110">
                  <Instagram size={24} />
                </a>
              )}
              {info?.website_url && (
                <a href={info.website_url} target="_blank" rel="noreferrer" aria-label="Website" className="text-white/70 hover:text-emerald-400 transition hover:scale-110">
                  <Globe size={24} />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-5 flex items-center gap-2">
                <span className="w-8 h-1 bg-emerald-500 rounded-full"></span> Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <button onClick={() => handleNav("home")} className="text-slate-300/80 hover:text-emerald-400 transition font-medium flex items-center gap-2 hover:translate-x-1">
                  <Home className="h-4 w-4" /> Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("about")} className="text-slate-300/80 hover:text-emerald-400 transition font-medium flex items-center gap-2 hover:translate-x-1">
                  <Info className="h-4 w-4" /> About Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("pitches")} className="text-slate-300/80 hover:text-emerald-400 transition font-medium flex items-center gap-2 hover:translate-x-1">
                  <Map className="h-4 w-4" /> Pitches
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("gallery")} className="text-slate-300/80 hover:text-emerald-400 transition font-medium flex items-center gap-2 hover:translate-x-1">
                  <Image className="h-4 w-4" /> Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div>
            <h4 className="text-lg font-bold mb-5 flex items-center gap-2">
                <span className="w-8 h-1 bg-emerald-500 rounded-full"></span> Contact Info
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="bg-white/10 p-2 rounded-lg text-emerald-400">
                    <MapPin size={20} />
                </div>
                <div>
                   <p className="text-sm font-bold text-white mb-0.5">Address</p>
                   <span className="text-slate-300/80 text-sm max-w-[200px] block leading-snug">
                     {loc?.address || "Address not provided"}, {loc?.city}
                   </span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-white/10 p-2 rounded-lg text-emerald-400">
                    <Phone size={20} />
                </div>
                <div>
                    <p className="text-sm font-bold text-white mb-0.5">Phone</p>
                    <span className="text-slate-300/80 text-sm block leading-snug">{futsal.phoneNumber || "Phone not provided"}</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-white/10 p-2 rounded-lg text-emerald-400">
                    <Mail size={20} />
                </div>
                <div>
                    <p className="text-sm font-bold text-white mb-0.5">Email</p>
                    <span className="text-slate-300/80 text-sm block leading-snug">{futsal.email || "Email not provided"}</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Send Message */}
          <div>
             <h4 className="text-lg font-bold mb-5 flex items-center gap-2">
                <span className="w-8 h-1 bg-emerald-500 rounded-full"></span> Send Message
            </h4>
            <p className="text-slate-300/80 mb-4 text-sm">
              Use this quick form to send us a direct message for any inquiries!
            </p>
            <form onSubmit={handleSendMessage} className="space-y-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message..."
                required
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white placeholder:text-white/40 text-sm resize-none"
              />
              <motion.button
                type="submit"
                disabled={isSending}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold transition shadow-lg shadow-emerald-500/20 text-sm flex items-center justify-center text-white"
              >
                {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-4 w-4 mr-2" /> Send to Futsal</>}
              </motion.button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-slate-300/70">
          <p>&copy; {new Date().getFullYear()} {futsal.futsalName}. All rights reserved.</p>
          <p className="mt-1 text-xs">Powered by the NepFutsal Ecosystem.</p>
        </div>
      </div>
    </footer>
  );
}
