import { useState, useEffect, useRef } from 'react';
import { socket, API_URL } from './lib/socket';
import LandingPage from './components/pages/LandingPage';
import ResumeScorePage from './components/pages/ResumeScorePage';
import InterviewPage from './components/pages/InterviewPage';
import ResultsPage from './components/pages/ResultsPage';
import './index.css';

function App() {
  // ─── Page state: landing → resumeScore → interview → results ──────
  const [page, setPage] = useState('landing');

  // Resume & Job
  const [resumeFile, setResumeFile] = useState(null);
  const [jobRequirements, setJobRequirements] = useState('');
  const [resumeSessionId, setResumeSessionId] = useState('');
  const [resumeScore, setResumeScore] = useState(null);
  const [resumePreview, setResumePreview] = useState('');
  const [questionsCount, setQuestionsCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Interview
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiMessage, setAiMessage] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [webcamStream, setWebcamStream] = useState(null);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [interviewDuration, setInterviewDuration] = useState(0);

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [currentQuestionNum, setCurrentQuestionNum] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);
  const durationInterval = useRef(null);

  // ─── Effects ───────────────────────────────────────────────────────
  useEffect(() => {
    return () => { if (durationInterval.current) clearInterval(durationInterval.current); };
  }, []);

  useEffect(() => {
    const hasSR = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    const hasSS = 'speechSynthesis' in window;
    if (!hasSR || !hasSS) {
      setSpeechSupported(false);
      setErrorMessage('Your browser does not support voice features. Please use Chrome, Edge, or Safari.');
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (speechSupported) {
      const loadVoices = () => synthesisRef.current.getVoices();
      loadVoices();
      synthesisRef.current.onvoiceschanged = loadVoices;
    }
  }, [speechSupported]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
          else interimTranscript += event.results[i][0].transcript;
        }
        setTranscript(finalTranscript || interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') setErrorMessage('Microphone access denied.');
      };
      recognitionRef.current.onend = () => {
        if (isListening) recognitionRef.current.start();
      };
    }
    return () => recognitionRef.current?.stop();
  }, [isListening]);

  // Socket listeners
  useEffect(() => {
    socket.on('ai_response', (data) => {
      setIsAiThinking(false);
      setAiMessage(data.message);
      speakText(data.message);
      if (data.questionNumber) setCurrentQuestionNum(data.questionNumber);
      if (data.totalQuestions) setTotalQuestions(data.totalQuestions);
    });
    socket.on('interview_started', (data) => {
      setIsLoading(false);
      setTotalQuestions(data.totalQuestions || 8);
      setCurrentQuestionNum(1);
    });
    socket.on('interview_feedback', (data) => {
      setFeedback(data);
      setPage('results');
      setIsLoading(false);
      clearInterval(durationInterval.current);
    });
    socket.on('connect_error', () => {
      setErrorMessage('Connection failed. Please ensure the server is running.');
      setIsLoading(false);
      setIsAiThinking(false);
    });
    socket.on('disconnect', () => {
      if (page === 'interview') setErrorMessage('Connection lost. Attempting to reconnect...');
    });
    socket.on('connect', () => {
      if (errorMessage?.includes('Connection')) setErrorMessage('');
    });
    return () => {
      socket.off('ai_response');
      socket.off('interview_started');
      socket.off('interview_feedback');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.off('connect');
    };
  }, []);

  useEffect(() => {
    if (webcamStream && videoRef.current) videoRef.current.srcObject = webcamStream;
  }, [webcamStream, page, isVideoOff]);

  // ─── Helpers ───────────────────────────────────────────────────────
  const speakText = (text) => {
    if (!speechSupported) return;
    synthesisRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;
    const voices = synthesisRef.current.getVoices();
    const voice = voices.find(v => v.lang.includes('en') && v.name.includes('Google'))
      || voices.find(v => v.lang.includes('en-US'))
      || voices[0];
    if (voice) utterance.voice = voice;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    synthesisRef.current.speak(utterance);
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setWebcamStream(stream);
      setErrorMessage('');
    } catch {
      setErrorMessage('Camera access denied. You can still continue without video.');
    }
  };

  const stopWebcam = () => {
    webcamStream?.getTracks().forEach(track => track.stop());
    setWebcamStream(null);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // ─── Resume Upload ─────────────────────────────────────────────────
  const handleFileSelect = (file) => {
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      setErrorMessage('');
    } else {
      setErrorMessage('Please upload a PDF file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleUploadResume = async () => {
    if (!resumeFile) {
      setErrorMessage('Please upload your resume (PDF).');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('job_requirements', jobRequirements);

    try {
      const response = await fetch(`${API_URL}/api/upload-resume`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.error) {
        setErrorMessage(data.error);
        setIsLoading(false);
        return;
      }

      setResumeSessionId(data.session_id);
      setResumeScore(data.resume_score);
      setResumePreview(data.resume_preview || '');
      setQuestionsCount(data.questions_count);
      setPage('resumeScore');
    } catch {
      setErrorMessage('Failed to upload. Make sure the server is running (python main.py).');
    }
    setIsLoading(false);
  };

  // ─── Interview Controls ────────────────────────────────────────────
  const startInterview = () => {
    if (!speechSupported) {
      setErrorMessage('Voice features not supported. Please use Chrome or Edge.');
      return;
    }
    setIsLoading(true);
    setCurrentQuestionNum(0);
    setAiMessage('');
    setErrorMessage('');

    setTimeout(() => {
      setPage('interview');
      setIsLoading(false);
      setInterviewDuration(0);
      durationInterval.current = setInterval(() => setInterviewDuration(prev => prev + 1), 1000);
      startWebcam();
      socket.emit('start_interview', { session_id: resumeSessionId });
    }, 500);
  };

  const toggleListening = () => {
    if (!speechSupported) {
      setErrorMessage('Speech recognition not supported.');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (transcript.trim()) {
        setIsAiThinking(true);
        socket.emit('user_message', { message: transcript });
        setTranscript('');
      }
    } else {
      setTranscript('');
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch {
        setErrorMessage('Failed to start microphone.');
      }
    }
  };

  const toggleVideo = () => {
    if (webcamStream) webcamStream.getVideoTracks().forEach(track => { track.enabled = isVideoOff; });
    setIsVideoOff(!isVideoOff);
  };

  const endInterview = () => {
    setIsLoading(true);
    recognitionRef.current?.stop();
    setIsListening(false);
    synthesisRef.current?.cancel();
    stopWebcam();
    clearInterval(durationInterval.current);
    socket.emit('end_interview');
  };

  const goHome = () => {
    setPage('landing');
    setResumeFile(null);
    setJobRequirements('');
    setResumeSessionId('');
    setResumeScore(null);
    setResumePreview('');
    setQuestionsCount(0);
    setFeedback(null);
    setErrorMessage('');
  };

  // ─── Page Routing ──────────────────────────────────────────────────
  if (page === 'landing') {
    return (
      <LandingPage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        resumeFile={resumeFile}
        setResumeFile={setResumeFile}
        jobRequirements={jobRequirements}
        setJobRequirements={setJobRequirements}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        isLoading={isLoading}
        fileInputRef={fileInputRef}
        currentTime={currentTime}
        formatTime={formatTime}
        handleFileSelect={handleFileSelect}
        handleDrop={handleDrop}
        handleUploadResume={handleUploadResume}
      />
    );
  }

  if (page === 'resumeScore') {
    return (
      <ResumeScorePage
        resumeScore={resumeScore}
        questionsCount={questionsCount}
        isLoading={isLoading}
        goHome={goHome}
        startInterview={startInterview}
      />
    );
  }

  if (page === 'interview') {
    return (
      <InterviewPage
        isSpeaking={isSpeaking}
        isListening={isListening}
        isAiThinking={isAiThinking}
        aiMessage={aiMessage}
        transcript={transcript}
        isVideoOff={isVideoOff}
        webcamStream={webcamStream}
        currentTime={currentTime}
        interviewDuration={interviewDuration}
        currentQuestionNum={currentQuestionNum}
        totalQuestions={totalQuestions}
        videoRef={videoRef}
        formatDuration={formatDuration}
        formatTime={formatTime}
        toggleListening={toggleListening}
        toggleVideo={toggleVideo}
        endInterview={endInterview}
      />
    );
  }

  if (page === 'results') {
    return (
      <ResultsPage
        feedback={feedback}
        goHome={goHome}
        startInterview={startInterview}
      />
    );
  }

  return null;
}

export default App;
