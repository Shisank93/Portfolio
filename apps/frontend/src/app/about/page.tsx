"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Info, HelpCircle, CheckCircle, GraduationCap } from "lucide-react";
import { RESUME_DATA } from "../../data/portfolioData";

export default function AboutPage() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(prev => (prev === idx ? null : idx));
  };

  const values = [
    { name: "Continuous Learning", desc: "AI and software systems evolve rapidly. Enforcing daily reading of research articles and system optimization metrics." },
    { name: "Practical Engineering", desc: "Prioritize shipping usable, secure software over theoretical abstractions that never leave the sandbox environment." },
    { name: "Attention to Detail", desc: "From pixel boundaries to Raft protocol quorum validations, precise execution reflects professional craftsmanship." }
  ];

  return (
    <div className="container-custom py-12 space-y-16 text-left">
      
      {/* 1. Hero Introduction */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-12 border-b border-zinc-900 pb-12">
        <div className="flex-1 space-y-6 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#e82127] font-mono uppercase tracking-wider">
            <Info className="w-4 h-4" /> Identity Biography
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display leading-tight">
            Who is Shisank?
          </h1>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-sans">
            I am a **Software Engineer and AI/ML Developer** studying Computer Science Engineering at **Ajay Kumar Garg Engineering College** (graduation expected 2028).
          </p>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-sans">
            My engineering focus centers on systems architecture and machine learning pipelines. I aim to construct performant backend consensus layers (Go) and deploy grounded LLM multi-agent configurations (Python).
          </p>
          <div className="flex gap-4 pt-2">
            <Link href="/contact" className="btn-primary text-xs font-medium">{"Let's Connect"}</Link>
            <Link href="/resume" className="btn-secondary text-xs font-medium">Download Resume</Link>
          </div>
        </div>

        {/* Portait Graphic Placeholder (CDD Compliant, minimal) */}
        <div className="w-full max-w-sm shrink-0">
          <div className="aspect-square bg-zinc-950 border border-zinc-900 rounded-3xl p-8 flex flex-col justify-center items-center relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 geometric-dots opacity-40" />
            <GraduationCap className="w-20 h-20 text-[#e82127] mb-4 relative" />
            <div className="text-center relative space-y-1">
              <h3 className="text-white font-bold text-sm font-display">Shisank</h3>
              <p className="text-[11px] font-mono text-zinc-500">Ajay Kumar Garg Engineering College</p>
              <p className="text-[10px] text-zinc-600 font-mono">B.Tech CSE AI/ML • 2024-2028</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Career Vision & current focus */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white font-display border-b border-zinc-900 pb-2">Career Vision</h2>
          <p className="text-zinc-400 text-sm leading-relaxed font-sans">
            {RESUME_DATA.about.vision}
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white font-display border-b border-zinc-900 pb-2">Current Focus</h2>
          <div className="flex flex-wrap gap-2 pt-2">
            {["Machine Learning", "Deep Learning", "Systems Go Concurrency", "Docker Sandbox MLOps", "LangChain Agents", "FastAPI APIs"].map((item) => (
              <span key={item} className="text-xs bg-[#141416] border border-zinc-900 text-zinc-400 px-3.5 py-2 rounded-xl font-mono">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Education credentials */}
      <section className="bg-[#141416] border border-zinc-900 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-[#e82127]" />
          <h2 className="text-lg font-bold text-white font-display">Academic Credentials</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-mono">
          <div className="space-y-3">
            <div>
              <span className="text-zinc-500">Institution</span>
              <div className="text-white font-bold font-sans text-sm mt-0.5">{RESUME_DATA.education.institution}</div>
            </div>
            <div>
              <span className="text-zinc-500">Degree & Specialization</span>
              <div className="text-white font-sans text-xs mt-0.5">{RESUME_DATA.education.degree} ({RESUME_DATA.education.specialization})</div>
            </div>
            <div>
              <span className="text-zinc-500">Graduation Timeline</span>
              <div className="text-white mt-0.5">{RESUME_DATA.education.graduation}</div>
            </div>
          </div>
          <div>
            <span className="text-zinc-500">Core Coursework</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {RESUME_DATA.education.coursework.map(course => (
                <span key={course} className="badge-tech text-[10px] px-2 py-0.5">
                  {course}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Engineering Philosophy */}
      <section className="space-y-8">
        <h2 className="text-xl font-bold text-white font-display border-b border-zinc-900 pb-2">Engineering Philosophy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RESUME_DATA.about.philosophy.map((phil, idx) => (
            <div key={idx} className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl flex gap-3 text-xs leading-relaxed">
              <CheckCircle className="w-5 h-5 text-[#e82127] shrink-0 mt-0.5" />
              <p className="text-zinc-400 font-sans">{phil}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="space-y-8">
        <h2 className="text-xl font-bold text-white font-display border-b border-zinc-900 pb-2">Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v, idx) => (
            <div key={idx} className="bg-[#141416] border border-zinc-900 p-6 rounded-2xl space-y-2 text-xs">
              <h3 className="text-sm font-bold text-white font-display">{v.name}</h3>
              <p className="text-zinc-500 leading-relaxed font-sans">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 11. Frequently Asked Questions */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-[#e82127]" />
          <h2 className="text-xl font-bold text-white font-display">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4 max-w-3xl">
          {RESUME_DATA.about.faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div 
                key={idx}
                className="bg-[#141416] border border-zinc-900 rounded-xl overflow-hidden text-xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-white font-display hover:text-[#e82127] transition-colors focus:outline-none cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <span className="text-lg font-mono text-zinc-500">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="p-4 border-t border-zinc-900 text-zinc-400 leading-relaxed font-sans bg-[#0c0c0e]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
