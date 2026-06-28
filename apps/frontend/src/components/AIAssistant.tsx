"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MessageSquare, X, Send, Key, Sparkles, RefreshCw } from "lucide-react";
import { sendChatMessage, ChatMessage, ChatAction } from "../lib/ai-client";
import { useTheme } from "./ThemeProvider";

export function AIAssistant() {
  const router = useRouter();
  const pathname = usePathname();
  const { toggleTheme } = useTheme();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: `Welcome to Project Aether. I’m **Shisank AI**, your technical guide.
      
I have complete knowledge of Shisank's background, education at **Ajay Kumar Garg Engineering College**, and system details like **Astraeus AI** and **Helios Raft**. 

Ask me questions about projects, explain technical concepts, search skills, or tell me to navigate the site for you (e.g. *'go to projects'*, *'change theme to light'*). How can I help today?`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("aether-user-gemini-key") || "";
    }
    return "";
  });
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [activeEngine, setActiveEngine] = useState<"local" | "gemini">(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("aether-user-gemini-key") ? "gemini" : "local";
    }
    return "local";
  });
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Suggested questions based on PRD Section 7
  const defaultSuggestions = [
    "Tell me about Shisank.",
    "Explain his ML experience.",
    "What projects has he built?",
    "Summarize engineering philosophy.",
    "Open the resume.",
    "Show recent blog articles."
  ];

  // Persisted state synchronization verified on initial page render

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    const query = textToSend.trim();
    if (!query) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", text: query }]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(
        query,
        messages,
        pathname,
        apiKey || undefined
      );

      // Stream model response
      setMessages(prev => [...prev, { role: "model", text: response.response }]);

      // Execute AI Agent Actions returned by the pipeline (RAG Tools)
      if (response.actions && response.actions.length > 0) {
        response.actions.forEach((act: ChatAction) => {
          executeAgentAction(act);
        });
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "model", text: "I encountered a rendering error processing your prompt. Please try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const executeAgentAction = (action: ChatAction) => {
    console.log("AI Agent executing client tool action:", action);
    switch (action.type) {
      case "navigate":
        if (action.target) {
          // Check if hash route or regular page
          const cleanTarget = action.target.replace("#", "");
          router.push(cleanTarget || "/");
        }
        break;
      case "scroll":
        if (action.target) {
          const el = document.getElementById(action.target);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
        break;
      case "theme":
        if (action.target === "light" || action.target === "dark") {
          toggleTheme(action.target);
        }
        break;
      case "terminal":
        // Emit global event to open command terminal
        window.dispatchEvent(new CustomEvent("open-command-palette"));
        break;
      case "sorting_simulation":
        window.dispatchEvent(new CustomEvent("trigger-sorting-simulation"));
        break;
      default:
        break;
    }
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = apiKey.trim();
    if (cleanKey) {
      localStorage.setItem("aether-user-gemini-key", cleanKey);
      setActiveEngine("gemini");
      setMessages(prev => [
        ...prev,
        { role: "model", text: "Successfully upgraded AI engine to **Gemini Live Client**. Conversations will be powered by Google's generative models directly." }
      ]);
    } else {
      localStorage.removeItem("aether-user-gemini-key");
      setActiveEngine("local");
      setMessages(prev => [
        ...prev,
        { role: "model", text: "API Key cleared. Switched back to **Local Core** index matcher." }
      ]);
    }
    setShowKeyInput(false);
  };

  // Simple Markdown inline parser
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, lIdx) => {
      const content = line;
      
      // Headers
      if (content.startsWith("### ")) {
        return <h4 key={lIdx} className="text-sm font-bold text-white mt-3 mb-1 font-display">{content.replace("### ", "")}</h4>;
      }
      if (content.startsWith("## ")) {
        return <h3 key={lIdx} className="text-base font-bold text-white mt-4 mb-2 font-display">{content.replace("## ", "")}</h3>;
      }
      if (content.startsWith("# ")) {
        return <h2 key={lIdx} className="text-lg font-bold text-[#e82127] mt-4 mb-2 font-display">{content.replace("# ", "")}</h2>;
      }

      // Bold text: **text**
      const boldRegex = /\*\*([^*]+)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      
      while ((match = boldRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
          parts.push(content.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="text-white font-semibold">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex));
      }

      const inlineFormatted = parts.length > 0 ? parts : content;

      // Unordered lists
      if (line.trim().startsWith("- ")) {
        return (
          <li key={lIdx} className="ml-4 list-disc text-zinc-400 text-xs mb-1.5 leading-relaxed">
            {inlineFormatted}
          </li>
        );
      }

      return (
        <p key={lIdx} className="text-zinc-400 text-xs mb-2 leading-relaxed">
          {inlineFormatted}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-[#e82127] hover:bg-[#ff333a] flex items-center justify-center text-white shadow-xl hover:scale-105 transition-all duration-200 focus:outline-none"
          aria-label="Open AI Assistant"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Expandable Chat Panel */}
      {isOpen && (
        <div className="w-[380px] h-[550px] bg-[#141416] border border-[#222226] rounded-2xl flex flex-col shadow-2xl overflow-hidden font-sans">
          
          {/* Header Panel */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d10] border-b border-[#222226]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#e82127]" />
              <div>
                <h3 className="text-sm font-semibold text-white font-display">Shisank AI</h3>
                <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                  Active: <span className="capitalize">{activeEngine} core</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowKeyInput(!showKeyInput)}
                className={`text-zinc-400 hover:text-white transition-colors ${showKeyInput ? "text-[#e82127]" : ""}`}
                title="Configure Gemini API Key"
              >
                <Key className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings / API Key Panel */}
          {showKeyInput && (
            <form onSubmit={handleSaveKey} className="p-4 bg-[#0d0d10] border-b border-[#222226] text-xs">
              <p className="text-zinc-500 mb-2">Pasting a custom Gemini API Key unlocks generative responses and agent tool actions.</p>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-[#222226] text-white px-2.5 py-1.5 rounded-lg text-xs focus:ring-1 focus:ring-[#e82127] focus:outline-none"
                />
                <button type="submit" className="bg-[#e82127] text-white px-3 py-1.5 rounded-lg font-medium hover:bg-[#ff333a]">
                  Save
                </button>
              </div>
            </form>
          )}

          {/* Messages Stream Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0c0c0e]">
            {messages.map((m, idx) => (
              <div 
                key={idx}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    m.role === "user" 
                      ? "bg-[#e82127] text-white rounded-br-none" 
                      : "bg-[#1e1e22] text-zinc-300 rounded-bl-none border border-[#222226]"
                  }`}
                >
                  {m.role === "model" ? (
                    renderMarkdown(m.text)
                  ) : (
                    <p>{m.text}</p>
                  )}
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#1e1e22] border border-[#222226] rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-zinc-500 animate-spin" />
                  <span className="text-zinc-500 text-[11px] font-mono">Generative analysis...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggestions Chips Tray */}
          {messages.length < 3 && !isLoading && (
            <div className="px-4 py-2 bg-[#0c0c0e] flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none border-t border-[#1e1e22]">
              {defaultSuggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s)}
                  className="bg-[#151518] hover:bg-[#1f1f23] text-zinc-400 hover:text-white px-3 py-1.5 rounded-full border border-[#222226] text-[10px] transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input Panel */}
          <div className="p-3 bg-[#0d0d10] border-t border-[#222226] flex gap-2 items-center">
            <input
              type="text"
              placeholder="Ask Shisank AI a question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend(input)}
              className="flex-1 bg-zinc-950 border border-[#222226] text-white px-3 py-2.5 rounded-xl text-xs focus:ring-1 focus:ring-[#e82127] focus:outline-none placeholder-zinc-600"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={isLoading || !input.trim()}
              className="w-9 h-9 rounded-xl bg-[#e82127] hover:bg-[#ff333a] disabled:bg-zinc-800 disabled:text-zinc-600 flex items-center justify-center text-white transition-all cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
