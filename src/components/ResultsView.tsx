'use client';

import React from 'react';
import { QuizResult } from '@/types/quiz';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  BookOpen, 
  ArrowRight, 
  HelpCircle, 
  Target, 
  Sparkles,
  Trophy,
  AlertTriangle
} from 'lucide-react';

interface ResultsViewProps {
  results: QuizResult;
  onRetry: () => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function ResultsView({ results, onRetry }: ResultsViewProps) {
  const { score, totalQuestions, percentage, correctCount, incorrectCount, feedbackMessage, weakTopics, questionReviews } = results;

  // Determine feedback badge color
  const isPerfect = score === totalQuestions;
  const isGood = score >= 3;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      {/* 1. Score Summary Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden text-center">
        {/* Decorative background glow */}
        <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          isPerfect ? 'bg-emerald-500/15' : isGood ? 'bg-indigo-500/15' : 'bg-amber-500/15'
        }`} />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700 mb-4">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Quiz Complete</span>
        </div>

        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-1">
          Your Score
        </h2>

        {/* Big Score Display */}
        <div className="flex items-baseline justify-center gap-2 my-2">
          <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">
            {score}
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-slate-500">
            / {totalQuestions}
          </span>
        </div>

        {/* Percentage and Badge Stats */}
        <div className="flex items-center justify-center gap-3 mt-3 mb-6">
          <div className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 text-sm font-semibold border border-slate-700">
            {percentage}%
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-semibold border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" />
            <span>{correctCount} Correct</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/10 text-rose-400 text-sm font-semibold border border-rose-500/20">
            <XCircle className="w-4 h-4" />
            <span>{incorrectCount} Incorrect</span>
          </div>
        </div>

        {/* Feedback Message Alert */}
        <div className={`p-4 rounded-2xl max-w-lg mx-auto text-sm font-medium border ${
          isPerfect
            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
            : isGood
            ? 'bg-indigo-950/30 border-indigo-500/30 text-indigo-200'
            : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
        }`}>
          <p className="leading-relaxed font-semibold">"{feedbackMessage}"</p>
        </div>

        {/* Try Another Quiz CTA */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group"
          >
            <RotateCcw className="w-4 h-4 group-hover:-rotate-90 transition-transform duration-300" />
            <span>Try Another Quiz</span>
          </button>
        </div>
      </div>

      {/* 2. Recommended Revision Section (Derived from mistakes) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Recommended Revision</h3>
            <p className="text-xs text-slate-400">
              Concepts identified from questions you missed
            </p>
          </div>
        </div>

        {weakTopics.length > 0 ? (
          <div className="space-y-3 mt-4">
            {weakTopics.map((wt, idx) => (
              <div
                key={idx}
                className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4.5 hover:border-amber-500/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    <h4 className="font-semibold text-sm text-white">{wt.topic}</h4>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-400/90 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 shrink-0">
                    Question {wt.relatedQuestions.join(', ')}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-4">
                  {wt.explanationSummary}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 text-center mt-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="font-semibold text-sm text-emerald-200">
              Mastery Achieved! No Revision Topics Needed.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              You answered all 5 questions correctly from this lecture. Ready to test another topic!
            </p>
          </div>
        )}
      </div>

      {/* 3. Question-by-Question Detailed Review */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Question Review</h3>
            <p className="text-xs text-slate-400">
              Review your answers, correct solutions, and explanations
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {questionReviews.map(({ question, selectedAnswer, isCorrect }, qIdx) => {
            return (
              <div
                key={question.id}
                className={`rounded-2xl p-5 border transition-colors ${
                  isCorrect
                    ? 'bg-slate-950/50 border-emerald-500/30'
                    : 'bg-slate-950/50 border-rose-500/30'
                }`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      Question {qIdx + 1}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-indigo-300 font-medium">
                      {question.topic}
                    </span>
                  </div>

                  {/* Status Badge */}
                  {isCorrect ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Correct</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Incorrect</span>
                    </span>
                  )}
                </div>

                {/* Question Text */}
                <h4 className="text-sm sm:text-base font-semibold text-white mb-4 leading-relaxed">
                  {question.question}
                </h4>

                {/* Answer Options Grid */}
                <div className="space-y-2 mb-4">
                  {question.options.map((optText, optIdx) => {
                    const isStudentChoice = selectedAnswer === optIdx;
                    const isRightAnswer = question.correctAnswer === optIdx;

                    let rowStyle = 'bg-slate-900/30 border-slate-800/80 text-slate-400';
                    let badgeStyle = 'bg-slate-800 text-slate-400';

                    if (isRightAnswer) {
                      rowStyle = 'bg-emerald-950/30 border-emerald-500/50 text-emerald-100 font-medium';
                      badgeStyle = 'bg-emerald-600 text-white';
                    } else if (isStudentChoice && !isCorrect) {
                      rowStyle = 'bg-rose-950/30 border-rose-500/50 text-rose-200 line-through decoration-rose-500/40';
                      badgeStyle = 'bg-rose-600 text-white';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-colors ${rowStyle}`}
                      >
                        <div
                          className={`w-6 h-6 rounded-md text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${badgeStyle}`}
                        >
                          {OPTION_LETTERS[optIdx]}
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5 leading-relaxed">
                          {optText}
                        </div>
                        {isRightAnswer && (
                          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                            Correct Answer
                          </span>
                        )}
                        {isStudentChoice && !isRightAnswer && (
                          <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 shrink-0">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Short Explanation */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300">
                  <span className="font-bold text-indigo-400 mr-1.5">Explanation:</span>
                  <span className="leading-relaxed">{question.explanation}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Retry Action at bottom */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onRetry}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm text-white bg-slate-800 hover:bg-slate-750 hover:border-slate-600 border border-slate-700 transition-all inline-flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Another Quiz</span>
        </button>
      </div>
    </div>
  );
}
