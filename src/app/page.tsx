'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import LandingHero from '@/components/LandingHero';
import FileUploader from '@/components/FileUploader';
import LoadingState from '@/components/LoadingState';
import QuizInterface from '@/components/QuizInterface';
import ResultsView from '@/components/ResultsView';
import { QuizPayload, QuizResult } from '@/types/quiz';
import { calculateQuizResults } from '@/lib/quiz-utils';

type AppState = 'idle' | 'generating' | 'quiz' | 'results';

export default function StudyForgeApp() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [quizData, setQuizData] = useState<QuizPayload | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null);
  const [currentDocName, setCurrentDocName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle Quiz Generation
  const handleGenerateQuiz = async (file: File | null, useSample: boolean) => {
    setErrorMessage(null);
    setAppState('generating');
    setCurrentDocName(useSample ? 'Sample Lecture PDF (Virtual Memory & Paging)' : file?.name || 'Uploaded Document');

    try {
      const formData = new FormData();
      if (useSample) {
        formData.append('useSample', 'true');
      } else if (file) {
        formData.append('file', file);
      }

      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate quiz from the study document.');
      }

      setQuizData(data.quiz);
      setAppState('quiz');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during quiz generation.';
      setErrorMessage(msg);
      setAppState('idle');
    }
  };

  // Handle Quiz Submission
  const handleQuizSubmit = (answers: Record<number, number>) => {
    if (!quizData) return;
    const results = calculateQuizResults(quizData, answers);
    setQuizResults(results);
    setAppState('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Reset / Try Another Quiz
  const handleReset = () => {
    setAppState('idle');
    setQuizData(null);
    setQuizResults(null);
    setCurrentDocName('');
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 bg-grid-pattern relative">
      <Navbar onReset={handleReset} />

      <main className="flex-1 flex flex-col justify-center py-6 sm:py-10 relative z-10">
        {appState === 'idle' && (
          <div className="animate-in fade-in duration-300">
            <LandingHero />
            <FileUploader
              onGenerateQuiz={handleGenerateQuiz}
              isLoading={false}
              errorMessage={errorMessage}
              onClearError={() => setErrorMessage(null)}
            />
          </div>
        )}

        {appState === 'generating' && (
          <div className="animate-in fade-in duration-300">
            <LoadingState documentName={currentDocName} />
          </div>
        )}

        {appState === 'quiz' && quizData && (
          <div className="animate-in fade-in duration-300">
            <QuizInterface
              quiz={quizData}
              onSubmit={handleQuizSubmit}
              onCancel={handleReset}
            />
          </div>
        )}

        {appState === 'results' && quizResults && (
          <div className="animate-in fade-in duration-300">
            <ResultsView
              results={quizResults}
              onRetry={handleReset}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>StudyForge – AI Study Quiz • Prompt Wars Hackathon</span>
          <span className="text-slate-600">Built with Next.js, Tailwind CSS & Google Gemini Flash</span>
        </div>
      </footer>
    </div>
  );
}
