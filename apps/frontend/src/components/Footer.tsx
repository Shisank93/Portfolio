"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

export function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-zinc-200/10 dark:border-zinc-800/30 light:border-zinc-200/50 py-12 bg-[#08080a] text-zinc-500 text-xs mt-auto">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Logo & Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white dark:text-white light:text-zinc-900 font-bold font-display text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e82127]" />
              Shisank
            </div>
            <p className="text-zinc-500 leading-relaxed max-w-xs text-[11px]">
              AI-Powered Personal Engineering Platform. Building practical, high-quality artificial intelligence products and secure systems.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white dark:text-white light:text-zinc-800 font-semibold tracking-wider uppercase text-[10px] font-sans">
              Quick Explore
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/projects" className="hover:text-white transition-colors">Engineering Lab</Link>
              </li>
              <li>
                <Link href="/ai-lab" className="hover:text-white transition-colors">AI Playground</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">Technical Blog</Link>
              </li>
              <li>
                <Link href="/resume" className="hover:text-white transition-colors">Resume Profile</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white dark:text-white light:text-zinc-800 font-semibold tracking-wider uppercase text-[10px] font-sans">
              Get in Touch
            </h4>
            <ul className="space-y-2 text-[11px] font-mono">
              <li className="hover:text-white transition-colors">
                shisank@example.com
              </li>
              <li className="hover:text-white transition-colors">
                Ghaziabad, India
              </li>
              <li className="text-[#10b981] flex items-center gap-1.5 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                Available for Collaborations
              </li>
            </ul>
          </div>

          {/* Stack Specifications */}
          <div className="space-y-3">
            <h4 className="text-white dark:text-white light:text-zinc-800 font-semibold tracking-wider uppercase text-[10px] font-sans">
              System Specs
            </h4>
            <p className="leading-relaxed text-[11px] max-w-xs">
              Built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **FastAPI**. Dual-engine client RAG fallback architecture.
            </p>
          </div>

        </div>

        {/* Bottom Panel */}
        <div className="pt-8 border-t border-zinc-800/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[10px]">
            <span>© {new Date().getFullYear()} Shisank. All rights reserved.</span>
            <span className="text-zinc-800">|</span>
            <span>Version 1.0.0</span>
            <span className="text-zinc-800">|</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/shisank" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-500 hover:text-white transition-colors"
              aria-label="GitHub Profile"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
            </a>
            <a 
              href="https://linkedin.com/in/shisank" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-500 hover:text-white transition-colors"
              aria-label="LinkedIn Profile"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
            <button
              onClick={handleScrollToTop}
              className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 hover:text-white transition-colors bg-zinc-900 border border-zinc-800 px-2 py-1 rounded cursor-pointer"
            >
              Back to top <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
