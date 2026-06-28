"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, ExternalLink, FileCode, CheckCircle, 
  ShieldAlert, Play, RefreshCw, ArrowRight
} from "lucide-react";
import { PROJECTS } from "../../../data/portfolioData";

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const project = PROJECTS.find(p => p.slug === slug);
  
  const [selectedFile, setSelectedFile] = useState<string>(() => {
    if (project && project.mock_files) {
      return Object.keys(project.mock_files)[0];
    }
    return "";
  });
  const [activeTab, setActiveTab] = useState<"case-study" | "sandbox" | "code">("case-study");
  
  // Astraeus Simulation States
  const [simLog, setSimLog] = useState<string[]>([]);
  const [simStatus, setSimStatus] = useState<"idle" | "running" | "done">("idle");
  
  // Raft Simulation States
  const [raftNodes, setRaftNodes] = useState([
    { id: 1, state: "Leader", term: 2, status: "Active" },
    { id: 2, state: "Follower", term: 2, status: "Active" },
    { id: 3, state: "Follower", term: 2, status: "Active" },
    { id: 4, state: "Follower", term: 2, status: "Active" },
    { id: 5, state: "Follower", term: 2, status: "Active" }
  ]);
  const [raftTerm, setRaftTerm] = useState(2);

  // File synchronization handled by dynamic state initializers

  if (!project) {
    return (
      <div className="container-custom py-24 text-center space-y-6">
        <h1 className="text-2xl font-bold text-white font-display">Case Study Not Found</h1>
        <p className="text-zinc-500 text-sm">The requested engineering case study could not be resolved.</p>
        <Link href="/projects" className="btn-primary py-2 px-4 rounded-xl text-xs gap-1.5 inline-flex">
          <ArrowLeft className="w-4 h-4" /> Back to Engineering Lab
        </Link>
      </div>
    );
  }

  // Next / Previous projects links
  const currentIndex = PROJECTS.findIndex(p => p.id === project.id);
  const prevProject = currentIndex > 0 ? PROJECTS[currentIndex - 1] : null;
  const nextProject = currentIndex < PROJECTS.length - 1 ? PROJECTS[currentIndex + 1] : null;

  // Astraeus Agent Sandbox Log Runner
  const runAgentSandbox = () => {
    setSimStatus("running");
    setSimLog(["[SYSTEM] Initiating supervisor container...", "[SYSTEM] Injecting goal: Build and audit FastAPI API endpoints..."]);
    
    const logs = [
      "[PLANNER] Decomposing task into 3 sub-tasks: 1. Generate schemas, 2. Code routes, 3. Validate unit testing.",
      "[PLANNER] Spawning specialist Worker: CoderAgent inside Docker sandbox context.",
      "[CODER] Writing schemas.py... Done. Compiling app/api/endpoints.py...",
      "[CODER] Executing local formatting and lints (flake8, black)... Passed.",
      "[PLANNER] Spawning specialist Worker: ReviewerAgent inside isolated container.",
      "[REVIEWER] Auditing codebase against security metrics...",
      "[REVIEWER] WARNING: Found un-escaped SQL execute template block in user parameter query.",
      "[PLANNER] Rejecting commit. Directing CoderAgent to sanitize input schema.",
      "[CODER] Correcting endpoints.py. Replacing raw execute parameters with Pydantic typing.",
      "[PLANNER] Triggering validation. Spawning specialist Worker: TesterAgent.",
      "[TESTER] Running pytest suites: 4 test files resolved, 12 test assertions PASSED.",
      "[SYSTEM] Deployment checks: success. Sandbox lifecycle ended. Code committed."
    ];

    let currentLogIdx = 0;
    const interval = setInterval(() => {
      if (currentLogIdx < logs.length) {
        setSimLog(prev => [...prev, logs[currentLogIdx]]);
        currentLogIdx++;
      } else {
        clearInterval(interval);
        setSimStatus("done");
      }
    }, 900);
  };

  // Raft node status toggle
  const toggleNodeStatus = (nodeId: number) => {
    setRaftNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        const nextStatus = node.status === "Active" ? "Offline" : "Active";
        const nextState = nextStatus === "Offline" ? "Follower" : node.state;
        return { ...node, status: nextStatus, state: nextState };
      }
      return node;
    }));
  };

  // Trigger Raft election simulation
  const triggerElection = () => {
    // Increment term
    const newTerm = raftTerm + 1;
    setRaftTerm(newTerm);
    
    // Select first active node as candidate and Leader
    const activeNodes = raftNodes.filter(n => n.status === "Active");
    if (activeNodes.length === 0) return;
    
    const newLeaderId = activeNodes[0].id;
    
    setRaftNodes(prev => prev.map(node => {
      if (node.id === newLeaderId && node.status === "Active") {
        return { ...node, state: "Leader", term: newTerm };
      } else if (node.status === "Active") {
        return { ...node, state: "Follower", term: newTerm };
      }
      return node;
    }));
  };

  return (
    <div className="container-custom py-12 space-y-12 text-left">
      
      {/* Back link */}
      <div>
        <Link 
          href="/projects" 
          className="text-zinc-500 hover:text-white transition-colors text-xs font-mono inline-flex items-center gap-1.5 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Engineering Lab
        </Link>
      </div>

      {/* Hero Banner Grid */}
      <div className="border-b border-zinc-900 pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3">
          <span className="text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-[#e82127] px-3 py-1 rounded">
            {project.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white font-display tracking-tight leading-tight">
            {project.title}
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl font-sans leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full sm:w-auto">
          {project.code_repo_url && (
            <a 
              href={project.code_repo_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-secondary gap-2 text-xs font-medium py-2.5 px-4"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg> Repository Source
            </a>
          )}
          {project.demo_url && (
            <a 
              href={project.demo_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary gap-2 text-xs font-medium py-2.5 px-4"
            >
              <ExternalLink className="w-4 h-4" /> Launch Live Demo
            </a>
          )}
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-zinc-900 gap-1 pb-px">
        {[
          { id: "case-study", label: "Case Study Documentation" },
          { id: "sandbox", label: "Interactive Demo Sandbox" },
          { id: "code", label: "Mock Repository Explorer" }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as "case-study" | "sandbox" | "code")}
            className={`px-4 py-2 border-b-2 text-xs font-medium transition-colors cursor-pointer ${
              activeTab === t.id 
                ? "border-[#e82127] text-white" 
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content Rendering Switch */}
      {activeTab === "case-study" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Case Study */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* 1. Overview */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white font-display border-b border-zinc-900 pb-2">Overview</h2>
              <p className="text-zinc-400 text-sm leading-relaxed font-sans">{project.overview}</p>
            </div>

            {/* 2. Problem Statement */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white font-display border-b border-zinc-900 pb-2">Problem Statement</h2>
              <p className="text-zinc-400 text-sm leading-relaxed font-sans">{project.problem}</p>
            </div>

            {/* 3. Objectives */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white font-display border-b border-zinc-900 pb-2">Objectives</h2>
              <ul className="space-y-2">
                {project.objectives.map((obj, idx) => (
                  <li key={idx} className="flex gap-2 text-zinc-400 text-sm font-sans">
                    <CheckCircle className="w-5 h-5 text-[#e82127] shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Solution */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white font-display border-b border-zinc-900 pb-2">Proposed Solution</h2>
              <p className="text-zinc-400 text-sm leading-relaxed font-sans">{project.solution}</p>
            </div>

            {/* 5. System Architecture */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white font-display border-b border-zinc-900 pb-2">System Architecture</h2>
              <p className="text-zinc-400 text-sm leading-relaxed font-sans mb-6">{project.architecture_description}</p>
              
              {/* Architecture mock block diagram (CDD Compliant minimal visual) */}
              <div className="border border-zinc-800 bg-zinc-950/40 p-6 rounded-2xl font-mono text-[11px] text-zinc-400 space-y-4 max-w-xl mx-auto">
                <div className="flex justify-between items-center text-center">
                  <div className="border border-zinc-800 bg-[#0d0d10] px-4 py-2.5 rounded-lg w-28">User Client</div>
                  <ArrowRight className="w-4 h-4 text-zinc-600" />
                  <div className="border border-[#e82127]/30 bg-[#0d0d10] px-4 py-2.5 rounded-lg w-28 text-white font-semibold">FastAPI Gateway</div>
                  <ArrowRight className="w-4 h-4 text-zinc-600" />
                  <div className="border border-zinc-800 bg-[#0d0d10] px-4 py-2.5 rounded-lg w-28">AI Orchestrator</div>
                </div>
                <div className="h-6 w-px bg-zinc-800 mx-auto" />
                <div className="flex justify-around items-center text-center">
                  <div className="border border-zinc-800 bg-zinc-950 px-3 py-2 rounded-lg w-32">RocksDB WAL Store</div>
                  <div className="border border-zinc-850 bg-zinc-950 px-3 py-2 rounded-lg w-32">Docker sandboxes</div>
                </div>
              </div>
            </div>

            {/* 7. Development Journey */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white font-display border-b border-zinc-900 pb-2">Development Journey</h2>
              <div className="relative pl-6 border-l border-zinc-800 space-y-6">
                {project.journey.map((item, idx) => (
                  <div key={idx} className="relative text-xs">
                    <span className="absolute -left-[30px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-950" />
                    <span className="text-[10px] font-mono text-zinc-500 font-bold">{item.date}</span>
                    <h4 className="text-sm font-semibold text-white mt-0.5">{item.title}</h4>
                    <p className="text-zinc-400 leading-relaxed font-sans mt-0.5">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. Challenges & Mitigations */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white font-display border-b border-zinc-900 pb-2">Technical Challenges</h2>
              <div className="space-y-4">
                {project.challenges.map((c, idx) => (
                  <div key={idx} className="bg-[#141416]/50 border border-zinc-900 p-5 rounded-2xl space-y-2">
                    <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-[#e82127] shrink-0" />
                      <span>{c.challenge}</span>
                    </h4>
                    <p className="text-zinc-400 text-xs leading-relaxed font-sans pl-6">
                      <strong>Mitigation:</strong> {c.solution}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 12. Research Notes */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white font-display border-b border-zinc-900 pb-2">Research Notes & Alternate Designs</h2>
              <p className="text-zinc-400 text-sm leading-relaxed font-sans">
                During optimization, we explored alternative vector indices (FAISS) but rejected them in favor of in-memory client vectors to support standalone preview. Consensus performance in Go was benchmarked across single-thread serialization models versus concurrent channels, verifying Channels yielded lower latency logs throughput.
              </p>
            </div>

          </div>

          {/* Right Sidebar Details */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Project Specs */}
            <div className="bg-[#141416] border border-zinc-900 rounded-2xl p-6 space-y-4 text-xs font-mono">
              <h3 className="text-white font-bold font-sans text-[11px] uppercase tracking-wider mb-2">Metrics & Specs</h3>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-zinc-500">Maturity Level</span>
                <span className="text-white">{project.difficulty}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-zinc-500">Development Time</span>
                <span className="text-white">{project.build_time}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-zinc-500">Status Badge</span>
                <span className="text-white">{project.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Tech Modules</span>
                <span className="text-white">{project.tech_stack.length} components</span>
              </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="bg-[#141416] border border-zinc-900 rounded-2xl p-6 space-y-4">
              <h3 className="text-white font-bold font-sans text-[11px] uppercase tracking-wider mb-2">Key Performance Indicators</h3>
              <div className="space-y-4">
                {project.metrics.map((m, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{m.label}</span>
                    <div className="text-2xl font-bold text-[#e82127] font-display">{m.value}</div>
                    {m.description && <p className="text-[10px] text-zinc-500 font-sans leading-tight">{m.description}</p>}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 9. INTERACTIVE DEMO SANDBOX TAB */}
      {activeTab === "sandbox" && (
        <div className="bg-[#141416] border border-zinc-900 rounded-2xl p-6 md:p-8 space-y-6 max-w-3xl mx-auto text-left">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white font-display">Live Interaction Playground</h3>
            <p className="text-zinc-500 text-xs font-sans">
              Interact directly with the localized simulator model representing this product.
            </p>
          </div>

          {/* Project Specific Sandbox Renders */}
          {project.id === "astraeus-ai" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={runAgentSandbox}
                  disabled={simStatus === "running"}
                  className="btn-primary py-2 px-4 rounded-xl text-xs gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" /> Run Agent Supervisor Simulation
                </button>
                {simStatus === "running" && <span className="text-xs font-mono text-zinc-500 flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Orchestrating loop...</span>}
              </div>

              {/* Console log display */}
              <div className="border border-zinc-900 bg-zinc-950 p-5 rounded-xl font-mono text-xs text-zinc-400 space-y-2.5 min-h-[250px] max-h-[350px] overflow-y-auto leading-relaxed">
                {simLog.length === 0 ? (
                  <div className="text-zinc-600 text-center py-20">Click the button above to spawn the multi-agent isolated runtime simulation.</div>
                ) : (
                  simLog.map((log, idx) => (
                    <div key={idx} className={log.includes("[SYSTEM]") ? "text-zinc-500" : log.includes("[REVIEWER]") ? "text-amber-500" : log.includes("[TESTER]") ? "text-[#10b981]" : "text-white"}>
                      <span className="text-zinc-700 mr-1.5">&gt;</span>
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {project.id === "helios-raft" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-4">
                <div className="text-xs font-mono text-zinc-400">
                  Current Term: <span className="text-white font-bold">Term {raftTerm}</span>
                </div>
                <button
                  onClick={triggerElection}
                  className="btn-primary py-2 px-4 rounded-xl text-xs"
                >
                  Trigger Random Term Election
                </button>
              </div>

              {/* Cluster Nodes Representation */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {raftNodes.map(node => (
                  <div 
                    key={node.id}
                    className={`border p-4 rounded-xl text-center space-y-3 transition-colors ${
                      node.status === "Offline" 
                        ? "bg-zinc-950/20 border-zinc-950 text-zinc-600" 
                        : node.state === "Leader"
                          ? "bg-[#e82127]/5 border-[#e82127]/40 text-white"
                          : "bg-zinc-950 border-zinc-900 text-zinc-300"
                    }`}
                  >
                    <div className="font-mono text-xs font-bold">Node {node.id}</div>
                    
                    <div className="space-y-1">
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        node.status === "Offline"
                          ? "bg-zinc-900 text-zinc-600"
                          : node.state === "Leader"
                            ? "bg-[#e82127]/20 text-[#e82127]"
                            : "bg-zinc-800 text-zinc-400"
                      }`}>
                        {node.status === "Offline" ? "Offline" : node.state}
                      </span>
                      <div className="text-[10px] font-mono text-zinc-500">Term: {node.term}</div>
                    </div>

                    <button
                      onClick={() => toggleNodeStatus(node.id)}
                      className="w-full bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-800 py-1 rounded text-[9px] font-mono"
                    >
                      {node.status === "Active" ? "Kill node" : "Restore"}
                    </button>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-zinc-500 leading-relaxed font-sans">
                <strong>Simulate partition:</strong> Click <strong>Kill Node</strong> on Nodes 2, 3, and 4 to force majority partition loss (quorum fails). Try triggering an election: Node 1 cannot declare leadership without majority vote. Click <strong>Restore</strong> to heal clusters.
              </div>
            </div>
          )}

          {project.id === "project-aether" && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-2">Platform Diagnostics Monitor</h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                  <div className="text-[10px] font-mono text-zinc-500">LCP SPEED</div>
                  <div className="text-2xl font-bold text-[#10b981] mt-1 font-display">1.12s</div>
                  <span className="text-[9px] text-[#10b981] font-mono">Excellent</span>
                </div>
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                  <div className="text-[10px] font-mono text-zinc-500">CLS INDEX</div>
                  <div className="text-2xl font-bold text-[#10b981] mt-1 font-display">0.02</div>
                  <span className="text-[9px] text-[#10b981] font-mono">Stable</span>
                </div>
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                  <div className="text-[10px] font-mono text-zinc-500">INP RESPOND</div>
                  <div className="text-2xl font-bold text-[#10b981] mt-1 font-display">18ms</div>
                  <span className="text-[9px] text-[#10b981] font-mono">Fast</span>
                </div>
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                  <div className="text-[10px] font-mono text-zinc-500">INITIAL HYDRATE</div>
                  <div className="text-2xl font-bold text-zinc-400 mt-1 font-display">120ms</div>
                  <span className="text-[9px] text-zinc-500 font-mono">Lighthouse: 99</span>
                </div>
              </div>
              <p className="text-zinc-500 text-xs font-sans leading-relaxed">
                Project Aether achieves sub-second paint ratios through dynamic Next.js code splitting, optimized static HTML hydration, and asset lazy loadings.
              </p>
            </div>
          )}

        </div>
      )}

      {/* 11. MOCK CODE & REPOSITORY EXPLORER TAB */}
      {activeTab === "code" && (
        <div className="bg-[#0c0c0e] border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl h-[450px] flex max-w-4xl mx-auto">
          
          {/* File Explorer Directory Tree */}
          <div className="w-56 border-r border-zinc-900 bg-[#0d0d10] p-4 flex flex-col justify-between select-none">
            <div>
              <h4 className="text-[10px] font-bold text-zinc-500 font-sans tracking-wider uppercase mb-3">Workspace Files</h4>
              <div className="space-y-1">
                {project.mock_files && Object.keys(project.mock_files).map(filename => (
                  <button
                    key={filename}
                    onClick={() => setSelectedFile(filename)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 truncate ${
                      selectedFile === filename 
                        ? "bg-zinc-900 text-[#e82127]" 
                        : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-300"
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="truncate">{filename.split("/").pop()}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="text-[10px] font-mono text-zinc-600 border-t border-zinc-900 pt-3">
              Repository: active
            </div>
          </div>

          {/* Styled Code View Console */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#08080a]">
            {/* Header info */}
            <div className="px-4 py-2.5 bg-[#0a0a0c] border-b border-zinc-900 flex justify-between items-center text-xs">
              <span className="font-mono text-zinc-400">{selectedFile || "Select a file..."}</span>
              <span className="font-mono text-[10px] text-zinc-600 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900">
                {selectedFile.split(".").pop()?.toUpperCase()} Code
              </span>
            </div>

            {/* Code Content */}
            <div className="flex-1 p-5 overflow-auto font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre bg-[#08080a]">
              {project.mock_files && selectedFile && project.mock_files[selectedFile] ? (
                <code>{project.mock_files[selectedFile]}</code>
              ) : (
                <span className="text-zinc-600">Select a file from the explorer directory tree to display source code.</span>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Navigation Footer */}
      <div className="pt-8 border-t border-zinc-900 flex items-center justify-between text-xs font-mono">
        {prevProject ? (
          <Link 
            href={`/projects/${prevProject.slug}`}
            className="text-zinc-500 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {prevProject.title.split(":")[0]}
          </Link>
        ) : (
          <span className="text-zinc-700">First Project</span>
        )}

        {nextProject ? (
          <Link 
            href={`/projects/${nextProject.slug}`}
            className="text-zinc-555 hover:text-white flex items-center gap-1.5 transition-colors ml-auto text-right"
          >
            {nextProject.title.split(":")[0]} <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <span className="text-zinc-700 ml-auto">Last Project</span>
        )}
      </div>

    </div>
  );
}
