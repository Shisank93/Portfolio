"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowRight, Sparkles, Code2, Terminal, 
  Globe, Database, Settings, Wrench, 
  FileText, Calendar, Clock, MessageSquare
} from "lucide-react";
import { PROJECTS, BLOGS, RESUME_DATA } from "../data/portfolioData";

export default function Home() {
  
  // Custom event to trigger AI Assistant chat injection
  const triggerAIChat = (message: string) => {
    // Check if assistant FAB is clicked. In a real app we open it first.
    const fabButton = document.querySelector('button[aria-label="Open AI Assistant"]') as HTMLButtonElement;
    if (fabButton) {
      fabButton.click();
    }
    
    // We delay slightly to let the UI render, then dispatch a message trigger
    setTimeout(() => {
      const chatInput = document.querySelector('input[placeholder="Ask Shisank AI a question..."]') as HTMLInputElement;
      const sendButton = document.querySelector('button[aria-label="Send message"]') as HTMLButtonElement;
      if (chatInput && sendButton) {
        // Set value and trigger send
        const prototype = Object.getPrototypeOf(chatInput);
        const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
        setter?.call(chatInput, message);
        chatInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        setTimeout(() => sendButton.click(), 50);
      }
    }, 150);
  };

  const handleOpenTerminal = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  const featuredProjects = PROJECTS.slice(0, 3);
  const latestBlogs = BLOGS.slice(0, 2);

  // Group skills
  const skillsCategories = [
    { name: "Programming", icon: <Code2 className="w-4 h-4 text-[#e82127]" />, key: "Programming" },
    { name: "AI & Machine Learning", icon: <Sparkles className="w-4 h-4 text-[#e82127]" />, key: "AI / ML" },
    { name: "Cloud Infrastructure", icon: <Globe className="w-4 h-4 text-[#e82127]" />, key: "Cloud" },
    { name: "Databases & Storage", icon: <Database className="w-4 h-4 text-[#e82127]" />, key: "Databases" },
    { name: "DevOps & Pipelines", icon: <Settings className="w-4 h-4 text-[#e82127]" />, key: "DevOps" },
    { name: "Development Tools", icon: <Wrench className="w-4 h-4 text-[#e82127]" />, key: "Tools" }
  ];

  const defaultSuggestions = [
    "Tell me about Shisank.",
    "Explain his ML experience.",
    "What projects has he built?",
    "Summarize engineering philosophy.",
    "Open the resume.",
    "Show recent blog articles."
  ];

  return (
    <div className="space-y-32">
      
      {/* 2. HERO SECTION */}
      <section className="container-custom min-h-[85vh] flex flex-col md:flex-row items-center justify-between gap-12 pt-8 md:pt-16">
        
        {/* Hero Left: Text & Action */}
        <div className="flex-1 space-y-8 text-left max-w-xl">
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full text-xs text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            B.Tech Computer Science CSE (AI & ML)
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.1]">
            Building AI Products That <span className="text-[#e82127]">Solve Real</span> Problems
          </h1>
          
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed font-sans">
            Specialized in bridging high-performance systems engineering with intelligent agent runtimes. Developing robust distributed backends in Go and training/deploying grounded LLM pipelines in Python.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/projects" className="btn-primary gap-2 text-sm font-medium">
              Explore Engineering Lab
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button 
              onClick={() => triggerAIChat("Tell me about Shisank.")}
              className="btn-secondary gap-2 text-sm font-medium"
            >
              Chat with My AI
            </button>
            <Link 
              href="/resume" 
              className="text-zinc-500 hover:text-white transition-colors text-xs font-mono flex items-center gap-1.5 ml-2 hover:underline"
            >
              <FileText className="w-4 h-4" /> Download Resume
            </Link>
          </div>
        </div>

        {/* Hero Right: Precision Code Console Graphic (CDD Compliant, no particle rain) */}
        <div className="flex-1 w-full max-w-lg">
          <div className="terminal-box border border-zinc-800 rounded-2xl overflow-hidden font-mono text-xs text-zinc-400 bg-black/60 shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d10] border-b border-zinc-900">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                <span className="text-[10px] text-zinc-500 ml-2 font-mono">shisank@aether-kernel: ~</span>
              </div>
              <Terminal className="w-3.5 h-3.5 text-zinc-600" />
            </div>
            <div className="p-5 space-y-3 min-h-[220px]">
              <div className="text-zinc-600"># Initializing Project Aether runtime...</div>
              <div><span className="text-[#e82127]">$</span> pnpm run info</div>
              <div className="text-zinc-300">
                &gt; Name: <span className="text-white font-semibold">Shisank</span><br />
                &gt; Field: <span className="text-[#10b981]">Computer Science (AI & ML)</span><br />
                &gt; University: <span className="text-white">Ajay Kumar Garg Engineering College</span><br />
                &gt; Graduation: <span className="text-zinc-500">2028 (B.Tech)</span>
              </div>
              <div><span className="text-[#e82127]">$</span> print-stack --filter core</div>
              <div className="text-zinc-300">
                [AI-ML] LangChain, PyTorch, RAG context validation<br />
                [Systems] Go Concurrency, Raft Distributed Consensus
              </div>
              <div className="text-zinc-600 animate-pulse">&gt; Terminal idle. Type Cmd+K for command menu.</div>
            </div>
          </div>
        </div>

      </section>

      {/* 3. FEATURED ENGINEERING WORK */}
      <section className="container-custom space-y-12">
        <div className="space-y-4 text-left">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-display">
            Featured Engineering Work
          </h2>
          <p className="text-zinc-500 text-sm max-w-xl font-sans">
            Demonstrating actual systems implementation, distributed coordination, and machine learning pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <div 
              key={project.id}
              className="card-obsidian flex flex-col justify-between group h-full"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-500 px-2.5 py-1 rounded">
                    {project.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    project.status === "Completed" 
                      ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20" 
                      : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white group-hover:text-[#e82127] transition-colors font-display">
                  {project.title}
                </h3>
                
                <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tech_stack.slice(0, 4).map((tech) => (
                    <span key={tech} className="badge-tech text-[10px] py-0.5 px-2">
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack.length > 4 && (
                    <span className="text-[10px] text-zinc-500 font-mono self-center">
                      +{project.tech_stack.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-900 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-mono">Build: {project.build_time}</span>
                <Link 
                  href={`/projects/${project.slug}`}
                  className="text-white hover:text-[#e82127] font-medium inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
                >
                  View Case Study
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ENGINEERING LAB PREVIEW */}
      <section className="container-custom space-y-12">
        <div className="space-y-4 text-left">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-display">
            Explore the Lab
          </h2>
          <p className="text-zinc-500 text-sm max-w-xl font-sans">
            Organized by technical sub-domains, mimicking the R&D division of a premium engineering firm.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { title: "Machine Learning", count: 1, desc: "Neural Architectures" },
            { title: "Deep Learning", count: 1, desc: "Dense Models" },
            { title: "MLOps", count: 1, desc: "Container Isolations" },
            { title: "Systems Engineering", count: 1, desc: "Consensus WAL Stores" },
            { title: "AI Web Engineering", count: 1, desc: "Unified RAG Platforms" },
            { title: "Future Concepts", count: 3, desc: "Distributed Agents" }
          ].map((cat, idx) => (
            <Link 
              key={idx}
              href="/projects"
              className="bg-[#141416]/50 hover:bg-[#141416] border border-zinc-900 hover:border-zinc-800 p-5 rounded-2xl flex flex-col justify-between text-left transition-all hover:-translate-y-1"
            >
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-white font-display leading-tight">{cat.title}</h3>
                <p className="text-[10px] text-zinc-500 font-mono">{cat.desc}</p>
              </div>
              <span className="text-[10px] text-zinc-600 font-mono mt-6 block">
                {cat.count} {cat.count === 1 ? "Project" : "Projects"}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. SKILLS & TECHNOLOGY STACK */}
      <section className="container-custom space-y-12">
        <div className="space-y-4 text-left">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-display">
            Core Technology Stack
          </h2>
          <p className="text-zinc-500 text-sm max-w-xl font-sans">
            Categorized technical capabilities showing depth in backend systems and artificial intelligence libraries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillsCategories.map((cat, idx) => {
            const list = RESUME_DATA.skills[cat.key] || [];
            return (
              <div 
                key={idx} 
                className="bg-[#141416] border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between h-full"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {cat.icon}
                    <h3 className="text-sm font-bold text-white font-display">{cat.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {list.map((skill) => (
                      <span 
                        key={skill}
                        className="text-[11px] bg-zinc-950 text-zinc-400 px-3 py-1.5 rounded-lg border border-zinc-900 font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. LEARNING JOURNEY */}
      <section className="container-custom space-y-16">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-display">
            Engineering Timeline
          </h2>
          <p className="text-zinc-500 text-sm max-w-xl mx-auto font-sans">
            A chronological timeline detailing {"Shisank's"} progressive mastery of programming, systems engineering, and AI architectures.
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto pl-8 border-l border-zinc-800 space-y-10 py-2">
          {RESUME_DATA.timeline.map((item, idx) => (
            <div key={idx} className="relative group text-left">
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full border-2 border-zinc-950 bg-zinc-800 group-hover:bg-[#e82127] group-hover:scale-110 transition-all duration-200" />
              
              <div className="space-y-1">
                <span className="text-xs font-mono text-zinc-500 font-bold">{item.year}</span>
                <p className="text-sm text-zinc-300 font-medium group-hover:text-white transition-colors leading-relaxed font-sans">
                  {item.event}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. AI ASSISTANT PREVIEW */}
      <section className="container-custom">
        <div className="bg-[#141416] border border-zinc-900 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden">
          
          {/* Subtle graphic accent background */}
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#e82127]/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="flex-1 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 text-xs text-[#e82127] font-mono uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Intelligence Layer
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-display">
              Aether Core Assistant
            </h2>
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-sans">
              {"Don't"} waste time scrolling. Click any recommended prompt below or open the floating AI drawer to query {"Shisank's"} experience directly. The assistant runs with session memory and direct page awareness.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {defaultSuggestions.slice(0, 4).map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => triggerAIChat(s)}
                  className="bg-zinc-950 hover:bg-[#1a1a20]/40 text-zinc-400 hover:text-white border border-zinc-800 px-3.5 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full max-w-sm">
            <div 
              onClick={() => triggerAIChat("")}
              className="bg-zinc-950 border border-zinc-900 hover:border-zinc-800 p-4 rounded-2xl flex items-center justify-between text-left cursor-pointer group transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#e82127]">
                  <MessageSquare className="w-4.5 h-4.5" />
                </span>
                <span className="text-xs text-zinc-500 font-medium">Ask Shisank AI...</span>
              </div>
              <span className="btn-primary py-2 px-3.5 rounded-lg text-[10px] font-medium font-sans">
                Launch Chat
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 8. LATEST TECHNICAL ARTICLES */}
      <section className="container-custom space-y-12">
        <div className="space-y-4 text-left">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-display">
            Technical Knowledge Base
          </h2>
          <p className="text-zinc-500 text-sm max-w-xl font-sans">
            Documenting engineering challenges, system designs, MLOps runtimes, and practical algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestBlogs.map((blog) => (
            <div 
              key={blog.id}
              className="bg-[#141416] border border-zinc-900 hover:border-zinc-800 p-6 rounded-2xl flex flex-col justify-between group transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span className="bg-zinc-950 border border-zinc-850 px-2 py-0.5 rounded">{blog.category}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {blog.reading_time}</span>
                </div>
                
                <h3 className="text-lg font-bold text-white group-hover:text-[#e82127] transition-colors font-display">
                  {blog.title}
                </h3>
                
                <p className="text-zinc-400 text-xs leading-relaxed font-sans line-clamp-3">
                  {blog.summary}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-900 flex items-center justify-between text-xs">
                <span className="text-zinc-600 font-mono flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {blog.published_date}</span>
                <Link 
                  href={`/blog/${blog.slug}`}
                  className="text-white hover:text-[#e82127] font-medium inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
                >
                  Read Note
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}

          {/* Core study placeholder */}
          <div className="bg-[#141416]/40 border border-zinc-900/50 p-6 rounded-2xl flex flex-col justify-between opacity-80 select-none">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-600">
                <span className="bg-zinc-950/30 border border-zinc-900 px-2 py-0.5 rounded">R&D Core</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 12 Min Read</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-500 font-display">
                Distributed Vector Embedding Indexing Systems
              </h3>
              <p className="text-zinc-600 text-xs leading-relaxed font-sans">
                Reviewing design trade-offs of storing and querying high-dimensional vectors. Implementing sparse indexing models.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-900/40 flex items-center justify-between text-xs">
              <span className="text-zinc-700 font-mono">Future Release</span>
              <span className="text-zinc-700 font-medium inline-flex items-center gap-1">Draft locked</span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CONTACT CTA */}
      <section className="container-custom">
        <div className="max-w-2xl mx-auto text-center space-y-8 py-8">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-display">
            Let’s Build Something Meaningful Together.
          </h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto font-sans">
            Whether you’re a recruiter, engineer, founder, or fellow learner, I’d be happy to connect and explore collaborative opportunities in software engineering or machine learning.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/contact" className="btn-primary text-sm font-medium">
              Send Message
            </Link>
            <Link href="/resume" className="btn-secondary text-sm font-medium">
              View Resume
            </Link>
            <button 
              onClick={handleOpenTerminal}
              className="btn-secondary text-sm font-medium font-mono text-zinc-400"
            >
              Open Terminal
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
