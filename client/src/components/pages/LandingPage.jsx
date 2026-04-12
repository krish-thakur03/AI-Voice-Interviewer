import ErrorBanner from '../ui/ErrorBanner';

export default function LandingPage({
  errorMessage,
  setErrorMessage,
  resumeFile,
  setResumeFile,
  jobRequirements,
  setJobRequirements,
  isDragging,
  setIsDragging,
  isLoading,
  fileInputRef,
  currentTime,
  formatTime,
  handleFileSelect,
  handleDrop,
  handleUploadResume,
}) {
  return (
    <div className="min-h-screen bg-white relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.4 }}></div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight text-black">InterviewAI</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center gap-2 text-sm text-neutral-500">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              Online
            </div>
            <span className="text-sm text-neutral-400 font-mono tabular-nums">{formatTime(currentTime)}</span>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-6 pt-20 pb-32">
        {/* Error */}
        <ErrorBanner message={errorMessage} onClose={() => setErrorMessage('')} />

        {/* Hero */}
        <div className="text-center mb-20 animate-fade-in-up">
          <p className="text-lg text-neutral-500 max-w-xl mx-auto leading-relaxed font-light">
            Upload your resume and get an AI-powered mock interview tailored to   
            your experience — with real-time scoring and detailed feedback.
          </p>
        </div>

        {/* Flow Steps */}
        <div className="flex items-center justify-center gap-0 mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {['Upload', 'Score', 'Interview', 'Results'].map((step, i) => (
            <div key={i} className="flex items-center">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${i === 0 ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-400 border border-neutral-200'}`}>
                  {i + 1}
                </div>
                <span className="text-xs font-medium text-neutral-500 hidden sm:inline">{step}</span>
              </div>
              {i < 3 && (
                <div className="w-12 md:w-20 h-px bg-neutral-200 mx-3"></div>
              )}
            </div>
          ))}
        </div>

        {/* Upload Card */}
        <div className="max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 md:p-10">

            {/* File Upload Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 mb-6 ${
                isDragging ? 'border-black bg-neutral-50' :
                resumeFile ? 'border-neutral-300 bg-neutral-50' :
                'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />
              {resumeFile ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-medium text-black">{resumeFile.name}</p>
                  <p className="text-sm text-neutral-400">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setResumeFile(null); }}
                    className="text-xs text-neutral-400 hover:text-black font-medium mt-1 underline underline-offset-2"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0l-3 3m3-3l3 3M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-black">Drop your resume here or <span className="underline underline-offset-2">browse</span></p>
                    <p className="text-sm text-neutral-400 mt-1">PDF format only</p>
                  </div>
                </div>
              )}
            </div>

            {/* Job Requirements */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-black mb-2">
                Job Description
                <span className="text-neutral-400 font-normal ml-1">— optional</span>
              </label>
              <textarea
                value={jobRequirements}
                onChange={(e) => setJobRequirements(e.target.value)}
                placeholder="Paste the job posting here for more targeted questions and scoring..."
                className="w-full h-32 px-4 py-3 bg-white border border-neutral-200 rounded-xl text-black placeholder-neutral-300 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-400 transition-all"
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleUploadResume}
              disabled={isLoading || !resumeFile}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-200 ${
                isLoading || !resumeFile
                  ? 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-neutral-800 active:scale-[0.99]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-neutral-600 border-t-white rounded-full animate-spin"></div>
                  Analysing...
                </>
              ) : (
                <>
                  Analyse Resume
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto mt-24 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
          <h3 className="text-center text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-10">How it works</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ), title: 'Upload Resume', desc: 'Drop your PDF and we extract every detail' },
              { icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ), title: 'Resume Score', desc: 'AI scores your resume against the job posting' },
              { icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              ), title: 'Voice Interview', desc: 'Answer AI questions with your microphone' },
              { icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              ), title: 'Get Feedback', desc: 'Detailed per-answer scores and final verdict' },
            ].map((feature, i) => (
              <div key={i} className="text-center p-6 rounded-xl border border-transparent hover:border-neutral-200 hover:bg-neutral-50/50 transition-all duration-200 group">
                <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto mb-4 text-neutral-600 group-hover:bg-black group-hover:text-white transition-all duration-200">
                  {feature.icon}
                </div>
                <h4 className="font-semibold text-sm text-black mb-1.5">{feature.title}</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-24">
          <div className="inline-flex items-center gap-4 text-xs text-neutral-300">
            <span>React</span>
            <span className="w-1 h-1 bg-neutral-200 rounded-full"></span>
            <span>FastAPI</span>
            <span className="w-1 h-1 bg-neutral-200 rounded-full"></span>
            <span>Gemini AI</span>
          </div>
        </div>
      </main>
    </div>
  );
}
