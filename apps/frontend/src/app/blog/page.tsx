"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";
import { BLOGS } from "../../data/portfolioData";

export default function BlogPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "MLOps", "System Design"];

  // Filter logic
  const filteredBlogs = BLOGS.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(query.toLowerCase()) ||
                          b.summary.toLowerCase().includes(query.toLowerCase()) ||
                          b.tags.some(t => t.toLowerCase().includes(query.toLowerCase()));
                          
    const matchesCategory = selectedCategory === "All" || b.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container-custom py-12 space-y-12 text-left">
      
      {/* Header Info */}
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display">
          Technical Blog
        </h1>
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-sans">
          Engineering diaries, code designs, research notes, and tutorial breakdowns written directly from implementation experience.
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-[#141416] border border-zinc-900 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:max-w-md flex items-center">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 pointer-events-none" />
          <input 
            type="text"
            placeholder="Search articles by title, summary, or tags..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 text-white pl-10 pr-4 py-2.5 rounded-xl text-xs focus:ring-1 focus:ring-[#e82127] focus:outline-none placeholder-zinc-650 font-sans"
          />
        </div>

        {/* Categories Chips */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
                selectedCategory === cat 
                  ? "bg-[#e82127] text-white" 
                  : "bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Articles Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="py-24 text-center text-zinc-500 font-sans text-sm border border-dashed border-zinc-800 rounded-2xl">
          No articles match your current search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBlogs.map((blog) => (
            <div 
              key={blog.id}
              className="bg-[#141416] border border-zinc-900 hover:border-zinc-850 p-6 rounded-2xl flex flex-col justify-between group transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span className="bg-zinc-950 border border-zinc-850 px-2.5 py-0.5 rounded">{blog.category}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {blog.reading_time}</span>
                </div>
                
                <h3 className="text-xl font-bold text-white group-hover:text-[#e82127] transition-colors font-display">
                  {blog.title}
                </h3>
                
                <p className="text-zinc-400 text-xs leading-relaxed font-sans line-clamp-3">
                  {blog.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {blog.tags.map(t => (
                    <span key={t} className="badge-tech text-[9px] py-0.5 px-2">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-900 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-mono flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {blog.published_date}</span>
                <Link 
                  href={`/blog/${blog.slug}`}
                  className="text-white hover:text-[#e82127] font-medium inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-all font-sans"
                >
                  Read Note
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
