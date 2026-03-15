import type { Reservation } from '../types/reservation';

const ROOM_CONFIG: Record<string, { image: string; tag: string }> = {
  Standard:  { image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80', tag: 'Classic'   },
  Deluxe:    { image: 'https://images.unsplash.com/photo-1566073771259-dedrobn0b83b?auto=format&fit=crop&w=800&q=80', tag: 'Premium'   },
  Suite:     { image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80', tag: 'Exclusive' },
  Family:    { image: 'https://images.unsplash.com/photo-1578683548888-b773da38b4ca?auto=format&fit=crop&w=800&q=80', tag: 'Family'    },
  Executive: { image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80', tag: 'Executive' },
};
const DEFAULT_CFG = ROOM_CONFIG.Standard;

function fmt(d: string) {
  return new Date(d).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short', year: 'numeric' });
}
function calcNights(a: string, b: string) {
  return Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

interface Props {
  res: Reservation;
  onDetail: (res: Reservation) => void;
  onDeleteRequest: (id: string) => void;
}

export function ReservationCard({ res, onDetail, onDeleteRequest }: Props) {
  const cfg = ROOM_CONFIG[res.roomType] ?? DEFAULT_CFG;
  const n = calcNights(res.checkIn, res.checkOut);
  const upcoming = new Date(res.checkIn) >= new Date();

  return (
    <div className="group border border-[#1A1816] bg-[#0E0E10] overflow-hidden hover:border-[#8B1F2E]/35 transition-all duration-500 flex flex-col">

      {/* Photo */}
      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => onDetail(res)}>
        <img src={cfg.image} alt={res.place} loading="lazy"
          className="w-full h-full object-cover opacity-70 group-hover:opacity-88 group-hover:scale-105 transition-all duration-700" />
        <div className="absolute inset-0 bg-linear-to-t from-[#0E0E10] via-[#0E0E10]/15 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="text-[9px] tracking-[0.3em] uppercase bg-[#8B1F2E] text-[#FAFAF8] px-2.5 py-1 font-semibold">
            {cfg.tag}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className={`text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 border backdrop-blur-sm ${
            upcoming ? 'border-[#8B1F2E]/50 text-[#8B1F2E] bg-black/50' : 'border-emerald-700/40 text-emerald-400/80 bg-black/50'
          }`}>
            {upcoming ? 'Upcoming' : 'Completed'}
          </span>
        </div>
        {/* Hover: View detail hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[9px] tracking-[0.35em] uppercase text-[#8B1F2E] border border-[#8B1F2E]/40 bg-black/60 px-4 py-2 backdrop-blur-sm">
            Zobrazit detail
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 pt-5 pb-5 flex flex-col gap-4 flex-1">
        <div>
          <p className="font-serif text-[22px] leading-tight text-[#FAFAF8]">{res.place}</p>
          <p className="text-[11px] text-[#6B6055] mt-0.5 tracking-wide">
            {res.customerName}{res.roomNumber ? ` · Pokoj ${res.roomNumber}` : ''}
          </p>
        </div>

        <div className="h-px bg-linear-to-r from-[#8B1F2E]/40 to-transparent" />

        {/* Dates */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
          <div>
            <p className="text-[8px] tracking-[0.3em] uppercase text-[#4A4440] mb-1.5">Check‑in</p>
            <p className="text-[12px] text-[#C4909A] leading-snug">{fmt(res.checkIn)}</p>
          </div>
          <div className="flex flex-col items-center gap-1 px-4">
            <div className="h-px w-5 bg-[#2A2826]" />
            <span className="font-serif text-[10px] text-[#8B1F2E] italic">{n}n</span>
            <div className="h-px w-5 bg-[#2A2826]" />
          </div>
          <div className="text-right">
            <p className="text-[8px] tracking-[0.3em] uppercase text-[#4A4440] mb-1.5">Check‑out</p>
            <p className="text-[12px] text-[#C4909A] leading-snug">{fmt(res.checkOut)}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#1A1816]">
          <div>
            <p className="text-[8px] tracking-[0.2em] uppercase text-[#4A4440] mb-0.5">Celková cena</p>
            <p className="font-serif text-lg text-[#8B1F2E] leading-none">
              {new Intl.NumberFormat('cs-CZ').format(res.totalPrice)} Kč
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onDetail(res)}
              className="text-[9px] tracking-[0.25em] uppercase text-[#8B1F2E] border border-[#8B1F2E]/30 px-3 py-1.5 hover:bg-[#8B1F2E]/10 transition-colors duration-200">
              Detail
            </button>
            <button onClick={() => onDeleteRequest(res.id)}
              className="text-[9px] tracking-[0.25em] uppercase text-[#3A3830] hover:text-red-500/60 px-3 py-1.5 border border-transparent hover:border-red-900/20 transition-colors duration-200">
              Smazat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}