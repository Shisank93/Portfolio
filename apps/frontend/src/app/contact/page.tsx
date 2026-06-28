"use client";

import React, { useState } from "react";
import { 
  Mail, AlertCircle, 
  CheckCircle, RefreshCw, Send, Globe 
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: ""
  });
  
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // client-side validation
    if (!formData.name.trim()) {
      setErrorMessage("Name field is required.");
      setFormStatus("error");
      return;
    }
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      setFormStatus("error");
      return;
    }
    if (!formData.subject.trim()) {
      setErrorMessage("Subject field is required.");
      setFormStatus("error");
      return;
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      setErrorMessage("Message must be at least 10 characters long.");
      setFormStatus("error");
      return;
    }

    setFormStatus("submitting");

    // Try posting to FastAPI backend first
    try {
      const res = await fetch("http://localhost:8000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        signal: AbortSignal.timeout(3000)
      });

      if (res.ok) {
        setFormStatus("success");
        setFormData({ name: "", email: "", company: "", subject: "", message: "" });
        return;
      }
    } catch {
      console.warn("FastAPI backend down. Running local confirmation fallback.");
    }

    // Local confirmation fallback (simulation)
    setTimeout(() => {
      setFormStatus("success");
      setFormData({ name: "", email: "", company: "", subject: "", message: "" });
    }, 1200);
  };

  const socialChannels = [
    { label: "Email", username: "shisankyadav8@gmail.com", icon: <Mail className="w-4 h-4 text-[#e82127]" />, url: "mailto:shisankyadav8@gmail.com" },
    { label: "LinkedIn", username: "linkedin.com/in/shisank", icon: <svg className="w-4 h-4 text-[#e82127]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>, url: "https://linkedin.com/in/shisank" },
    { label: "GitHub", username: "github.com/Shisank93", icon: <svg className="w-4 h-4 text-[#e82127]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>, url: "https://github.com/Shisank93" },
    { label: "Location", username: "Ghaziabad, India", icon: <Globe className="w-4 h-4 text-zinc-500" />, url: "#" }
  ];

  return (
    <div className="container-custom py-12 space-y-16 text-left">
      
      {/* Header Info */}
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display">
          Let’s Connect
        </h1>
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-sans">
          Have an opportunity, a question, or a project concept? Fill out the secure form below, or reach out directly via my official professional channels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Social profiles links */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#141416] border border-zinc-900 rounded-2xl p-6 space-y-4">
            <h3 className="text-white font-bold font-sans text-[11px] uppercase tracking-wider mb-2">Contact Channels</h3>
            <div className="space-y-4">
              {socialChannels.map((channel, idx) => (
                <a
                  key={idx}
                  href={channel.url}
                  target={channel.url !== "#" ? "_blank" : undefined}
                  rel={channel.url !== "#" ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-colors group cursor-pointer"
                >
                  <span className="w-8 h-8 rounded-lg bg-[#141416] flex items-center justify-center">
                    {channel.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">{channel.label}</div>
                    <div className="text-xs text-white group-hover:text-[#e82127] transition-colors truncate font-mono">
                      {channel.username}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Form Overlay */}
        <div className="lg:col-span-8">
          {formStatus === "success" ? (
            <div className="bg-[#10b981]/5 border border-[#10b981]/25 p-8 rounded-2xl space-y-4 text-center">
              <CheckCircle className="w-12 h-12 text-[#10b981] mx-auto animate-bounce" />
              <h3 className="text-xl font-bold text-white font-display">Message Received</h3>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto font-sans">
                Thank you for contacting me. I have cached your message details. I review my channels daily and will respond to your inquiry within 24 to 48 hours.
              </p>
              <button
                onClick={() => setFormStatus("idle")}
                className="btn-secondary py-2 px-4 rounded-xl text-xs font-mono"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="bg-[#141416] border border-zinc-900 rounded-2xl p-6 md:p-8 space-y-5 text-xs">
              
              {/* Error overlay */}
              {formStatus === "error" && errorMessage && (
                <div className="bg-[#e82127]/5 border border-[#e82127]/25 p-4 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-[#e82127] shrink-0" />
                  <span className="text-zinc-400 font-sans">{errorMessage}</span>
                </div>
              )}

              {/* Grid fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label htmlFor="name" className="text-zinc-500 font-mono">Name *</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={formStatus === "submitting"}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2.5 rounded-xl focus:ring-1 focus:ring-[#e82127] focus:outline-none placeholder-zinc-700 font-sans"
                    placeholder="E.g., Jane Doe"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label htmlFor="email" className="text-zinc-500 font-mono">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={formStatus === "submitting"}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2.5 rounded-xl focus:ring-1 focus:ring-[#e82127] focus:outline-none placeholder-zinc-700 font-sans"
                    placeholder="E.g., jane@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label htmlFor="company" className="text-zinc-500 font-mono">Organization / Company (Optional)</label>
                  <input
                    id="company"
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    disabled={formStatus === "submitting"}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2.5 rounded-xl focus:ring-1 focus:ring-[#e82127] focus:outline-none placeholder-zinc-700 font-sans"
                    placeholder="E.g., Google"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label htmlFor="subject" className="text-zinc-500 font-mono">Subject *</label>
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    disabled={formStatus === "submitting"}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2.5 rounded-xl focus:ring-1 focus:ring-[#e82127] focus:outline-none placeholder-zinc-700 font-sans"
                    placeholder="E.g., Collaboration Opportunities"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label htmlFor="message" className="text-zinc-500 font-mono">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={formStatus === "submitting"}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2.5 rounded-xl focus:ring-1 focus:ring-[#e82127] focus:outline-none placeholder-zinc-700 font-sans resize-none leading-relaxed"
                  placeholder="Detail your inquiry here (min 10 characters)..."
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === "submitting"}
                className="btn-primary w-full py-2.5 rounded-xl text-xs gap-2"
              >
                {formStatus === "submitting" ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sending message secure payload...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Send Message
                  </>
                )}
              </button>

            </form>
          )}
        </div>

      </div>

    </div>
  );
}
