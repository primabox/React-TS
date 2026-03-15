interface Props {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ title, message, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onCancel}
      />
      {/* Dialog */}
      <div className="relative bg-[#0E0E10] border border-[#1A1816] w-full max-w-md">
        <div className="h-px bg-linear-to-r from-transparent via-[#8B1F2E] to-transparent" />
        <div className="p-8">
          <p className="text-[9px] tracking-[0.4em] uppercase text-[#8B1F2E] mb-3">Potvrdit akci</p>
          <h3 className="font-serif text-2xl text-[#FAFAF8] mb-3">{title}</h3>
          <p className="text-[#6B6055] text-sm leading-relaxed mb-9">{message}</p>
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 border border-[#2A2826] text-[#6B6055] text-[9px] tracking-[0.3em] uppercase py-3.5 hover:border-[#8B1F2E]/40 hover:text-[#8B1F2E] transition-colors duration-200"
            >
              Zrušit
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-950/40 border border-red-900/40 text-red-400/80 text-[9px] tracking-[0.3em] uppercase py-3.5 hover:bg-red-900/30 transition-colors duration-200"
            >
              Smazat pobyt
            </button>
          </div>
        </div>
        <div className="h-px bg-linear-to-r from-transparent via-[#2A2826] to-transparent" />
      </div>
    </div>
  );
}
