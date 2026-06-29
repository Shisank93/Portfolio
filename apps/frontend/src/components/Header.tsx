"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Terminal, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const [shortcutText] = useState(() => {
    if (typeof window !== "undefined") {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      return isMac ? "⌘K" : "Ctrl+K";
    }
    return "Ctrl+K";
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on navigation
  useEffect(() => {
    setTimeout(() => {
      setHoveredLink(null);
      setActiveDropdown(null);
      setIsMobileMenuOpen(false);
    }, 0);
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "AI Lab", href: "/ai-lab" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" }
  ];

  const handleOpenTerminal = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-45 transition-all duration-300 ${
        isScrolled 
          ? "py-3 bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-white/80 backdrop-blur-md border-b border-zinc-200/10 dark:border-zinc-800/30 light:border-zinc-200/50" 
          : "py-5 bg-transparent"
      }`}
      onMouseLeave={() => {
        setHoveredLink(null);
        setActiveDropdown(null);
      }}
    >
      <div className="container-custom flex items-center justify-between relative">
        
        {/* Left Side: Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 focus:outline-none z-50">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e82127] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#e82127]"></span>
          </span>
          <span className="text-white dark:text-white light:text-zinc-900 font-bold tracking-tight font-display text-base">
            Shisank
          </span>
          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800/40 dark:bg-zinc-800/40 light:bg-zinc-200/50 border border-zinc-700/20 px-1.5 py-0.5 rounded uppercase">
            Aether v1
          </span>
        </Link>

        {/* Center Side: Desktop Navigation Links (Tesla Styled hover pill sliding effect) */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-zinc-100/50 border border-zinc-800/20 dark:border-zinc-800/20 light:border-zinc-200/50 px-2 py-1 rounded-full backdrop-blur-sm z-50">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={() => {
                setHoveredLink(link.href);
                if (["/projects", "/ai-lab", "/blog"].includes(link.href)) {
                  setActiveDropdown(link.href);
                } else {
                  setActiveDropdown(null);
                }
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors relative z-10 ${
                isActive(link.href)
                  ? "text-white"
                  : "text-zinc-400 hover:text-white dark:hover:text-white light:hover:text-zinc-900"
              }`}
            >
              {link.label}
              
              {/* Tesla sliding hover backdrop */}
              {hoveredLink === link.href && (
                <motion.span
                  layoutId="nav-hover-pill"
                  className="absolute inset-0 bg-zinc-800/40 dark:bg-zinc-800/40 light:bg-zinc-200/60 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              
              {/* Active page background if not hovered */}
              {isActive(link.href) && hoveredLink !== link.href && (
                <span className="absolute inset-0 bg-[#e82127] rounded-full -z-10" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Side: Action Tray */}
        <div className="hidden md:flex items-center gap-3 z-50">
          {/* Command Terminal Shortcut */}
          <button
            onClick={handleOpenTerminal}
            className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 hover:text-[#e82127] border border-zinc-800/30 dark:border-zinc-800/30 light:border-zinc-200/50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer bg-zinc-950/20 dark:bg-zinc-950/20 light:bg-zinc-100/50"
            title="Open terminal command palette"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{shortcutText}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => toggleTheme()}
            className="text-zinc-500 hover:text-white dark:hover:text-white light:hover:text-zinc-900 transition-colors p-1.5 cursor-pointer"
            aria-label="Toggle visual theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Resume button */}
          <Link href="/resume" className="btn-secondary py-2 px-4 rounded-xl text-xs">
            Resume
          </Link>
        </div>

        {/* Mobile Navigation controls */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => toggleTheme()}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Tesla Mega Menu Dropdown panel */}
      <AnimatePresence>
        {activeDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full bg-zinc-950/95 dark:bg-zinc-950/95 light:bg-white/95 backdrop-blur-lg border-b border-zinc-200/10 dark:border-zinc-800/30 light:border-zinc-200/50 py-10 shadow-2xl z-30"
            onMouseEnter={() => {
              // Keep dropdown active when hovered directly
              if (hoveredLink) setActiveDropdown(hoveredLink);
            }}
          >
            <div className="container-custom grid grid-cols-1 md:grid-cols-4 gap-8">
              
              {activeDropdown === "/projects" && (
                <>
                  <div className="md:col-span-1 space-y-3 border-r border-zinc-800/30 pr-4 text-left">
                    <h4 className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider font-bold">Engineering Lab</h4>
                    <h3 className="text-white dark:text-white light:text-zinc-900 font-bold font-display text-sm leading-tight">Explore Core Modules</h3>
                    <p className="text-zinc-500 text-xs font-sans leading-relaxed">
                      Deep-dive case studies, cluster logs replicator simulators, and codebase explorers.
                    </p>
                    <Link href="/projects" className="text-[#e82127] text-xs font-mono hover:underline inline-flex items-center gap-1 pt-2">
                      View all systems &rarr;
                    </Link>
                  </div>
                  <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { title: "Astraeus AI", desc: "Autonomous multi-agent sandboxes orchestrator.", slug: "astraeus-ai" },
                      { title: "Helios Raft", desc: "Go key-value store Raft consensus logs replicator.", slug: "helios-raft" },
                      { title: "Project Aether", desc: "AI personal engineering portfolio framework.", slug: "project-aether" }
                    ].map(item => (
                      <Link 
                        key={item.slug}
                        href={`/projects/${item.slug}`}
                        className="p-4 bg-zinc-900/30 dark:bg-zinc-900/30 light:bg-zinc-50/50 border border-zinc-900 hover:border-zinc-800 rounded-2xl space-y-2.5 transition-all group text-left"
                      >
                        <span className="text-[9px] bg-[#e82127]/10 text-[#e82127] font-mono px-2 py-0.5 rounded font-bold uppercase">Active</span>
                        <h4 className="text-white dark:text-white light:text-zinc-900 font-bold font-display text-xs group-hover:text-[#e82127] transition-colors">{item.title}</h4>
                        <p className="text-zinc-500 text-[10px] leading-relaxed font-sans">{item.desc}</p>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {activeDropdown === "/ai-lab" && (
                <>
                  <div className="md:col-span-1 space-y-3 border-r border-zinc-800/30 pr-4 text-left">
                    <h4 className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider font-bold">Intelligence Layer</h4>
                    <h3 className="text-white dark:text-white light:text-zinc-900 font-bold font-display text-sm leading-tight">Interactive Playgrounds</h3>
                    <p className="text-zinc-500 text-xs font-sans leading-relaxed">
                      Configure parameters and run live forward-propagation and tokenizers pipelines.
                    </p>
                    <Link href="/ai-lab" className="text-[#e82127] text-xs font-mono hover:underline inline-flex items-center gap-1 pt-2">
                      Open Playgrounds &rarr;
                    </Link>
                  </div>
                  <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: "Sentiment Analyzer Playground", desc: "Enter statements to watch live semantic transformer vector embedding calculations." },
                      { title: "Forward Propagation Visualizer", desc: "Configure dense hidden layers and nodes to animate activations floats logs." }
                    ].map((item, idx) => (
                      <Link 
                        key={idx}
                        href="/ai-lab"
                        className="p-4 bg-zinc-900/30 dark:bg-zinc-900/30 light:bg-zinc-50/50 border border-zinc-900 hover:border-zinc-800 rounded-2xl space-y-2 transition-all group text-left"
                      >
                        <span className="text-[9px] bg-zinc-800 text-zinc-500 font-mono px-2 py-0.5 rounded font-bold uppercase">Sandbox</span>
                        <h4 className="text-white dark:text-white light:text-zinc-900 font-bold font-display text-xs group-hover:text-[#e82127] transition-colors">{item.title}</h4>
                        <p className="text-zinc-500 text-[10px] leading-relaxed font-sans">{item.desc}</p>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {activeDropdown === "/blog" && (
                <>
                  <div className="md:col-span-1 space-y-3 border-r border-zinc-800/30 pr-4 text-left">
                    <h4 className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider font-bold">Technical Diary</h4>
                    <h3 className="text-white dark:text-white light:text-zinc-900 font-bold font-display text-sm leading-tight">Research & Writing</h3>
                    <p className="text-zinc-500 text-xs font-sans leading-relaxed">
                      Engineering notes on distributed databases, Sandboxes lints, and RAG architectures.
                    </p>
                    <Link href="/blog" className="text-[#e82127] text-xs font-mono hover:underline inline-flex items-center gap-1 pt-2">
                      View all articles &rarr;
                    </Link>
                  </div>
                  <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: "MLOps with Secure Docker Sandbox Isolation", desc: "Architecting isolated containers runtimes for dynamic validation execution.", slug: "mlops-with-docker" },
                      { title: "Raft Consensus Log Replication Design", desc: "Understanding split-brain mitigations, randomized timers, and RPC configurations.", slug: "raft-consensus-design" }
                    ].map(item => (
                      <Link 
                        key={item.slug}
                        href={`/blog/${item.slug}`}
                        className="p-4 bg-zinc-900/30 dark:bg-zinc-900/30 light:bg-zinc-50/50 border border-zinc-900 hover:border-zinc-800 rounded-2xl space-y-2 transition-all group text-left"
                      >
                        <span className="text-[9px] bg-zinc-800 text-zinc-500 font-mono px-2 py-0.5 rounded font-bold uppercase">Read Note</span>
                        <h4 className="text-white dark:text-white light:text-zinc-900 font-bold font-display text-xs group-hover:text-[#e82127] transition-colors">{item.title}</h4>
                        <p className="text-zinc-500 text-[10px] leading-relaxed font-sans">{item.desc}</p>
                      </Link>
                    ))}
                  </div>
                </>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0d0d10] border-b border-zinc-800/40 py-6 px-6 space-y-4">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-2 text-sm font-medium border-b border-zinc-800/10 ${
                  isActive(link.href) ? "text-[#e82127]" : "text-zinc-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleOpenTerminal();
              }}
              className="flex items-center justify-center gap-2 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-xl text-xs font-mono"
            >
              <Terminal className="w-4 h-4" />
              Open Terminal ({shortcutText})
            </button>
            <Link
              href="/resume"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-secondary py-2.5 text-center text-xs"
            >
              Resume
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
