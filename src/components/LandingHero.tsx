'use client';

import React from 'react';
import { UploadCloud, Cpu, Award, FileText, CheckCircle2 } from 'lucide-react';

export default function LandingHero() {
  return (
    <section className="text-center pt-8 pb-4 max-w-4xl mx-auto px-4">
      {/* Mini pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6">
        <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
        <span>Focused Student Learning Workflow</span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-5">
        Turn your lectures into{' '}
        <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
          practice.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
        Upload your study material and generate a personalized 5-question practice quiz.
      </p>

      {/* 3-Step Process Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto mb-10">
        {/* Step 1 */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-indigo-500/40 transition-colors backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-3 right-3 text-xs font-mono text-slate-500 group-hover:text-indigo-400 font-bold">
            01
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3.5">
            <UploadCloud className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-1.5">
            <span>1. Upload</span>
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Drop your lecture slides, notes, or reading material in standard PDF format.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-violet-500/40 transition-colors backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-3 right-3 text-xs font-mono text-slate-500 group-hover:text-violet-400 font-bold">
            02
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-3.5">
            <Cpu className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-1.5">
            <span>2. Generate</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Gemini synthesizes 5 balanced questions (2 easy, 2 medium, 1 challenging) based strictly on your document.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-emerald-500/40 transition-colors backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-3 right-3 text-xs font-mono text-slate-500 group-hover:text-emerald-400 font-bold">
            03
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3.5">
            <Award className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-1.5">
            <span>3. Practice</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Test yourself without spoilers, receive your instant score, and target your weak revision topics.
          </p>
        </div>
      </div>
    </section>
  );
}
