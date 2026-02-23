interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

export default function Navbar({ cartCount, onCartClick }: NavbarProps) {
  return (
    <nav className="bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50 animate-slide-down">
      <div className="max-w-6xl mx-auto px-8 h-16 flex justify-between items-center">
        {/* Logo */}
        <span className="text-sm font-bold tracking-[0.25em] uppercase text-white">
          CourseHub
        </span>

        {/* Cart button */}
        <button
          onClick={onCartClick}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 text-sm font-medium text-zinc-300 hover:border-zinc-400 hover:text-white hover:bg-zinc-800 transition-all duration-200 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.867-7.17a48.248 48.248 0 00-3.878-.512M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          Cart
          {cartCount > 0 && (
            <span className="bg-white text-zinc-900 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse-dot">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}