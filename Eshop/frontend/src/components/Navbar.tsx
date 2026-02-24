import { useState } from "react";
import { ShoppingBag, Sun, Moon, User, LogOut, Menu, X, Package } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface NavbarProps {
  cartCount: number;
  onCartOpen: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
  onAuthOpen: (tab?: "login" | "register") => void;
  onNavClick: (section: string) => void;
  activeSection: string;
  onOrdersOpen: () => void;
}

const NAV_LINKS = [
  { label: "New In", section: "all" },
  { label: "Courses", section: "courses" },
  { label: "About", section: "about" },
];

export default function Navbar({
  cartCount, onCartOpen, isDark, onThemeToggle, onAuthOpen, onNavClick, activeSection, onOrdersOpen,
}: NavbarProps) {
  const { user, logout } = useAuth();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setConfirmLogout(false);
    setMobileOpen(false);
  };

  const handleNav = (section: string) => {
    onNavClick(section);
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      {/* Main bar */}
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <a href="/" className="text-sm font-semibold tracking-[0.2em] text-zinc-900 dark:text-zinc-100 uppercase">
            STUDIO
          </a>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ label, section }) => (
              <button
                key={label}
                onClick={() => handleNav(section)}
                className={`text-xs font-medium tracking-wider uppercase transition-colors duration-200 ${
                  activeSection === section
                    ? "text-zinc-900 dark:text-zinc-100 border-b border-zinc-900 dark:border-zinc-100 pb-0.5"
                    : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={onThemeToggle}
            className="w-8 h-8 flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Auth  desktop */}
          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={onOrdersOpen}
                  className="w-8 h-8 flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                  title="My orders"
                >
                  <Package size={15} />
                </button>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 tracking-wide">{user.username}</span>
                {confirmLogout ? (
                  <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-2 py-1">
                    <span className="text-[11px] text-zinc-500">Log out?</span>
                    <button onClick={handleLogout} className="text-[11px] text-red-500 font-medium hover:text-red-600">Yes</button>
                    <button onClick={() => setConfirmLogout(false)} className="text-[11px] text-zinc-400 hover:text-zinc-600">No</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmLogout(true)}
                    className="w-8 h-8 flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                    title="Log out"
                  >
                    <LogOut size={15} />
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => onAuthOpen("login")}
                className="w-8 h-8 flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                title="Sign in"
              >
                <User size={15} />
              </button>
            )}
          </div>

          {/* Bag */}
          <button
            onClick={onCartOpen}
            className="flex items-center gap-2 text-xs font-medium tracking-wider text-zinc-500 dark:text-zinc-400 uppercase hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-200"
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Bag</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-[10px] font-semibold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden w-8 h-8 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 px-6 py-5 flex flex-col gap-5">
          {NAV_LINKS.map(({ label, section }) => (
            <button
              key={label}
              onClick={() => handleNav(section)}
              className={`text-left text-xs font-medium tracking-wider uppercase transition-colors ${
                activeSection === section
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-400 dark:text-zinc-500"
              }`}
            >
              {label}
            </button>
          ))}
          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex flex-col gap-4">
            {user ? (
              <>
                <button
                  onClick={() => { onOrdersOpen(); setMobileOpen(false); }}
                  className="text-left text-xs font-medium tracking-wider uppercase text-zinc-400 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors flex items-center gap-2"
                >
                  <Package size={13} /> My Orders
                </button>
                <button
                  onClick={handleLogout}
                  className="text-left text-xs font-medium tracking-wider uppercase text-red-400 hover:text-red-500 transition-colors flex items-center gap-2"
                >
                  <LogOut size={13} /> Log Out ({user.username})
                </button>
              </>
            ) : (
              <button
                onClick={() => { onAuthOpen("login"); setMobileOpen(false); }}
                className="text-left text-xs font-medium tracking-wider uppercase text-zinc-400 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors flex items-center gap-2"
              >
                <User size={13} /> Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
