'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, FileText, Sparkles, CheckCircle, BrainCircuit } from 'lucide-react';

interface LoadingStateProps {
  documentName?: string;
}

const STUDY_TIPS = [
  'Active retrieval practice produces up to 150% higher long-term retention than passive reading.',
  'Testing yourself on newly learned concepts triggers synaptic consolidation in memory.',
  'Mistakes made during practice quizzes identify your exact knowledge boundaries for efficient revision.',
  'Spaced testing and conceptual multiple-choice questions protect against illusion of competence.'
];

export default function LoadingState({ documentName }: LoadingStateProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Stepped progression
    const timer1 = setTimeout(() => setCurrentStep(2), 1800);
    const timer2 = setTimeout(() => setCurrentStep(3), 4200);

    // Tip rotation
    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % STUDY_TIPS.length);
    }, 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(tipTimer);
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-12">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Central Animated Icon */}
        <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <div className="w-14 h-14 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <BrainCircuit className="w-7 h-7 animate-pulse" />
          </div>
        </div>

        {/* Headings */}
        <h3 className="text-xl font-bold text-white mb-1.5">
          Generating Your Practice Quiz
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-8 truncate">
          {documentName ? `Analyzing ${documentName}` : 'Extracting concepts and synthesizing questions'}
        </p>

        {/* Stepped Progress List */}
        <div className="space-y-3 text-left max-w-md mx-auto mb-8">
          {/* Step 1 */}
          <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
            currentStep > 1
              ? 'bg-slate-950/60 border-emerald-500/30 text-slate-300'
              : currentStep === 1
              ? 'bg-indigo-950/30 border-indigo-500/40 text-white shadow-sm'
              : 'bg-slate-950/30 border-slate-800/50 text-slate-500'
          }`}>
            <div className="shrink-0">
              {currentStep > 1 ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : currentStep === 1 ? (
                <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              ) : (
                <FileText className="w-4 h-4 text-slate-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold">1. Extracting PDF lecture text</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
            currentStep > 2
              ? 'bg-slate-950/60 border-emerald-500/30 text-slate-300'
              : currentStep === 2
              ? 'bg-indigo-950/30 border-indigo-500/40 text-white shadow-sm'
              : 'bg-slate-950/30 border-slate-800/50 text-slate-500'
          }`}>
            <div className="shrink-0">
              {currentStep > 2 ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : currentStep === 2 ? (
                <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-slate-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold">2. Synthesizing 5 questions with Gemini Flash</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
            currentStep >= 3
              ? 'bg-indigo-950/30 border-indigo-500/40 text-white shadow-sm'
              : 'bg-slate-950/30 border-slate-800/50 text-slate-500'
          }`}>
            <div className="shrink-0">
              {currentStep >= 3 ? (
                <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-700" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold">3. Structuring difficulty (2 Easy, 2 Medium, 1 Hard)</p>
            </div>
          </div>
        </div>

        {/* Study Tip Box */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-left">
          <div className="flex items-center gap-2 text-indigo-400 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Study Science Fact</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed transition-all duration-300">
            {STUDY_TIPS[tipIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}
