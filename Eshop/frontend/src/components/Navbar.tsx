import { ShoppingBag } from "lucide-react";

interface NavbarProps {
  cartCount: number;
  onCartOpen: () => void;
}

export default function Navbar({ cartCount, onCartOpen }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur border-b border-zinc-800">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <a href="/" className="text-sm font-semibold tracking-[0.2em] text-zinc-100 uppercase">
            STUDIO
          </a>
          <div className="hidden md:flex items-center gap-7">
            {["New In", "Courses", "About"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs font-medium tracking-wider text-zinc-400 uppercase hover:text-zinc-100 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <button
          onClick={onCartOpen}
          className="flex items-center gap-2 text-xs font-medium tracking-wider text-zinc-400 uppercase hover:text-zinc-100 transition-colors duration-200"
        >
          <ShoppingBag size={16} />
          <span>Bag</span>
          {cartCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-950 text-[10px] font-semibold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
}
