'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, FileText, Trash2, ArrowRight, AlertCircle, FileCheck, Sparkles } from 'lucide-react';

interface FileUploaderProps {
  onGenerateQuiz: (file: File | null, useSample: boolean) => void;
  isLoading: boolean;
  errorMessage: string | null;
  onClearError: () => void;
}

export default function FileUploader({
  onGenerateQuiz,
  isLoading,
  errorMessage,
  onClearError
}: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const validateAndSetFile = (file: File) => {
    setLocalError(null);
    onClearError();

    // Check PDF type
    const isPdfType = file.type === 'application/pdf';
    const isPdfExt = file.name.toLowerCase().endsWith('.pdf');

    if (!isPdfType && !isPdfExt) {
      setLocalError('Invalid file format. Please upload a PDF study document (.pdf).');
      setSelectedFile(null);
      return false;
    }

    // Check empty file
    if (file.size === 0) {
      setLocalError('The selected file is empty (0 bytes). Please choose a valid PDF lecture document.');
      setSelectedFile(null);
      return false;
    }

    // Check size limit (15MB)
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setLocalError('File size exceeds the 15MB limit. Please upload a smaller study document.');
      setSelectedFile(null);
      return false;
    }

    setSelectedFile(file);
    return true;
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setLocalError(null);
    onClearError();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = () => {
    if (!selectedFile) {
      setLocalError('Please select or drop a PDF study document first.');
      return;
    }
    onGenerateQuiz(selectedFile, false);
  };

  const handleSampleClick = () => {
    setLocalError(null);
    onClearError();
    setSelectedFile(null);
    onGenerateQuiz(null, true);
  };

  const activeError = localError || errorMessage;

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Upload Container Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
        {/* Hidden native input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          id="study-material-upload"
        />

        {/* Dropzone Area */}
        {!selectedFile ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all duration-200 group ${
              isDragOver
                ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
                : 'border-slate-700/80 hover:border-indigo-500/60 hover:bg-slate-800/40 bg-slate-950/40'
            }`}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:text-indigo-300 transition-all">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-200 transition-colors">
              Upload Study Material
            </h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto mb-5">
              Drag and drop your lecture slides or study document here, or click to browse.
            </p>

            {/* Format pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-medium text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Supported format: <strong className="text-white">PDF</strong> (Max 15MB)
            </div>
          </div>
        ) : (
          /* Selected File Card */
          <div className="bg-slate-950/60 border border-indigo-500/30 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <FileCheck className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate" title={selectedFile.name}>
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{formatFileSize(selectedFile.size)}</span>
                    <span>•</span>
                    <span className="text-indigo-400 font-medium">PDF Document</span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {activeError && (
          <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-300 text-sm animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1">
              <p className="font-semibold text-rose-200">Upload notice</p>
              <p className="text-xs mt-0.5 leading-relaxed text-rose-300">{activeError}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          {/* Main Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!selectedFile || isLoading}
            className={`w-full sm:flex-1 py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
              !selectedFile || isLoading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white hover:from-indigo-400 hover:to-violet-500 hover:shadow-indigo-500/25 active:scale-[0.99]'
            }`}
          >
            <span>Generate 5-Question Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Button for Hackathon Judges */}
          <button
            type="button"
            onClick={handleSampleClick}
            disabled={isLoading}
            className="w-full sm:w-auto py-3.5 px-5 rounded-xl text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-800/50 flex items-center justify-center gap-2 transition-all shrink-0"
            title="Load a pre-configured Operating Systems lecture on Virtual Memory & Paging"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Try Sample Lecture PDF</span>
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-500">
            Strictly focused student flow: 1 document $\rightarrow$ 5 questions $\rightarrow$ instant feedback.
          </p>
        </div>
      </div>
    </div>
  );
}
