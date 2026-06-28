"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Terminal, Menu, X } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? "py-3 bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-white/80 backdrop-blur-md border-b border-zinc-200/10 dark:border-zinc-800/30 light:border-zinc-200/50" 
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        
        {/* Left Side: Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 focus:outline-none">
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

        {/* Center Side: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-zinc-100/50 border border-zinc-800/20 dark:border-zinc-800/20 light:border-zinc-200/50 px-2 py-1 rounded-full backdrop-blur-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-[#e82127] text-white"
                  : "text-zinc-400 hover:text-white dark:hover:text-white light:hover:text-zinc-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side: Action Tray */}
        <div className="hidden md:flex items-center gap-3">
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
