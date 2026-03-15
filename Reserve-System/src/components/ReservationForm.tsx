import { useState } from 'react';
import type { Reservation } from '../types/reservation';

const ROOM_TYPES = [
  { value: 'Standard',  label: 'Standard Room',   price: 4500  },
  { value: 'Deluxe',    label: 'Deluxe Room',     price: 7500  },
  { value: 'Suite',     label: 'Grand Suite',     price: 15000 },
  { value: 'Family',    label: 'Family Suite',    price: 10000 },
  { value: 'Executive', label: 'Executive Suite', price: 22000 },
];

const INPUT = 'w-full bg-[#0A0A0B] border border-[#2A2826] text-[#FAFAF8] text-[13px] px-4 py-3.5 placeholder:text-[#2A2826] focus:outline-none focus:border-[#8B1F2E] focus:ring-0 transition-colors duration-300 appearance-none';

function GuestCounter({
  label, sub, value, min, onChange,
}: { label: string; sub: string; value: number; min: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between py-4">
      <div>
        <p className="text-[13px] text-[#FAFAF8]">{label}</p>
        <p className="text-[11px] text-[#4A4440] mt-0.5">{sub}</p>
      </div>
      <div className="flex items-center gap-5">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}
          className="w-8 h-8 border border-[#2A2826] text-[#8A8070] hover:border-[#8B1F2E] hover:text-[#8B1F2E] disabled:opacity-20 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center leading-none select-none">
          −
        </button>
        <span className="text-sm text-[#FAFAF8] w-4 text-center tabular-nums">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(12, value + 1))}
          className="w-8 h-8 border border-[#2A2826] text-[#8A8070] hover:border-[#8B1F2E] hover:text-[#8B1F2E] transition-colors duration-200 flex items-center justify-center leading-none select-none">
          +
        </button>
      </div>
    </div>
  );
}

interface Props { onSave: (r: Reservation) => void; }

