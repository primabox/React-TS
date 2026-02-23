import { useState } from "react";
import type { Product } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Product[];
  onRemoveItem: (index: number) => void;
  onCheckout: (email: string) => Promise<boolean>; // Prop for the hook function
}

export default function CartSidebar({ isOpen, onClose, cartItems, onRemoveItem, onCheckout }: Props) {
  const [email, setEmail] = useState(""); // Holds the user's email

  // Calculating total sum
  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

  // Triggered when clicking the button
  const handleCheckoutClick = async () => {
    if (!email.includes("@")) {
      alert("Please enter a valid email address! 📧");
      return;
    }

    const success = await onCheckout(email);
    
    if (success) {
      setEmail(""); // Reset field on success
      onClose();    // Hide sidebar
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-95 bg-zinc-900 border-l border-zinc-800 z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-6 h-16 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <h2 className="text-sm font-bold tracking-widest uppercase text-zinc-100">Your Cart</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items list */}
        <div className="grow overflow-y-auto px-6 py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.867-7.17a48.248 48.248 0 00-3.878-.512M7.5 14.25L5.106 5.272" />
              </svg>
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {cartItems.map((item, index) => (
                <li
                  key={index}
                  className="animate-fade-up flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800 transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-100 truncate">{item.name}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{item.price} CZK</p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(index)}
                    className="ml-4 w-7 h-7 flex items-center justify-center rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer shrink-0"
                    title="Remove"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer with Checkout logic */}
        <div className="px-6 py-5 border-t border-zinc-800 shrink-0">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-zinc-500">Total</span>
            <span className="text-lg font-bold text-zinc-100">
              {total.toFixed(2)}{" "}
              <span className="text-sm font-medium text-zinc-500">CZK</span>
            </span>
          </div>

          {/* New Email Input */}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Enter your email to buy"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors shadow-inner"
            />
          </div>

          <button 
            onClick={handleCheckoutClick}
            disabled={cartItems.length === 0}
            className="w-full bg-white text-zinc-900 py-3 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-colors active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Complete Order
          </button>
        </div>
      </div>
    </>
  );
}