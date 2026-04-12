export default function ErrorBanner({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="max-w-2xl mx-auto mb-8 p-4 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center gap-3 animate-scale-in">
      <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p className="text-black text-sm font-medium flex-1">{message}</p>
      <button onClick={onClose} className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors">
        <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
