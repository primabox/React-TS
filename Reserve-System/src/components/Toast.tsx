import { useEffect } from 'react';

interface Props {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 3800);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-8 right-8 z-400 toast-enter">
      <div
        className={`flex items-center gap-4 px-6 py-4 border backdrop-blur-md max-w-sm ${
          type === 'success'
            ? 'bg-[#0E0E10]/95 border-[#8B1F2E]/35 text-[#C4909A]'
            : 'bg-[#140A0A]/95 border-red-900/40 text-red-400/80'
        }`}
      >
        <span className={`text-xs ${type === 'success' ? 'text-[#8B1F2E]' : 'text-red-600/60'}`}>
          {type === 'success' ? '✦' : '—'}
        </span>
        <span className="text-[11px] tracking-[0.18em] uppercase flex-1">{message}</span>
        <button
          onClick={onClose}
          className="text-[#3A3830] hover:text-[#8B1F2E] transition-colors duration-200 text-xs ml-2"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
