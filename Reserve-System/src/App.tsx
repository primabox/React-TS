import { useEffect, useState } from 'react';
import type { Reservation } from './types/reservation';


function App() {
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const [date, setDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('moje-rezervace');
    return saved ? JSON.parse(saved) : [{
      id: '1',
      customerName: 'Roman',
      dateTime: '2026-03-15T18:00:00',
      place: 'Table by the window',
      adults: 2,
      children: 0

    }
    ];
  });

  useEffect(() => {
    localStorage.setItem('moje-rezervace', JSON.stringify(reservations));
  }, [reservations]);


  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 gap-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-xl font-bold text-slate-800">Nová rezervace</h2>

        <input
          type="text"
          placeholder="Jméno hosta"
          value={name}
          onChange={(e) => setName(e.target.value)} // Syncs input field with 'name' state on every change
          className="border border-slate-200 p-2 rounded-lg outline-sky-500 text-slate-800"
        />

        <input
          type="text"
          placeholder="Místo (např. Bar)"
          value={place}
          onChange={(e) => setPlace(e.target.value)} // Syncs input field with 'place' state on every change
          className="border border-slate-200 p-2 rounded-lg outline-sky-500 text-slate-800"
        />

        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)} // Syncs input field with 'date' state on every change
          className="border border-slate-200 p-2 rounded-lg outline-sky-500 text-slate-800"
        />

        <div className="grid grid-cols-2 divide-x divide-slate-100 border border-slate-200 rounded-2xl bg-slate-50/50 overflow-hidden shadow-sm">

          {/* Sekce DOSPĚLÍ */}
          <div className="p-4 flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dospělí</label>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all active:scale-90 shadow-sm"
              >
                −
              </button>
              <span className="font-bold text-slate-800 text-lg">{adults}</span>
              <button
                onClick={() => setAdults(adults + 1)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all active:scale-90 shadow-sm"
              >
                +
              </button>
            </div>
          </div>
   
          <div className="p-4 flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Děti</label>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all active:scale-90 shadow-sm"
              >
                −
              </button>
              <span className="font-bold text-slate-800 text-lg">{children}</span>
              <button
                onClick={() => setChildren(children + 1)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all active:scale-90 shadow-sm"
              >
                +
              </button>
            </div>
          </div>

        </div>

        <button
          disabled={!name.trim()}
          onClick={() => {

            if (!name.trim()) return; // If name is empty, stop the function and don't create reservation

            const newRes: Reservation = {  // Handles the creation of a new reservation and resets the form state
              id: Date.now().toString(),
              customerName: name,
              place: place,
              dateTime: date || new Date().toISOString(),
              // dateTime: new Date().toISOString(),
              adults: adults,
              children: children
            };

            setReservations([...reservations, newRes]);

            setName('');
            setPlace('');
          }}
          className="bg-sky-500 text-white font-bold py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Uložit rezervaci
        </button>
      </div>



      {reservations.map((res) => (
        <div key={res.id} className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
          <h1 className="text-2xl font-bold text-slate-800">
            {res.customerName}
          </h1>
          <p className="text-slate-500">Místo: {res.place}</p>
          { }

          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className="text-slate-400 text-sm">
              {new Date(res.dateTime).toLocaleString('cs-CZ', {
                dateStyle: 'short',
                timeStyle: 'short'
              })}
            </span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
              {res.adults + res.children} os.
            </span>
          </div>

          <button
            onClick={() => {
              setReservations(reservations.filter(item => item.id !== res.id));
            }}
            className="mt-4 w-full text-red-500 hover:bg-red-50 py-2 rounded-xl transition-colors text-sm font-semibold"
          >
            Odstranit rezervaci
          </button>

        </div>
      ))}
    </div>
  )
}

export default App