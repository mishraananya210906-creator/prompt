'use client';

import React, { useState } from 'react';
import { QuizPayload } from '@/types/quiz';
import { ChevronLeft, ChevronRight, Check, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';

interface QuizInterfaceProps {
  quiz: QuizPayload;
  onSubmit: (answers: Record<number, number>) => void;
  onCancel: () => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizInterface({ quiz, onSubmit, onCancel }: QuizInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);

  const currentQuestion = quiz.questions[currentIndex];
  const total = quiz.questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / total) * 100);

  const handleSelectOption = (optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
    setShowIncompleteWarning(false);
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowIncompleteWarning(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowIncompleteWarning(false);
    }
  };

  const handleSubmit = () => {
    if (answeredCount < total) {
      setShowIncompleteWarning(true);
      return;
    }
    onSubmit(answers);
  };

  const handleForceSubmit = () => {
    onSubmit(answers);
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'easy':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Easy
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Medium
          </span>
        );
      case 'challenging':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Challenging
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-6">
      {/* Top Meta Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
        {/* Progress Bar & Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                {quiz.title}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                Question {currentIndex + 1} of {total}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {getDifficultyBadge(currentQuestion.difficulty)}
              {currentQuestion.topic && (
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700 max-w-[200px] truncate">
                  {currentQuestion.topic}
                </span>
              )}
            </div>
          </div>

          {/* Progress Visual Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-4">
            <div
              className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
            />
          </div>

          {/* Question Step Indicators */}
          <div className="flex items-center justify-between gap-1.5 pt-1">
            {quiz.questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowIncompleteWarning(false);
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 border ${
                    isCurrent
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20 scale-105'
                      : isAnswered
                      ? 'bg-indigo-950/40 text-indigo-300 border-indigo-800/60 hover:bg-indigo-900/40'
                      : 'bg-slate-950/50 text-slate-500 border-slate-800 hover:border-slate-700'
                  }`}
                  title={`Question ${idx + 1}: ${isAnswered ? 'Answered' : 'Not answered'}`}
                >
                  <span>{idx + 1}</span>
                  {isAnswered && !isCurrent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Text Box */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-5 sm:p-6 mb-6">
          <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
            {currentQuestion.question}
          </p>
        </div>

        {/* 4 Answer Options */}
        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((optionText, optIndex) => {
            const isSelected = answers[currentQuestion.id] === optIndex;
            return (
              <button
                key={optIndex}
                type="button"
                onClick={() => handleSelectOption(optIndex)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start gap-3.5 group relative ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/40'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900/40'
                }`}
              >
                {/* Option Letter Icon */}
                <div
                  className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                  }`}
                >
                  {OPTION_LETTERS[optIndex]}
                </div>

                {/* Option Content */}
                <div className="flex-1 pr-6 pt-0.5">
                  <span className={`text-sm leading-relaxed ${isSelected ? 'font-medium text-white' : 'text-slate-300'}`}>
                    {optionText}
                  </span>
                </div>

                {/* Selection Checkmark */}
                {isSelected && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Warning if trying to submit with incomplete answers */}
        {showIncompleteWarning && answeredCount < total && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-200 text-xs sm:text-sm animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-amber-300">
                You have {total - answeredCount} unanswered question{total - answeredCount > 1 ? 's' : ''}.
              </p>
              <p className="mt-1 text-amber-200/80 leading-relaxed">
                You can go back to answer remaining questions, or submit now to view your score.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={handleForceSubmit}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-semibold text-xs hover:bg-amber-400 transition-colors"
                >
                  Submit Anyway
                </button>
                <button
                  type="button"
                  onClick={() => setShowIncompleteWarning(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-medium text-xs hover:bg-slate-700 transition-colors"
                >
                  Review Questions
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Controls */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors ${
              currentIndex === 0
                ? 'text-slate-600 bg-slate-950/20 cursor-not-allowed border border-transparent'
                : 'text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-slate-500 hover:text-slate-300 px-3 py-2 rounded-lg transition-colors"
            >
              Quit
            </button>

            {currentIndex < total - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-500 flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
              >
                <span>Submit Quiz</span>
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
