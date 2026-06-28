"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, SlidersHorizontal } from "lucide-react";
import { PROJECTS } from "../../data/portfolioData";

export default function ProjectsPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("Recent");

  const categories = ["All", "Machine Learning", "Systems Engineering", "AI Web Engineering"];
  const difficulties = ["All", "Intermediate", "Advanced"];
  const statuses = ["All", "Completed", "In Development", "Research"];

  // Filter and sort logic
  const filteredProjects = PROJECTS.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(query.toLowerCase()) || 
                          p.description.toLowerCase().includes(query.toLowerCase()) ||
                          p.tech_stack.some(t => t.toLowerCase().includes(query.toLowerCase()));
                          
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === "All" || p.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === "Alphabetical") {
      return a.title.localeCompare(b.title);
    }
    // Default sorting "Recent" is just the array order since it's already pre-sorted by date
    return 0;
  });

  return (
    <div className="container-custom py-12 space-y-12">
      
      {/* Header Info */}
      <div className="space-y-4 text-left max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display">
          Engineering Lab
        </h1>
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-sans">
          Welcome to {"Shisank's"} R&D repository. Explore case studies, system design architectures, and source code files from functional engineering projects.
        </p>
      </div>

      {/* Filter and Control Panel */}
      <div className="bg-[#141416] border border-zinc-900 rounded-2xl p-6 space-y-4">
        
        {/* Row 1: Search & Sort */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md flex items-center">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 pointer-events-none" />
            <input 
              type="text"
              placeholder="Search projects by title, description, or tech stack..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-white pl-10 pr-4 py-2.5 rounded-xl text-xs focus:ring-1 focus:ring-[#e82127] focus:outline-none placeholder-zinc-600 font-sans"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <span className="text-[11px] font-mono text-zinc-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-300 px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-[#e82127] focus:outline-none font-sans"
            >
              <option value="Recent">Recent Builds</option>
              <option value="Alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Row 2: Filtering Controls */}
        <div className="pt-4 border-t border-zinc-900 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-zinc-400 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
            <span className="font-mono text-[11px]">Filters:</span>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat 
                    ? "bg-[#e82127] text-white" 
                    : "bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-500">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="bg-zinc-950 border border-zinc-850 text-zinc-400 px-2 py-1 rounded-lg text-[10px] focus:outline-none"
            >
              {difficulties.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="bg-zinc-950 border border-zinc-850 text-zinc-400 px-2 py-1 rounded-lg text-[10px] focus:outline-none"
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="py-24 text-center text-zinc-500 font-sans text-sm border border-dashed border-zinc-800 rounded-2xl">
          No projects match your filter configuration. Try broadening your keywords.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
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
                
                <p className="text-zinc-400 text-xs leading-relaxed font-sans line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tech_stack.map((tech) => (
                    <span key={tech} className="badge-tech text-[10px] py-0.5 px-2">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-900 flex items-center justify-between text-xs font-mono">
                <div className="flex flex-col text-left gap-0.5 text-zinc-500">
                  <span>Level: {project.difficulty}</span>
                  <span>Est: {project.build_time}</span>
                </div>
                <Link 
                  href={`/projects/${project.slug}`}
                  className="text-white hover:text-[#e82127] font-medium inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-all font-sans"
                >
                  Explore Case Study
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
