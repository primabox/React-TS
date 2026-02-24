import { useState } from "react";
import { X, Minus, Plus, Trash2, LogIn } from "lucide-react";
import type { CartItem } from "../hooks/useCart";
import { formatPrice } from "../utils/format";
import { useAuth } from "../contexts/AuthContext";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: number) => void;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onCheckout: (email: string) => Promise<boolean>;
  onAuthOpen: (tab?: "login" | "register") => void;
}

export default function CartSidebar({
  isOpen, onClose, cart, onRemove, onIncrease, onDecrease, onCheckout, onAuthOpen,
}: CartSidebarProps) {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const handleCheckout = async () => {
    const checkoutEmail = user?.email || email;
    const ok = await onCheckout(checkoutEmail);
    if (ok) setEmail("");
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      )}

      <aside className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 z-50 flex flex-col transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-zinc-700 dark:text-zinc-300 uppercase">
            Your Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <p className="font-serif italic text-2xl text-zinc-300 dark:text-zinc-600 mb-2">Your bag is empty</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-600 tracking-wide">Add something beautiful.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 py-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                <div className="w-16 h-20 bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 overflow-hidden">
                  <img src={`https://picsum.photos/seed/${item.id}/64/80`} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-snug mb-1 truncate">{item.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-3">{formatPrice(item.price)}</p>
                  <div className="flex items-center gap-3">
                    <button onClick={() => onDecrease(item.id)}
                      className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors">
                      <Minus size={11} />
                    </button>
                    <span className="text-xs text-zinc-700 dark:text-zinc-300 w-4 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => onIncrease(item.id)}
                      className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors">
                      <Plus size={11} />
                    </button>
                    <button onClick={() => onRemove(item.id)} className="ml-auto text-zinc-300 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="px-6 py-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs tracking-wider text-zinc-500 uppercase">Total</span>
              <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{formatPrice(total)}</span>
            </div>

            {user ? (
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                Ordering as <span className="text-zinc-700 dark:text-zinc-300 font-medium">{user.email || user.username}</span>
              </p>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="Email for order confirmation"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-2 text-xs text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 dark:focus:border-zinc-400 tracking-wide transition-colors"
                />
                <button onClick={() => onAuthOpen("login")}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs text-zinc-500 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors border border-zinc-200 dark:border-zinc-700">
                  <LogIn size={13} />
                  Sign in for faster checkout
                </button>
              </>
            )}

            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors duration-200"
            >
              Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
