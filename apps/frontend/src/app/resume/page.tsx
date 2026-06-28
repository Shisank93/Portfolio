"use client";

import React from "react";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RESUME_DATA } from "../../data/portfolioData";

export default function ResumePage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container-custom py-12 space-y-8 text-left max-w-3xl">
      
      {/* Control Actions bar (Hidden in print) */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-6 print:hidden">
        <Link 
          href="/" 
          className="text-zinc-500 hover:text-white transition-colors text-xs font-mono inline-flex items-center gap-1.5 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <button
          onClick={handlePrint}
          className="btn-primary py-2 px-4 rounded-xl text-xs gap-1.5 inline-flex"
        >
          <Printer className="w-4 h-4" /> Print / Save as PDF
        </button>
      </div>

      {/* Main Print Wrapper Container */}
      <div className="bg-[#141416] border border-zinc-900 rounded-3xl p-8 md:p-12 space-y-10 shadow-xl print:bg-white print:text-black print:border-none print:shadow-none print:p-0 print:m-0">
        
        {/* Print Stylesheet Hook */}
        <style dangerouslySetInnerHTML={ { __html: `
          @media print {
            body {
              background: white !important;
              color: black !important;
            }
            .print\\:hidden {
              display: none !important;
            }
            main {
              padding-top: 0 !important;
            }
            header, footer {
              display: none !important;
            }
            .badge-tech {
              border: 1px solid #d1d1d6 !important;
              color: black !important;
              background: transparent !important;
            }
            a {
              color: black !important;
              text-decoration: underline;
            }
          }
        ` } } />

        {/* Header Summary */}
        <div className="border-b border-zinc-900 print:border-zinc-300 pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white print:text-black font-display tracking-tight leading-none">
              Shisank
            </h1>
            <p className="text-[#e82127] font-semibold text-xs font-mono uppercase tracking-wider">
              {RESUME_DATA.about.title}
            </p>
          </div>

          <div className="text-xs font-mono text-zinc-400 print:text-zinc-700 space-y-1 text-left md:text-right">
            <div>Email: shisank@example.com</div>
            <div>GitHub: github.com/shisank</div>
            <div>LinkedIn: linkedin.com/in/shisank</div>
            <div>Location: Ghaziabad, India</div>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white print:text-black font-mono uppercase tracking-wider border-b border-zinc-900 print:border-zinc-200 pb-1.5">
            Professional Summary
          </h2>
          <p className="text-zinc-400 print:text-zinc-800 text-xs leading-relaxed font-sans">
            {RESUME_DATA.summary}
          </p>
        </div>

        {/* Education Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white print:text-black font-mono uppercase tracking-wider border-b border-zinc-900 print:border-zinc-200 pb-1.5">
            Education
          </h2>
          <div className="flex justify-between items-start text-xs">
            <div className="space-y-1">
              <div className="text-white print:text-black font-bold font-sans text-sm">{RESUME_DATA.education.institution}</div>
              <div className="text-zinc-400 print:text-zinc-700 font-sans">{RESUME_DATA.education.degree} ({RESUME_DATA.education.specialization})</div>
              <div className="text-[10px] font-sans text-zinc-500 pt-1">
                <strong>Core Coursework:</strong> {RESUME_DATA.education.coursework.join(", ")}
              </div>
            </div>
            <div className="text-right font-mono text-zinc-500 shrink-0">
              <div>{RESUME_DATA.education.graduation}</div>
              <div className="text-[10px]">{RESUME_DATA.education.location}</div>
            </div>
          </div>
        </div>

        {/* Technical Skills */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white print:text-black font-mono uppercase tracking-wider border-b border-zinc-900 print:border-zinc-200 pb-1.5">
            Technical Skills
          </h2>
          <div className="space-y-3">
            {Object.entries(RESUME_DATA.skills).map(([category, skills]) => (
              <div key={category} className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-mono">
                <span className="text-zinc-500 font-bold sm:col-span-1">{category}</span>
                <span className="text-zinc-300 print:text-zinc-800 sm:col-span-3">
                  {skills.join(", ")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-6">
          <h2 className="text-sm font-bold text-white print:text-black font-mono uppercase tracking-wider border-b border-zinc-900 print:border-zinc-200 pb-1.5">
            Key Engineering Projects
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-sans">
                <strong className="text-white print:text-black text-sm">Astraeus AI: Autonomous Multi-Agent Systems</strong>
                <span className="font-mono text-zinc-500">Python, LangChain, FastAPI</span>
              </div>
              <p className="text-zinc-400 print:text-zinc-700 font-sans">
                Designed a collaborative multi-agent software automation loop. Deployed supervisor orchestrator models delegating testing and compilation commands to specialist worker subprocesses running inside isolated Docker runtimes to secure hosts execution profiles.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-sans">
                <strong className="text-white print:text-black text-sm">Helios Raft: High-Performance Consensus Core</strong>
                <span className="font-mono text-zinc-500">Go, gRPC, Protobuf, RocksDB</span>
              </div>
              <p className="text-zinc-400 print:text-zinc-700 font-sans">
                Engineered a distributed partition-tolerant log replication engine in Go from scratch. Implemented election state machines, randomized election timers, append-entry RPC loops, and WAL persistence layers using RocksDB.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-sans">
                <strong className="text-white print:text-black text-sm">Project Aether: AI Engineering Platform</strong>
                <span className="font-mono text-zinc-500">Next.js, FastAPI, TypeScript, Gemini API</span>
              </div>
              <p className="text-zinc-400 print:text-zinc-700 font-sans">
                Created a unified monorepo for portfolio intelligence. Designed a client-side streaming RAG fallback index matcher, static dot grid visualizers, and command palette navigation consoles for double-resilience.
              </p>
            </div>
          </div>
        </div>

        {/* Future Ready Slots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-[11px] font-mono text-zinc-500 print:text-zinc-600">
          <div className="space-y-2">
            <h3 className="font-bold uppercase tracking-wider text-zinc-400 print:text-zinc-800 text-[10px] border-b border-zinc-900 print:border-zinc-200 pb-1">Certifications</h3>
            <p>AWS Certified Cloud Practitioner (Scheduled 2026)</p>
            <p>TensorFlow Developer Certificate (Scheduled 2026)</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold uppercase tracking-wider text-zinc-400 print:text-zinc-800 text-[10px] border-b border-zinc-900 print:border-zinc-200 pb-1">Leadership & Activities</h3>
            <p>Open Source Contributor (Go/Python systems packages)</p>
            <p>Active participant in technical society code sprints</p>
          </div>
        </div>

      </div>

    </div>
  );
}
