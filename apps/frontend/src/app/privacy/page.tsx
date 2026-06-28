"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="container-custom py-12 max-w-2xl space-y-8 text-left">
      <div>
        <Link 
          href="/" 
          className="text-zinc-500 hover:text-white transition-colors text-xs font-mono inline-flex items-center gap-1.5 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs text-[#e82127] font-mono uppercase tracking-wider">
          <Shield className="w-4 h-4" /> Compliance Notice
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-display">
          Privacy Policy
        </h1>
        <span className="text-[10px] font-mono text-zinc-500 block">Last updated: June 28, 2026</span>
      </div>

      <div className="space-y-6 text-zinc-400 text-sm leading-relaxed font-sans border-t border-zinc-900 pt-6">
        <h2 className="text-lg font-bold text-white font-display">1. Information Collection</h2>
        <p>
          Project Aether is a static-first portfolio application designed to showcase engineering capabilities. We do not track visitors or collect cookies.
        </p>

        <h2 className="text-lg font-bold text-white font-display">2. Message Submissions</h2>
        <p>
          Form data supplied in the contact section (Name, Email, Message) is processed to simulate system transactions or log records. We do not sell or distribute these emails.
        </p>

        <h2 className="text-lg font-bold text-white font-display">3. API Key Confidentiality</h2>
        <p>
          If you input a personal Google Gemini API Key inside the assistant settings tab, it is saved strictly in your browser&apos;s local storage engine. Generative requests occur directly between your browser client and Google&apos;s servers. We never transmit, log, or cache your private credentials.
        </p>

        <h2 className="text-lg font-bold text-white font-display">4. Consent</h2>
        <p>
          By interacting with the platform&apos;s simulators and chatbots, you acknowledge these security policies.
        </p>
      </div>
    </div>
  );
}
