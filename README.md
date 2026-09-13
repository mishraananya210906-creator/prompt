# StudyForge – AI Study Quiz
> **Turn your lectures into practice.**
> Built for the **Prompt Wars** Student Hackathon.

StudyForge is a focused, high-impact web application designed around **ONE complete student workflow**:
$$\text{Uploaded Study Material (PDF)} \longrightarrow \text{AI-Generated Quiz (5 questions)} \longrightarrow \text{Student Practice} \longrightarrow \text{Scoring, Feedback \& Topic Revision}$$

---

## 🎯 Key Features & Flow

1. **Landing Page & 3-Step Guide**:
   - Clean, modern, startup-grade UI.
   - Clear visual explanation: **1. Upload**, **2. Generate**, **3. Practice**.
2. **File Upload (PDF)**:
   - Drag-and-drop & file picker.
   - File size, format validation, and remove/replace controls.
   - **Quick Demo Mode**: 1-click test button (*"Try Sample Lecture PDF"*) pre-loaded with an authentic Operating Systems lecture on Virtual Memory & Paging for instant judge evaluation.
3. **AI Quiz Generation (Google Gemini)**:
   - Server-side text extraction using `unpdf` (zero native canvas dependency, works seamlessly on Vercel).
   - Strict JSON schema generation with Google Gemini Flash.
   - Balanced difficulty: **2 Easy**, **2 Medium**, and **1 Challenging**.
   - Questions, 4 options, and explanations are strictly grounded in the document text.
   - **Zero Client API Key Leakage**: API key is managed purely server-side.
4. **Interactive Quiz Interface**:
   - "Question X of 5", difficulty badge, and topic pill.
   - Real-time progress bar and clickable step indicators.
   - 4 clear option cards (A, B, C, D) with selection states.
   - No answer spoilers before submission.
5. **Results & Recommended Revision**:
   - Overall score (e.g., `4 / 5`), percentage (`80%`), and correct/incorrect badges.
   - Non-childish performance messages:
     - `5/5` $\rightarrow$ *"Excellent! You really know this material."*
     - `3–4/5` $\rightarrow$ *"Nice work! A little revision and you're there."*
     - `0–2/5` $\rightarrow$ *"Good start. Review the weak topics and try again."*
   - **Recommended Revision Section**: Automatically isolates missed questions and summarizes the exact concepts the student needs to revise.
   - **Detailed Question Review**: Highlights student choices, reveals correct answers, and provides concise educational explanations.
   - **Try Another Quiz**: Instant session reset to test another lecture.

---

## 🚀 Running Locally

### 1. Prerequisites
- **Node.js 18+** (Node.js 24 LTS recommended)
- **npm** (or pnpm / yarn)

### 2. Installation
```bash
git clone <your-repo-url>
cd studyforge
npm install
```

### 3. Configure Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```
Add your free Google Gemini API key from [Google AI Studio](https://aistudio.google.com/):
```env
GEMINI_API_KEY=AIzaSy...
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploying to Vercel

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Visit [vercel.com/new](https://vercel.com/new) and import the repository.
3. In the **Environment Variables** section, add:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your Google Gemini API Key
4. Click **Deploy**. Vercel will automatically build and deploy your Next.js application.

---

## 📋 Hackathon Submission Checklist (Prompt Wars)

- [x] **Single-workflow focus**: Upload PDF $\rightarrow$ Quiz $\rightarrow$ Score $\rightarrow$ Revision. No bloated multi-tool features.
- [x] **5 Balanced Questions**: 2 Easy, 2 Medium, 1 Challenging.
- [x] **Secure API handling**: `GEMINI_API_KEY` kept strictly on the server.
- [x] **Error resilience**: Handles invalid files, empty PDFs, large files (>15MB), and missing text gracefully.
- [x] **Judge-friendly Demo Experience**: Includes a 1-click sample lecture document button so judges can verify the entire interactive flow in 5 seconds.
- [x] **Tested & Verified**: Zero TypeScript compile errors, Next.js build passes cleanly.
