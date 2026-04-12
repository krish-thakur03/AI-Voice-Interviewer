import LoadingOverlay from '../ui/LoadingOverlay';

export default function ResumeScorePage({
  resumeScore,
  questionsCount,
  isLoading,
  goHome,
  startInterview,
}) {
  const score = resumeScore?.overall_score || 0;

  const getScoreColor = (s) => {
    if (s >= 75) return { ring: 'text-green-500', bg: 'from-green-500 to-emerald-600', label: 'Strong Match' };
    if (s >= 50) return { ring: 'text-blue-500', bg: 'from-blue-500 to-indigo-600', label: 'Good Match' };
    if (s >= 25) return { ring: 'text-amber-500', bg: 'from-amber-500 to-orange-600', label: 'Partial Match' };
    return { ring: 'text-red-500', bg: 'from-red-500 to-rose-600', label: 'Low Match' };
  };

  const scoreStyle = getScoreColor(score);

  return (
    <div className="min-h-screen bg-[#fafbfc] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/15 to-indigo-500/15 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Resume Analysis</h1>
              <p className="text-xs text-slate-500 font-medium">Step 2 of 5</p>
            </div>
          </div>
          <button onClick={goHome} className="text-sm text-slate-500 hover:text-slate-700 font-medium">
            ← Back
          </button>
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto px-6 pt-12 pb-24">
        {/* Score Circle */}
        <div className="text-center mb-12 animate-scale-in">
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-48 h-48 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                className={scoreStyle.ring}
                stroke="currentColor" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${score * 3.14} ${314 - score * 3.14}`}
                style={{ transition: 'stroke-dasharray 1.5s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-slate-800">{score}</span>
              <span className="text-sm text-slate-500 font-medium">out of 100</span>
            </div>
          </div>
          <span className={`inline-block px-5 py-2 bg-gradient-to-r ${scoreStyle.bg} text-white text-sm font-bold rounded-full shadow-lg`}>
            {scoreStyle.label}
          </span>
        </div>

        {/* Summary */}
        {resumeScore?.summary && (
          <div className="glass rounded-2xl p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-slate-700 leading-relaxed">{resumeScore.summary}</p>
            </div>
          </div>
        )}

        {/* Skills Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Matched */}
          {resumeScore?.matched_skills?.length > 0 && (
            <div className="glass rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="font-bold text-green-700">Matched Skills</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {resumeScore.matched_skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Missing */}
          {resumeScore?.missing_skills?.length > 0 && (
            <div className="glass rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h4 className="font-bold text-red-700">Missing Skills</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {resumeScore.missing_skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Additional */}
          {resumeScore?.additional_skills?.length > 0 && (
            <div className="glass rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h4 className="font-bold text-purple-700">Bonus Skills</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {resumeScore.additional_skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="glass rounded-2xl p-5 mb-10 flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-xl">💡</span>
          </div>
          <p className="text-sm text-slate-600">
            <strong>{questionsCount} personalised questions</strong> have been prepared based on your resume and the job requirements.
            The AI will interview you and evaluate each answer.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 max-w-lg mx-auto animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <button onClick={goHome} className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2">
            ← Go Back
          </button>
          <button
            onClick={startInterview}
            className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            Start Interview
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </main>

      {/* Loading */}
      {isLoading && <LoadingOverlay title="Preparing your interview" subtitle="Setting up AI interviewer..." />}
    </div>
  );
}