export function ReservationForm({ onSave }: Props) {
  const [name, setName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState('Standard');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [specialRequests, setSpecialRequests] = useState('');
  const [error, setError] = useState('');

  const nights =
    checkIn && checkOut
      ? Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
      : 0;
  const room = ROOM_TYPES.find((r) => r.value === roomType) ?? ROOM_TYPES[0];
  const totalPrice = room.price * nights;

  const handleSubmit = () => {
    if (!name.trim())  { setError('Zadejte prosím jméno hlavního hosta.'); return; }
    if (!checkIn)      { setError('Zvolte datum příjezdu.'); return; }
    if (!checkOut)     { setError('Zvolte datum odjezdu.'); return; }
    if (nights <= 0)   { setError('Datum odjezdu musí být po datu příjezdu.'); return; }
    setError('');
    onSave({
      id: Date.now().toString(),
      customerName: name, place: room.label, roomType, roomNumber,
      checkIn, checkOut, adults, children,
      pricePerNight: room.price, totalPrice, specialRequests,
      createdAt: new Date().toISOString(),
    });
    setName(''); setRoomNumber(''); setCheckIn(''); setCheckOut('');
    setAdults(2); setChildren(0); setSpecialRequests(''); setRoomType('Standard');
  };

  return (
    <div className="border border-[#1A1816] bg-[#0E0E10]">
      <div className="h-px bg-linear-to-r from-transparent via-[#8B1F2E] to-transparent" />

      <div className="p-8 flex flex-col gap-7">

        {/* Row 1: 4 basic fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col gap-2.5 lg:col-span-2">
            <label className="text-[9px] tracking-[0.35em] uppercase text-[#8B1F2E]">Hlavní host</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Jméno a příjmení" className={INPUT} />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="text-[9px] tracking-[0.35em] uppercase text-[#8B1F2E]">Datum příjezdu</label>
            <input type="date" value={checkIn}
              onChange={(e) => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut(''); }}
              className={INPUT} />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="text-[9px] tracking-[0.35em] uppercase text-[#8B1F2E]">Datum odjezdu</label>
            <input type="date" value={checkOut} min={checkIn || undefined}
              onChange={(e) => setCheckOut(e.target.value)} className={INPUT} />
          </div>
        </div>

        {/* Row 2: Room type visual selector */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[9px] tracking-[0.35em] uppercase text-[#8B1F2E]">Typ pokoje &amp; cena za noc</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {ROOM_TYPES.map((r) => (
              <button key={r.value} type="button" onClick={() => setRoomType(r.value)}
                className={`border p-4 text-left transition-all duration-200 ${
                  roomType === r.value
                    ? 'border-[#8B1F2E] bg-[#8B1F2E]/8'
                    : 'border-[#2A2826] hover:border-[#8B1F2E]/30 bg-transparent'
                }`}
              >
                <p className={`text-[8px] tracking-[0.25em] uppercase mb-1.5 ${
                  roomType === r.value ? 'text-[#8B1F2E]' : 'text-[#3A3830]'
                }`}>{r.value}</p>
                <p className={`text-[11px] leading-snug ${
                  roomType === r.value ? 'text-[#C4909A]' : 'text-[#5A5447]'
                }`}>{r.label}</p>
                <p className={`font-serif text-base mt-2 ${
                  roomType === r.value ? 'text-[#8B1F2E]' : 'text-[#2A2826]'
                }`}>
                  {new Intl.NumberFormat('cs-CZ').format(r.price)} Kč
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Guests + Room number + Special requests + Summary + Button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Guests */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[9px] tracking-[0.35em] uppercase text-[#8B1F2E]">Hosté</label>
            <div className="border border-[#2A2826] bg-[#0A0A0B] px-5 divide-y divide-[#1A1816] h-full">
              <GuestCounter label="Dospělí" sub="Věk 18 a více" value={adults} min={1} onChange={setAdults} />
              <GuestCounter label="Děti" sub="Věk 0 – 17" value={children} min={0} onChange={setChildren} />
            </div>
          </div>

          {/* Special requests + Room number */}
          <div className="flex flex-col gap-3 lg:col-span-2">
            <div className="flex flex-col gap-2.5">
              <label className="text-[9px] tracking-[0.35em] uppercase text-[#8B1F2E]">Číslo pokoje <span className="text-[#3A3830]">(volitelné)</span></label>
              <input type="text" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="např. 301, Suite A, Penthouse..." className={INPUT} />
            </div>
            <div className="flex flex-col gap-2.5 flex-1">
              <label className="text-[9px] tracking-[0.35em] uppercase text-[#8B1F2E]">Speciální požadavky</label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Alergeny, pozdní check-in, preference etage, výročí…"
                rows={3}
                className={`${INPUT} resize-none`}
              />
            </div>
          </div>

          {/* Summary + Button */}
          <div className="flex flex-col gap-3">
            <label className="text-[9px] tracking-[0.35em] uppercase text-[#8B1F2E]">Souhrn ceny</label>
            <div className="border border-[#2A2826] bg-[#0A0A0B] px-5 py-4 flex flex-col gap-3">
              <div className="flex justify-between items-baseline">
                <span className="text-[9px] tracking-[0.2em] uppercase text-[#4A4440]">Nocí</span>
                <span className="font-serif text-2xl text-[#FAFAF8] leading-none">{nights > 0 ? nights : '—'}</span>
              </div>
              <div className="h-px bg-[#1A1816]" />
              <div className="flex justify-between items-baseline">
                <span className="text-[9px] tracking-[0.2em] uppercase text-[#4A4440]">Cena/noc</span>
                <span className="text-[12px] text-[#C4909A]">
                  {new Intl.NumberFormat('cs-CZ').format(room.price)} Kč
                </span>
              </div>
              <div className="h-px bg-[#1A1816]" />
              <div className="flex justify-between items-baseline">
                <span className="text-[9px] tracking-[0.2em] uppercase text-[#4A4440]">Celkem</span>
                <span className={`font-serif text-2xl leading-none ${
                  totalPrice > 0 ? 'text-[#8B1F2E]' : 'text-[#2A2826]'
                }`}>
                  {totalPrice > 0 ? new Intl.NumberFormat('cs-CZ').format(totalPrice) + ' Kč' : '—'}
                </span>
              </div>
            </div>
            <button type="button" onClick={handleSubmit}
              className="flex-1 bg-[#8B1F2E] hover:bg-[#9E2435] active:bg-[#6A1520] text-[#FAFAF8] text-[9px] tracking-[0.4em] uppercase font-semibold py-4 transition-colors duration-300">
              Rezervovat
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-8 mb-8 flex items-center gap-3 border border-[#5A1A1A]/50 bg-[#1A0A0A] text-red-400/80 text-[11px] tracking-wide px-5 py-3">
          <span className="text-red-600/60">—</span>
          <span>{error}</span>
        </div>
      )}

      <div className="h-px bg-linear-to-r from-transparent via-[#8B1F2E]/25 to-transparent" />
    </div>
  );
}