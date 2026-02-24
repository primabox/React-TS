export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-zinc-100 uppercase mb-4">STUDIO</p>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px]">
            Curated products for the intentional lifestyle.
          </p>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.25em] text-zinc-600 uppercase mb-4">Navigate</p>
          <ul className="space-y-2">
            {["New In", "Courses", "About", "Contact"].map((item) => (
              <li key={item}>
                <a href="#" className="text-xs text-zinc-500 hover:text-zinc-200 tracking-wide transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.25em] text-zinc-600 uppercase mb-4">Support</p>
          <ul className="space-y-2">
            {["FAQ", "Shipping", "Returns", "Privacy Policy"].map((item) => (
              <li key={item}>
                <a href="#" className="text-xs text-zinc-500 hover:text-zinc-200 tracking-wide transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-800 px-6 py-5 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-[11px] text-zinc-700 tracking-wide">
          &copy; {new Date().getFullYear()} Studio. All rights reserved.
        </p>
        <p className="text-[11px] text-zinc-700 tracking-wide italic font-serif">
          Made with intention.
        </p>
      </div>
    </footer>
  );
}
