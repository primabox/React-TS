import { useEffect, useState } from 'react';
import type { Reservation } from './types/reservation';
import { ReservationForm } from './components/ReservationForm';
import { ReservationCard } from './components/ReservationCard';
import { ReservationModal } from './components/ReservationModal';
import { ConfirmModal } from './components/ConfirmModal';
import { Toast } from './components/Toast';

type Filter = 'all' | 'upcoming' | 'completed';
type SortBy  = 'date' | 'name' | 'price';

function App() {
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('rezervace-v3');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('rezervace-v3', JSON.stringify(reservations));
  }, [reservations]);

  const [filter,          setFilter]          = useState<Filter>('all');
  const [sortBy,          setSortBy]          = useState<SortBy>('date');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [detailRes,       setDetailRes]       = useState<Reservation | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; key: number } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') =>
    setToast({ message, type, key: Date.now() });

  const addReservation = (r: Reservation) => {
    setReservations((p) => [...p, r]);
    showToast('Rezervace byla úspěšně přidána');
  };

  const handleDeleteRequest = (id: string) => setConfirmDeleteId(id);
  const handleDeleteConfirm = () => {
    if (!confirmDeleteId) return;
    setReservations((p) => p.filter((r) => r.id !== confirmDeleteId));
    setConfirmDeleteId(null);
    if (detailRes?.id === confirmDeleteId) setDetailRes(null);
    showToast('Rezervace byla smazána', 'error');
  };

  const totalGuests  = reservations.reduce((s, r) => s + r.adults + r.children, 0);
  const upcomingCnt  = reservations.filter((r) => new Date(r.checkIn) >= new Date()).length;
  const totalRevenue = reservations.reduce((s, r) => s + r.totalPrice, 0);

  const filtered = reservations
    .filter((r) => {
      if (filter === 'upcoming')  return new Date(r.checkIn) >= new Date();
      if (filter === 'completed') return new Date(r.checkIn) <  new Date();
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name')  return a.customerName.localeCompare(b.customerName, 'cs');
      if (sortBy === 'price') return b.totalPrice - a.totalPrice;
      return new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime();
    });

  const upcomingFiltered  = reservations.filter((r) => new Date(r.checkIn) >= new Date()).length;
  const completedFiltered = reservations.filter((r) => new Date(r.checkIn) <  new Date()).length;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#FAFAF8]">

      {/* ═══ HEADER ═══ */}
      <header className="border-b border-[#1A1816] bg-[#0A0A0B]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 grid grid-cols-3 items-center">
          <div>
            {reservations.length > 0 && (
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#8B1F2E] border border-[#8B1F2E]/30 px-3 py-1.5">
                {reservations.length} {reservations.length === 1 ? 'Pobyt' : 'Pobytů'}
              </span>
            )}
          </div>
          <div className="text-center">
            <p className="font-serif text-[20px] tracking-[0.35em] uppercase text-[#FAFAF8]">Grand Séjour</p>
            <p className="text-[8px] tracking-[0.4em] uppercase text-[#8B1F2E] mt-0.5">Luxury Reservations</p>
          </div>
          <nav className="hidden md:flex items-center justify-end gap-8 text-[10px] tracking-[0.18em] uppercase text-[#6B6055]">
            <a href="#form" className="hover:text-[#8B1F2E] transition-colors duration-300">Rezervovat</a>
            <a href="#reservations" className="hover:text-[#8B1F2E] transition-colors duration-300">Moje pobyty</a>
          </nav>
        </div>
      </header>

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden min-h-150 flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1800&q=80"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#0A0A0B]/60 via-[#0A0A0B]/40 to-[#0A0A0B]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-24 md:py-32 text-center w-full">
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#8B1F2E] mb-8">
            ✦ &ensp; Exkluzivní ubytování &ensp; ✦
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] text-[#FAFAF8] mb-6">
            Umění pobytu.<br />
            <em className="text-[#8B1F2E] not-italic">Přepych klidu.</em>
          </h1>
          <div className="flex justify-center items-center gap-4 my-10">
            <div className="h-px w-20 bg-linear-to-r from-transparent to-[#8B1F2E]/60" />
            <span className="text-[#8B1F2E] text-sm">✦</span>
            <div className="h-px w-20 bg-linear-to-l from-transparent to-[#8B1F2E]/60" />
          </div>
          <p className="text-[#8A8070] text-sm md:text-base leading-loose max-w-md mx-auto mb-16">
            Spravujte vaše pobyty s elegancí.<br />Každá rezervace zasluhuje péči.
          </p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20">
            {[
              { value: reservations.length, label: 'Rezervací'       },
              { value: upcomingCnt,         label: 'Nadcházejících'  },
              { value: totalGuests,         label: 'Hostů'           },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-serif text-4xl md:text-5xl text-[#8B1F2E] leading-none">{value}</div>
                <div className="text-[9px] tracking-[0.3em] uppercase text-[#6B6055] mt-2">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gold divider */}
      <div className="flex items-center max-w-7xl mx-auto px-8">
        <div className="flex-1 h-px bg-linear-to-r from-transparent to-[#8B1F2E]/40" />
        <span className="text-[#8B1F2E]/50 text-xs px-5">✦</span>
        <div className="flex-1 h-px bg-linear-to-l from-transparent to-[#8B1F2E]/40" />
      </div>

      {/* ═══ FORM ═══ */}
      <section id="form" className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-[9px] tracking-[0.45em] uppercase text-[#8B1F2E] mb-4">Nová rezervace</p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#FAFAF8]">Rezervovat váš pobyt</h2>
        </div>
        <ReservationForm onSave={addReservation} />
      </section>

      {/* ═══ RESERVATIONS ═══ */}
      {reservations.length > 0 ? (
        <section id="reservations" className="max-w-7xl mx-auto px-8 pb-28">

          {/* Section header */}
          <div className="flex flex-wrap items-end gap-6 mb-8">
            <div>
              <p className="text-[9px] tracking-[0.45em] uppercase text-[#8B1F2E] mb-1.5">Vaše pobyty</p>
              <h2 className="font-serif text-4xl text-[#FAFAF8]">Moje rezervace</h2>
            </div>
            <div className="flex-1 h-px bg-[#1A1816] mb-2" />
            {totalRevenue > 0 && (
              <div className="text-right mb-1">
                <p className="text-[8px] tracking-[0.2em] uppercase text-[#4A4440]">Celkové výdaje</p>
                <p className="font-serif text-lg text-[#8B1F2E] mt-0.5 leading-none">
                  {new Intl.NumberFormat('cs-CZ').format(totalRevenue)} Kč
                </p>
              </div>
            )}
          </div>

          {/* Filter + Sort bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            <div className="flex">
              {([
                { key: 'all',       label: 'Vše',           count: reservations.length   },
                { key: 'upcoming',  label: 'Nadcházející',  count: upcomingFiltered       },
                { key: 'completed', label: 'Proběhlé',      count: completedFiltered      },
              ] as const).map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-5 py-2.5 text-[9px] tracking-[0.2em] uppercase border-t border-b first:border-l last:border-r transition-all duration-200 ${
                    filter === key
                      ? 'bg-[#8B1F2E] text-[#FAFAF8] border-[#8B1F2E] font-semibold'
                      : 'text-[#6B6055] border-[#2A2826] hover:text-[#8B1F2E] hover:border-[#8B1F2E]/30'
                  }`}
                >
                  {label}
                  <span className={`ml-2 text-[8px] ${filter === key ? 'opacity-50' : 'text-[#3A3830]'}`}>
                    ({count})
                  </span>
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="bg-[#0A0A0B] border border-[#2A2826] text-[#6B6055] text-[9px] tracking-[0.2em] uppercase px-4 py-2.5 focus:outline-none focus:border-[#8B1F2E]/40 appearance-none cursor-pointer"
            >
              <option value="date">Řadit: Datum</option>
              <option value="name">Řadit: Jméno</option>
              <option value="price">Řadit: Cena</option>
            </select>
          </div>

          {/* Cards grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((res) => (
                <ReservationCard
                  key={res.id}
                  res={res}
                  onDetail={setDetailRes}
                  onDeleteRequest={handleDeleteRequest}
                />
              ))}
            </div>
          ) : (
            <div className="border border-[#1A1816] py-16 text-center">
              <p className="text-[#5A5447] font-serif text-lg">Žádné rezervace v tomto filtru</p>
            </div>
          )}
        </section>
      ) : (
        <section className="max-w-7xl mx-auto px-8 pb-28">
          <div className="border border-[#1A1816] py-24 text-center">
            <p className="text-[#8B1F2E] text-[10px] tracking-[0.4em] uppercase mb-5">✦ &ensp; Zanechte první stopu &ensp; ✦</p>
            <h3 className="font-serif text-2xl text-[#5A5447] mb-3">Žádné rezervace zatím</h3>
            <p className="text-[#3A3830] text-sm tracking-wide">Vyplňte formulář výše a zahajte váš první luxusní pobyt.</p>
          </div>
        </section>
      )}

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-[#1A1816]">
        <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            <p className="font-serif text-sm tracking-[0.25em] uppercase text-[#8B1F2E]">Grand Séjour</p>
            <p className="text-[9px] tracking-[0.3em] uppercase text-[#3A3830] mt-0.5">Luxury Hotel Reservations</p>
          </div>
          <p className="text-[9px] tracking-[0.25em] uppercase text-[#3A3830]">© 2026 · All rights reserved</p>
        </div>
      </footer>

      {/* ═══ OVERLAYS ═══ */}
      {detailRes && (
        <ReservationModal
          res={detailRes}
          onClose={() => setDetailRes(null)}
          onDeleteRequest={handleDeleteRequest}
        />
      )}
      {confirmDeleteId && (
        <ConfirmModal
          title="Smazat rezervaci"
          message="Tato akce je nevratná. Rezervace bude trvale odstraněna ze systému."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}

export default App;