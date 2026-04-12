export default function ResultsPage({ feedback, goHome, startInterview }) {
  const finalScore = feedback?.finalScore || 0;
  const resumeScoreVal = feedback?.resumeScore || 0;
  const interviewScoreVal = feedback?.interviewScore || 0;
  const evals = feedback?.answerEvaluations || [];

  const getScoreGradient = (s) => {
    if (s >= 80) return 'from-green-500 to-emerald-600';
    if (s >= 60) return 'from-blue-500 to-indigo-600';
    if (s >= 40) return 'from-amber-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  const getScoreLabel = (s) => {
    if (s >= 80) return 'Excellent';
    if (s >= 60) return 'Good';
    if (s >= 40) return 'Fair';
    return 'Needs Work';
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/15 to-indigo-500/15 rounded-full blur-3xl"></div>
      </div>

      <main className="relative max-w-3xl mx-auto px-6 py-16">
        {/* Final Score */}
        <div className="text-center mb-12 animate-scale-in">
          <div className="relative w-44 h-44 mx-auto mb-6">
            <svg className="w-44 h-44 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke="url(#scoreGrad)" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${finalScore * 3.14} ${314 - finalScore * 3.14}`}
                style={{ transition: 'stroke-dasharray 1.5s ease-out' }}
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-slate-800">{finalScore}</span>
              <span className="text-sm text-slate-500 font-medium">Final Score</span>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Interview Complete!</h2>
          <span className={`inline-block px-5 py-2 bg-gradient-to-r ${getScoreGradient(finalScore)} text-white text-sm font-bold rounded-full shadow-lg`}>
            {getScoreLabel(finalScore)}
          </span>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="glass rounded-2xl p-5 text-center">
            <div className="relative w-16 h-16 mx-auto mb-3">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="24" fill="none" stroke="#e2e8f0" strokeWidth="5" />
                <circle cx="30" cy="30" r="24" fill="none" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={`${resumeScoreVal * 1.508} ${150.8 - resumeScoreVal * 1.508}`} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-extrabold text-blue-600">{resumeScoreVal}</span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Resume Match</p>
            <p className="text-xs text-slate-400 mt-1">30% weight</p>
          </div>
          <div className="glass rounded-2xl p-5 text-center">
            <div className="relative w-16 h-16 mx-auto mb-3">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="24" fill="none" stroke="#e2e8f0" strokeWidth="5" />
                <circle cx="30" cy="30" r="24" fill="none" stroke="#8b5cf6" strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={`${interviewScoreVal * 1.508} ${150.8 - interviewScoreVal * 1.508}`} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-extrabold text-purple-600">{interviewScoreVal}</span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Interview Score</p>
            <p className="text-xs text-slate-400 mt-1">70% weight</p>
          </div>
          <div className="glass rounded-2xl p-5 text-center">
            <div className="relative w-16 h-16 mx-auto mb-3">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="24" fill="none" stroke="#e2e8f0" strokeWidth="5" />
                <circle cx="30" cy="30" r="24" fill="none" stroke="#10b981" strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={`${finalScore * 1.508} ${150.8 - finalScore * 1.508}`} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-extrabold text-green-600">{finalScore}</span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Final Score</p>
            <p className="text-xs text-slate-400 mt-1">Combined</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-4 text-center">
            <p className="text-3xl font-extrabold text-blue-600">{feedback?.totalQuestions || 0}</p>
            <p className="text-xs font-semibold text-blue-700">Questions Asked</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl p-4 text-center">
            <p className="text-3xl font-extrabold text-green-600">{feedback?.responsesGiven || 0}</p>
            <p className="text-xs font-semibold text-green-700">Responses Given</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200/50 rounded-2xl p-4 text-center">
            <p className="text-3xl font-extrabold text-purple-600">{feedback?.averageResponseLength || 0}</p>
            <p className="text-xs font-semibold text-purple-700">Avg Words</p>
          </div>
        </div>

        {/* Verdict */}
        {feedback?.verdict && (
          <div className="glass rounded-2xl p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-2">AI Verdict</h3>
                <p className="text-slate-600 leading-relaxed">{feedback.verdict}</p>
              </div>
            </div>
          </div>
        )}

        {/* Per-Answer Evaluations */}
        {evals.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Answer-by-Answer Evaluation
            </h3>
            <div className="space-y-4">
              {evals.map((ev, i) => (
                <div key={i} className="bg-slate-50/80 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-700 mb-1">Q{i + 1}: {ev.question || `Question ${i + 1}`}</p>
                      <p className="text-sm text-slate-500">{ev.feedback}</p>
                    </div>
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white bg-gradient-to-br ${getScoreGradient(ev.score * 10)}`}>
                      {ev.score}/10
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tip */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-5 flex items-start gap-4 mb-10 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-xl">💡</span>
          </div>
          <div>
            <h4 className="font-bold text-amber-800 mb-1">Pro Tip</h4>
            <p className="text-sm text-amber-700">Use the STAR method (Situation, Task, Action, Result) for behavioural questions. For technical questions, think aloud and explain your reasoning process.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <button onClick={goHome} className="flex-1 px-6 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            New Interview
          </button>
          <button onClick={startInterview} className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry Same Resume
          </button>
        </div>
      </main>
    </div>
  );
}
