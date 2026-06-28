"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { 
  Search, Terminal, ArrowRight, Sparkles, BookOpen, 
  Cpu, FileText, Mail, Sun, Moon, X, Info
} from "lucide-react";

interface CommandItem {
  icon: React.ReactNode;
  label: string;
  command: string;
  action: () => void;
  category: string;
}

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Command database
  const commands: CommandItem[] = [
    {
      category: "Navigation",
      icon: <Cpu className="w-4 h-4" />,
      label: "Go to Home Identity",
      command: "/home",
      action: () => { router.push("/"); onClose(); }
    },
    {
      category: "Navigation",
      icon: <Cpu className="w-4 h-4" />,
      label: "Go to Engineering Lab & Projects",
      command: "/projects",
      action: () => { router.push("/projects"); onClose(); }
    },
    {
      category: "Navigation",
      icon: <Sparkles className="w-4 h-4" />,
      label: "Go to AI Demonstration Lab",
      command: "/ai-lab",
      action: () => { router.push("/ai-lab"); onClose(); }
    },
    {
      category: "Navigation",
      icon: <BookOpen className="w-4 h-4" />,
      label: "Go to Technical Blog",
      command: "/blog",
      action: () => { router.push("/blog"); onClose(); }
    },
    {
      category: "Navigation",
      icon: <Info className="w-4 h-4" />,
      label: "Go to About Shisank",
      command: "/about",
      action: () => { router.push("/about"); onClose(); }
    },
    {
      category: "Navigation",
      icon: <Mail className="w-4 h-4" />,
      label: "Go to Contact Details",
      command: "/contact",
      action: () => { router.push("/contact"); onClose(); }
    },
    {
      category: "Navigation",
      icon: <FileText className="w-4 h-4" />,
      label: "Go to Interactive Resume",
      command: "/resume",
      action: () => { router.push("/resume"); onClose(); }
    },
    {
      category: "Preferences",
      icon: <Sun className="w-4 h-4" />,
      label: "Switch Theme to Light Mode",
      command: "/theme light",
      action: () => { toggleTheme("light"); onClose(); }
    },
    {
      category: "Preferences",
      icon: <Moon className="w-4 h-4" />,
      label: "Switch Theme to Dark Mode",
      command: "/theme dark",
      action: () => { toggleTheme("dark"); onClose(); }
    },
    {
      category: "Developer Utilities",
      icon: <Terminal className="w-4 h-4" />,
      label: "Execute System Environment Diagnostics",
      command: "/sysinfo",
      action: () => runSysInfo()
    },
    {
      category: "Developer Utilities",
      icon: <Terminal className="w-4 h-4" />,
      label: "Launch Matrix Digital Code Rain",
      command: "/matrix",
      action: () => runMatrixRain()
    }
  ];

  // Filter commands
  const filteredCommands = commands.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.command.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setQuery("");
        setSelectedIndex(0);
        setShowLogs(false);
      }, 0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  // Handle keys
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      if (showLogs) {
        setShowLogs(false);
      } else {
        onClose();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      
      // Check if command is typed directly
      const directMatch = commands.find(c => c.command.toLowerCase() === query.trim().toLowerCase());
      if (directMatch) {
        directMatch.action();
      } else if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  };

  const runSysInfo = () => {
    setShowLogs(true);
    setTerminalLogs([
      "Initializing System Diagnostics...",
      "Connecting to local Aether environment...",
      `OS Platform: ${navigator.platform || "macOS"}`,
      `User Agent: ${navigator.userAgent.substring(0, 50)}...`,
      `Theme Configuration: ${theme.toUpperCase()} MODE`,
      "Analyzing Browser JS Heap size...",
      `Active JS Engine: V8 / WebKit compiler`,
      `Uptime Status: 100% (Client Fallback active)`,
      "Diagnostics Complete. Terminal idle."
    ]);
  };

  const runMatrixRain = () => {
    setShowLogs(true);
    setTerminalLogs(["Initializing Matrix Core..."]);
    
    let iterations = 0;
    const interval = setInterval(() => {
      const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@%";
      let line = "";
      for (let i = 0; i < 30; i++) {
        line += chars.charAt(Math.floor(Math.random() * chars.length)) + " ";
      }
      setTerminalLogs(prev => [...prev.slice(-15), line]);
      iterations++;
      
      if (iterations > 40) {
        clearInterval(interval);
        setTerminalLogs(prev => [...prev, ">> Matrix simulation halted. System restored."]);
      }
    }, 80);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 terminal-overlay flex items-start justify-center pt-[15vh] px-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl terminal-box flex flex-col overflow-hidden max-h-[60vh]"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-[#222226] px-4 py-3 bg-[#0d0d10]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
            <span className="text-xs font-mono text-zinc-500 ml-2">aether-terminal@shisank: ~</span>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
            aria-label="Close Command Palette"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Console Logs View */}
        {showLogs ? (
          <div className="flex-1 overflow-y-auto p-6 font-mono text-xs text-zinc-300 min-h-[300px] max-h-[350px] bg-[#08080a]">
            {terminalLogs.map((log, index) => (
              <div key={index} className="mb-2 leading-relaxed whitespace-pre-wrap">
                <span className="text-zinc-500 mr-2">$</span>
                {log}
              </div>
            ))}
            <div ref={logsEndRef} />
            <div className="mt-4 pt-4 border-t border-[#222226]">
              <button 
                onClick={() => setShowLogs(false)}
                className="text-[#e82127] hover:underline flex items-center gap-1 font-sans text-sm"
              >
                Back to command list <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[#0f0f13] border-b border-[#222226]">
              <Search className="w-5 h-5 text-zinc-500" />
              <input 
                ref={inputRef}
                type="text"
                placeholder="Type a page, command (/sysinfo, /matrix) or setting..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-0 text-white placeholder-zinc-500 focus:ring-0 text-sm focus:outline-none"
              />
              <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700">
                ESC
              </span>
            </div>

            {/* Suggestions list */}
            <div className="flex-1 overflow-y-auto max-h-[350px] p-2 bg-[#0c0c0e]">
              {filteredCommands.length === 0 ? (
                <div className="p-4 text-center text-sm text-zinc-500">
                  No commands or pages match your search.
                </div>
              ) : (
                // Group by category
                Object.entries(
                  filteredCommands.reduce((acc, cmd) => {
                    if (!acc[cmd.category]) acc[cmd.category] = [];
                    acc[cmd.category].push(cmd);
                    return acc;
                  }, {} as { [key: string]: CommandItem[] })
                ).map(([category, items]) => (
                  <div key={category} className="mb-2">
                    <h3 className="px-3 py-1 text-[11px] font-bold text-zinc-500 tracking-wider uppercase font-sans">
                      {category}
                    </h3>
                    <div className="space-y-0.5 mt-1">
                      {items.map((item) => {
                        const globalIndex = filteredCommands.indexOf(item);
                        const isSelected = globalIndex === selectedIndex;
                        return (
                          <button
                            key={item.command}
                            onClick={item.action}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors font-sans text-sm ${
                              isSelected 
                                ? "bg-zinc-800 text-white" 
                                : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={isSelected ? "text-[#e82127]" : "text-zinc-500"}>
                                {item.icon}
                              </span>
                              <span>{item.label}</span>
                            </div>
                            <span className="text-xs font-mono text-zinc-500">
                              {item.command}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
