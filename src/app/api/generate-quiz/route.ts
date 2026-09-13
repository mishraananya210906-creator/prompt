import { NextRequest, NextResponse } from 'next/server';
import { extractText } from 'unpdf';
import { generateQuizFromText } from '@/lib/gemini';
import fs from 'fs';
import path from 'path';

export const maxDuration = 60; // Allow sufficient time for Gemini reasoning

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const useSample = formData.get('useSample') === 'true';
    const file = formData.get('file') as File | null;

    let textContent = '';
    let isSample = false;

    if (useSample) {
      isSample = true;
      // Read bundled sample PDF
      const samplePath = path.join(process.cwd(), 'public', 'sample-lecture.pdf');
      if (fs.existsSync(samplePath)) {
        const fileBuffer = fs.readFileSync(samplePath);
        const { text } = await extractText(new Uint8Array(fileBuffer));
        textContent = Array.isArray(text) ? text.join('\n\n') : String(text || '');
      } else {
        // Fallback lecture content if static file is unavailable in serverless environment
        textContent = `CS 301: Modern Operating Systems - Lecture 7: Virtual Memory, Paging, and Page Faults.
Virtual memory provides an illusion of a large, contiguous address space. The Translation Lookaside Buffer (TLB) is a high-speed hardware cache for page table entries. A TLB hit allows translation in a single clock cycle, while a TLB miss requires a multi-step page table walk.
When a program accesses an unmapped address in physical memory, the MMU raises a page fault exception. The OS kernel traps the exception, fetches the missing page from disk swap space into an empty frame, updates the page table valid bit, and restarts the faulting instruction.
Paging eliminates external fragmentation completely, but introduces internal fragmentation within the last page frame allocated to a process.
Common page replacement algorithms: FIFO suffers from Belady's Anomaly where adding frames can increase page faults; LRU replaces the page that has not been referenced for the longest duration; Optimal replaces the page that will not be used for the longest future time.
Thrashing occurs when the sum of process working sets exceeds total physical RAM, causing the system to spend more time paging than executing instructions.`;
      }
    } else {
      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No study document provided. Please select or drag a PDF file.' },
          { status: 400 }
        );
      }

      // Check file type
      const isPdfMime = file.type === 'application/pdf';
      const isPdfExt = file.name.toLowerCase().endsWith('.pdf');
      if (!isPdfMime && !isPdfExt) {
        return NextResponse.json(
          { success: false, error: 'Unsupported format. Please upload a PDF document (.pdf).' },
          { status: 400 }
        );
      }

      // Check file size (limit 15MB)
      const MAX_FILE_SIZE = 15 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: 'File is too large (max 15MB). Please upload a smaller study document or select key lecture slides.' },
          { status: 400 }
        );
      }

      // Check for zero-byte file
      if (file.size === 0) {
        return NextResponse.json(
          { success: false, error: 'The uploaded PDF file is empty (0 bytes). Please choose a valid document.' },
          { status: 400 }
        );
      }

      // Extract text using unpdf
      const arrayBuffer = await file.arrayBuffer();
      try {
        const { text } = await extractText(new Uint8Array(arrayBuffer));
        textContent = Array.isArray(text) ? text.join('\n\n') : String(text || '');
      } catch (parseErr) {
        console.error('PDF parsing error:', parseErr);
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to read the PDF. The file may be password-protected, encrypted, or corrupted.'
          },
          { status: 400 }
        );
      }

      // Validate extracted text
      const cleanChars = textContent.replace(/\s+/g, ' ').trim();
      if (cleanChars.length < 50) {
        return NextResponse.json(
          {
            success: false,
            error: 'Could not extract readable text from this PDF. Please ensure the document contains selectable text or lecture slides, and is not a scanned image without OCR.'
          },
          { status: 400 }
        );
      }
    }

    // Call Gemini for structured quiz synthesis
    const quiz = await generateQuizFromText(textContent, isSample);

    return NextResponse.json({
      success: true,
      quiz,
      metadata: {
        charCount: textContent.length,
        source: isSample ? 'Sample Lecture PDF (OS Virtual Memory)' : file?.name
      }
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred while generating the quiz.';
    console.error('Quiz Generation Route Error:', err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
