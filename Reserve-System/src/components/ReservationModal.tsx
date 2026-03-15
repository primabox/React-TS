import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import type { Reservation } from '../types/reservation';
import { exportToPdf } from '../utils/exportPdf';

const ROOM_CONFIG: Record<string, { image: string; tag: string }> = {
  Standard:  { image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80', tag: 'Classic'   },
  Deluxe:    { image: 'https://images.unsplash.com/photo-1566073771259-dedrobn0b83b?auto=format&fit=crop&w=1200&q=80', tag: 'Premium'   },
  Suite:     { image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80', tag: 'Exclusive' },
  Family:    { image: 'https://images.unsplash.com/photo-1578683548888-b773da38b4ca?auto=format&fit=crop&w=1200&q=80', tag: 'Family'    },
  Executive: { image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80', tag: 'Executive' },
};
const DEFAULT_CFG = ROOM_CONFIG.Standard;

function fmt(d: string) {
  return new Date(d).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
}
function calcNights(a: string, b: string) {
  return Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}
function fmtPrice(n: number) {
  return new Intl.NumberFormat('cs-CZ').format(n) + ' Kč';
}

interface Props {
  res: Reservation;
  onClose: () => void;
  onDeleteRequest: (id: string) => void;
}

export function ReservationModal({ res, onClose, onDeleteRequest }: Props) {
  const cfg = ROOM_CONFIG[res.roomType] ?? DEFAULT_CFG;
  const n = calcNights(res.checkIn, res.checkOut);
  const upcoming = new Date(res.checkIn) >= new Date();
  const [qrSrc, setQrSrc] = useState('');
  const [exporting, setExporting] = useState(false);

  const qrValue = JSON.stringify({
    id: res.id, guest: res.customerName, room: res.place,
    roomNumber: res.roomNumber, checkIn: res.checkIn, checkOut: res.checkOut,
    nights: n, totalPrice: res.totalPrice,
  });

  useEffect(() => {
    QRCode.toDataURL(qrValue, {
      width: 200, margin: 2,
      color: { dark: '#8B1F2E', light: '#0A0A0B' },
    }).then(setQrSrc).catch(() => {});
  }, [qrValue]);

  // close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleExportPdf = async () => {
    setExporting(true);
    try { await exportToPdf(res); } finally { setExporting(false); }
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/82 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[#0A0A0B] border border-[#1A1816] w-full max-w-3xl max-h-[92vh] overflow-y-auto flex flex-col">
        <div className="h-px bg-linear-to-r from-transparent via-[#8B1F2E] to-transparent shrink-0" />

        {/* Photo header */}
        <div className="relative h-52 overflow-hidden shrink-0">
          <img src={cfg.image} alt={res.place} className="w-full h-full object-cover opacity-55" />
          <div className="absolute inset-0 bg-linear-to-t from-[#0A0A0B] via-[#0A0A0B]/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-8 pb-6 flex items-end justify-between">
            <div>
              <span className="text-[9px] tracking-[0.3em] uppercase bg-[#8B1F2E] text-[#FAFAF8] px-2.5 py-1 font-semibold">
                {cfg.tag}
              </span>
              <p className="font-serif text-3xl text-[#FAFAF8] mt-2 leading-tight">{res.place}</p>
              {res.roomNumber && (
                <p className="text-[11px] text-[#8B1F2E]/80 mt-0.5 tracking-widest">Pokoj {res.roomNumber}</p>
              )}
            </div>
            <span className={`text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 border backdrop-blur-sm ${
              upcoming
                ? 'border-[#8B1F2E]/50 text-[#8B1F2E] bg-black/50'
                : 'border-emerald-600/40 text-emerald-400/80 bg-black/50'
            }`}>
              {upcoming ? 'Nadcházející' : 'Proběhlé'}
            </span>
          </div>
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-black/60 border border-white/10 text-[#8A8070] hover:text-[#8B1F2E] hover:border-[#8B1F2E]/30 transition-colors duration-200 flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_210px] flex-1">

          {/* Left: Details */}
          <div className="px-8 py-7 flex flex-col gap-6 border-r border-[#1A1816]">
            {/* Guest */}
            <div>
              <p className="text-[8px] tracking-[0.35em] uppercase text-[#8B1F2E] mb-2">Hlavní host</p>
              <p className="font-serif text-2xl text-[#FAFAF8]">{res.customerName}</p>
              <p className="text-[11px] text-[#6B6055] mt-1">
                {res.adults} dospělí{res.children > 0 ? ` · ${res.children} děti` : ''}
              </p>
            </div>

            <div className="h-px bg-[#1A1816]" />

            {/* Dates */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-[8px] tracking-[0.3em] uppercase text-[#4A4440] mb-2">Check-in</p>
                <p className="text-[13px] text-[#C4909A] leading-snug">{fmt(res.checkIn)}</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="font-serif text-3xl text-[#8B1F2E] italic leading-none">{n}</span>
                <span className="text-[9px] tracking-[0.2em] uppercase text-[#4A4440] mt-1">nocí</span>
              </div>
              <div className="text-right">
                <p className="text-[8px] tracking-[0.3em] uppercase text-[#4A4440] mb-2">Check-out</p>
                <p className="text-[13px] text-[#C4909A] leading-snug">{fmt(res.checkOut)}</p>
              </div>
            </div>

            <div className="h-px bg-[#1A1816]" />

            {/* Price */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[8px] tracking-[0.3em] uppercase text-[#4A4440] mb-2">Cena za noc</p>
                <p className="text-[13px] text-[#C4909A]">{fmtPrice(res.pricePerNight)}</p>
              </div>
              <div>
                <p className="text-[8px] tracking-[0.3em] uppercase text-[#4A4440] mb-2">Celková cena</p>
                <p className="font-serif text-xl text-[#8B1F2E]">{fmtPrice(res.totalPrice)}</p>
              </div>
            </div>

            {/* Special requests */}
            {res.specialRequests.trim() && (
              <>
                <div className="h-px bg-[#1A1816]" />
                <div>
                  <p className="text-[8px] tracking-[0.35em] uppercase text-[#8B1F2E] mb-2">Speciální požadavky</p>
                  <p className="text-[12px] text-[#8A8070] leading-relaxed">{res.specialRequests}</p>
                </div>
              </>
            )}

            <div className="h-px bg-[#1A1816]" />

            {/* Meta */}
            <div className="flex justify-between">
              <div>
                <p className="text-[8px] tracking-[0.3em] uppercase text-[#4A4440] mb-1">Číslo rezervace</p>
                <p className="text-[10px] text-[#3A3830] font-mono">#{res.id}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] tracking-[0.3em] uppercase text-[#4A4440] mb-1">Vytvořeno</p>
                <p className="text-[10px] text-[#3A3830]">{fmt(res.createdAt.split('T')[0])}</p>
              </div>
            </div>
          </div>

          {/* Right: QR + Actions */}
          <div className="px-6 py-7 flex flex-col items-center gap-5 bg-[#0E0E10]">
            <div className="w-full">
              <p className="text-[8px] tracking-[0.35em] uppercase text-[#8B1F2E] text-center mb-4">QR kód</p>
              {qrSrc ? (
                <div className="border border-[#8B1F2E]/20 p-3 mx-auto w-fit">
                  <img src={qrSrc} alt="QR Code" className="w-36 h-36" />
                </div>
              ) : (
                <div className="w-44 h-44 border border-[#2A2826] flex items-center justify-center mx-auto">
                  <span className="text-[#3A3830] text-[10px] tracking-wider">Načítání…</span>
                </div>
              )}
              <p className="text-[8px] tracking-[0.2em] uppercase text-[#2A2826] text-center mt-3">
                Scan pro ověření
              </p>
            </div>

            <div className="w-full h-px bg-[#1A1816]" />

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={handleExportPdf}
                disabled={exporting}
                className="w-full bg-[#8B1F2E] hover:bg-[#9E2435] active:bg-[#6A1520] disabled:opacity-50 text-[#FAFAF8] text-[9px] tracking-[0.35em] uppercase font-semibold py-4 transition-colors duration-300"
              >
                {exporting ? 'Generuji…' : '↓  Export PDF'}
              </button>

              <button
                onClick={() => { onDeleteRequest(res.id); }}
                className="w-full border border-red-900/30 text-red-500/50 text-[9px] tracking-[0.3em] uppercase py-3.5 hover:bg-red-950/30 hover:text-red-400/80 hover:border-red-900/50 transition-colors duration-200"
              >
                Smazat rezervaci
              </button>

              <button
                onClick={onClose}
                className="w-full border border-[#2A2826] text-[#5A5447] text-[9px] tracking-[0.3em] uppercase py-3.5 hover:border-[#8B1F2E]/30 hover:text-[#8B1F2E] transition-colors duration-200"
              >
                Zavřít
              </button>
            </div>
          </div>
        </div>

        <div className="h-px bg-linear-to-r from-transparent via-[#8B1F2E]/25 to-transparent shrink-0" />
      </div>
    </div>
  );
}
