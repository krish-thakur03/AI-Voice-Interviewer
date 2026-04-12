export default function LoadingOverlay({ title = 'Loading...', subtitle = '' }) {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-lg font-semibold text-slate-800">{title}</p>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
