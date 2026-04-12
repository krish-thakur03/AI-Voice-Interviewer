import Avatar3D from '../Avatar3D';

export default function InterviewPage({
  isSpeaking,
  isListening,
  isAiThinking,
  aiMessage,
  transcript,
  isVideoOff,
  webcamStream,
  currentTime,
  interviewDuration,
  currentQuestionNum,
  totalQuestions,
  videoRef,
  formatDuration,
  formatTime,
  toggleListening,
  toggleVideo,
  endInterview,
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative glass border-b border-slate-200/50 px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Interview Session</h1>
            <p className="text-xs text-slate-500">Resume-Based Interview</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {totalQuestions > 0 && (
            <div className="flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalQuestions }).map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i < currentQuestionNum ? 'bg-blue-500' : 'bg-slate-200'}`}></div>
                ))}
              </div>
              <span className="text-sm font-bold text-blue-700">{currentQuestionNum}/{totalQuestions}</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200/50 rounded-2xl">
            <div className="relative">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-50"></div>
            </div>
            <span className="font-mono text-sm font-bold text-red-600">{formatDuration(interviewDuration)}</span>
          </div>
          <span className="text-sm text-slate-500 font-medium">{formatTime(currentTime)}</span>
        </div>
      </header>

      {/* Main */}
      <main className="relative flex-1 p-6 flex gap-6 max-w-7xl mx-auto w-full z-10">
        {/* AI Panel */}
        <div className={`flex-1 glass rounded-3xl overflow-hidden relative transition-all duration-500 ${isSpeaking ? 'ring-2 ring-blue-400 ring-offset-4 ring-offset-slate-100' : ''}`}>
          <Avatar3D isSpeaking={isSpeaking} />

          <div className="absolute top-5 left-5">
            <div className="glass px-5 py-3 rounded-2xl flex items-center gap-4">
              <div className="relative">
                <div className={`w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg ${isSpeaking ? 'animate-pulse-glow' : ''}`}>
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                {isSpeaking && <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>}
              </div>
              <div>
                <span className="text-slate-800 text-sm font-bold block">AI Interviewer</span>
                <span className={`text-xs font-medium ${isSpeaking ? 'text-green-600' : isAiThinking ? 'text-blue-600' : 'text-slate-400'}`}>
                  {isSpeaking ? 'Speaking' : isAiThinking ? 'Processing...' : 'Ready'}
                </span>
              </div>
            </div>
          </div>

          {isAiThinking && (
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="glass rounded-2xl p-6 max-w-3xl animate-scale-in">
                <div className="flex items-center gap-4">
                  <div className="relative w-10 h-10">
                    <div className="absolute inset-0 rounded-full border-2 border-slate-200"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                  </div>
                  <div>
                    <span className="text-slate-700 text-sm font-semibold">Evaluating your answer...</span>
                    <span className="text-slate-400 text-xs block">Preparing next question</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {aiMessage && !isAiThinking && (
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="glass rounded-2xl p-6 max-w-3xl animate-fade-in-up">
                <p className="text-slate-700 text-base leading-relaxed font-medium">{aiMessage}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-80 flex flex-col gap-5">
          <div className={`glass rounded-3xl overflow-hidden transition-all duration-500 ${isListening ? 'ring-2 ring-green-400 ring-offset-4 ring-offset-slate-100' : ''}`}>
            <div className="aspect-video relative">
              <video ref={videoRef} autoPlay muted playsInline className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`} />
              {(isVideoOff || !webcamStream) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                  <div className="w-20 h-20 bg-white/80 backdrop-blur rounded-3xl flex items-center justify-center shadow-xl">
                    <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              )}
              <div className="absolute top-3 left-3">
                <div className="glass px-4 py-2 rounded-xl flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                  {isListening && <div className="absolute left-4 top-2.5 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping opacity-50"></div>}
                  <span className="text-slate-700 text-xs font-bold">You</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 glass rounded-3xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-700">Your Response</h3>
            </div>
            <div className="min-h-[120px] bg-slate-50/80 rounded-2xl p-5 border border-slate-100">
              {transcript ? (
                <p className="text-slate-700 text-sm leading-relaxed">{transcript}</p>
              ) : (
                <p className="text-slate-400 text-sm">{isListening ? 'Listening...' : 'Click the mic to start speaking'}</p>
              )}
            </div>
            {isListening && (
              <div className="mt-4 flex items-center justify-center gap-1">
                {[4, 6, 4, 5, 3, 4, 6].map((h, i) => (
                  <div key={i} className="w-1 bg-gradient-to-t from-green-500 to-emerald-400 rounded-full animate-pulse" style={{ height: `${h * 4}px`, animationDelay: `${i * 0.1}s` }}></div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Controls */}
      <footer className="relative glass border-t border-slate-200/50 px-6 py-5 z-10">
        <div className="flex items-center justify-center gap-4">
          <button onClick={toggleListening} className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${isListening ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30' : 'bg-white border-2 border-slate-200 hover:border-slate-300 shadow-lg'}`}>
            {isListening && <div className="absolute inset-0 rounded-2xl bg-green-400 animate-ping opacity-20"></div>}
            <svg className={`w-7 h-7 relative z-10 ${isListening ? 'text-white' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button onClick={toggleVideo} className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${isVideoOff ? 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30' : 'bg-white border-2 border-slate-200 hover:border-slate-300'}`}>
            <svg className={`w-7 h-7 ${isVideoOff ? 'text-white' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <div className="w-px h-12 bg-slate-200 mx-3"></div>
          <button onClick={endInterview} className="px-8 py-4 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-xl hover:-translate-y-0.5">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
            </svg>
            End Interview
          </button>
        </div>
        <p className="text-center text-slate-500 text-sm mt-4 font-medium">
          {isListening ? '🎤 Recording your answer — Click mic when finished' : '💡 Press the microphone to start speaking'}
        </p>
      </footer>
    </div>
  );
}
