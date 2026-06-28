"use client";

import React from "react";

export function GeometricBackground() {
  return (
    <div className="absolute inset-0 -z-50 min-h-screen w-full overflow-hidden bg-[#0a0a0c] transition-colors duration-300 dark:bg-[#0a0a0c] light:bg-[#f5f5f7]">
      {/* 
        Ultra-minimal grid. Aligned with CDD:
        No animated particle backgrounds. No glowing effects.
        Provides a static geometric dot grid layout.
      */}
      <div className="absolute inset-0 geometric-dots" />
      
      {/* Very soft, clean static ambient gradient glow at the top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-[#e82127]/2 to-transparent blur-[120px] pointer-events-none opacity-40" />
    </div>
  );
}
