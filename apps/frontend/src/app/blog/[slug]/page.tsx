"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar, Clock, ChevronRight } from "lucide-react";
import { BLOGS } from "../../../data/portfolioData";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const blog = BLOGS.find(b => b.slug === slug);

  if (!blog) {
    return (
      <div className="container-custom py-24 text-center space-y-6">
        <h1 className="text-2xl font-bold text-white font-display">Article Not Found</h1>
        <p className="text-zinc-500 text-sm">The requested technical article could not be resolved.</p>
        <Link href="/blog" className="btn-primary py-2 px-4 rounded-xl text-xs gap-1.5 inline-flex">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  // Simple Markdown renderer (CDD compliant, no dependencies)
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith("## ")) {
        const text = trimmed.replace("## ", "");
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        return (
          <h2 key={idx} id={id} className="text-xl md:text-2xl font-bold text-white font-display mt-8 mb-4 border-b border-zinc-900 pb-2">
            {text}
          </h2>
        );
      }
      
      if (trimmed.startsWith("### ")) {
        const text = trimmed.replace("### ", "");
        return (
          <h3 key={idx} className="text-base md:text-lg font-bold text-white font-display mt-6 mb-3">
            {text}
          </h3>
        );
      }

      if (trimmed.startsWith("```")) {
        // Simple code block detector
        if (trimmed === "```" || trimmed.startsWith("```python") || trimmed.startsWith("```go")) {
          return null; // Skip code fence markers themselves
        }
      }

      // Check if inside a block of code (starts with indent or in our data it's markdown format)
      if (line.startsWith("import ") || line.startsWith("client =") || line.startsWith("def ") || line.startsWith("    container =") || line.startsWith("type NodeState") || line.startsWith("const (") || line.startsWith("type RaftNode")) {
        return (
          <pre key={idx} className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl font-mono text-xs text-zinc-300 overflow-x-auto my-4 leading-relaxed">
            <code>{line}</code>
          </pre>
        );
      }

      if (trimmed.startsWith("- ") || trimmed.startsWith("1. ")) {
        return (
          <li key={idx} className="ml-6 list-disc text-zinc-400 text-sm leading-relaxed mb-2 font-sans">
            {trimmed.substring(2)}
          </li>
        );
      }

      if (trimmed === "") {
        return <div key={idx} className="h-4" />;
      }

      return (
        <p key={idx} className="text-zinc-400 text-sm leading-relaxed mb-4 font-sans">
          {line}
        </p>
      );
    });
  };

  // Compile Table of Contents from headers
  const getTableOfContents = (content: string) => {
    const lines = content.split("\n");
    const headers = [];
    for (const line of lines) {
      if (line.trim().startsWith("## ")) {
        const text = line.trim().replace("## ", "");
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        headers.push({ text, id });
      }
    }
    return headers;
  };

  const toc = getTableOfContents(blog.content);

  return (
    <div className="container-custom py-12 space-y-12 text-left">
      
      {/* Back link */}
      <div>
        <Link 
          href="/blog" 
          className="text-zinc-500 hover:text-white transition-colors text-xs font-mono inline-flex items-center gap-1.5 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>

      {/* Header Info */}
      <div className="border-b border-zinc-900 pb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500">
          <span className="bg-zinc-900 border border-zinc-800 text-[#e82127] px-2.5 py-1 rounded">
            {blog.category}
          </span>
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {blog.published_date}</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {blog.reading_time}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white font-display tracking-tight leading-tight">
          {blog.title}
        </h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-2xl font-sans leading-relaxed">
          {blog.summary}
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Table of Contents sidebar */}
        <div className="hidden lg:block lg:col-span-3 space-y-4 sticky top-28 self-start">
          <h3 className="text-[10px] font-bold text-zinc-500 font-sans tracking-wider uppercase mb-3">Table of Contents</h3>
          <nav className="space-y-2 text-xs font-mono">
            {toc.map(item => (
              <a 
                key={item.id} 
                href={`#${item.id}`}
                className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors group"
              >
                <ChevronRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-[#e82127] shrink-0" />
                <span className="truncate">{item.text}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Article Body */}
        <article className="lg:col-span-9 max-w-2xl space-y-6">
          {renderContent(blog.content)}
          
          {/* References */}
          {blog.references && blog.references.length > 0 && (
            <div className="mt-12 pt-8 border-t border-zinc-900 space-y-3">
              <h3 className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider">References & Citations</h3>
              <ul className="space-y-1.5 text-xs text-zinc-500 font-mono">
                {blog.references.map((ref, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-zinc-700">[{idx + 1}]</span>
                    <span className="truncate hover:text-zinc-300 transition-colors">{ref}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>

      </div>

    </div>
  );
}
