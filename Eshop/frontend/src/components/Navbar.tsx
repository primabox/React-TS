interface NavbarProps {
  cartCount: number; // Tímto říkáme Navbaru, že dostane číslo
}

export default function Navbar({ cartCount }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-black text-black">COURSEHUB</div>
        <div className="relative">
          <span className="text-2xl">🛒</span>
          {/* Tady se zobrazuje to číslo z App.tsx */}
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {cartCount}
          </span>
        </div>
      </div>
    </nav>
  );
}