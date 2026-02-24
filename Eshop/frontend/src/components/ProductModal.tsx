import { useState } from "react";
import { X, Heart, ShoppingBag, ShoppingCart, Minus, Plus } from "lucide-react";
import type { Product } from "../types";
import { formatPrice } from "../utils/format";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, qty: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export default function ProductModal({ product, onClose, onAddToCart, onToggleWishlist, isWishlisted }: ProductModalProps) {
  const [qty, setQty] = useState(1);

  if (!product) return null;
  const outOfStock = product.stock === 0;
  const maxQty = product.stock;

  const handleAdd = () => {
    onAddToCart(product, qty);
    setQty(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors z-20">
          <X size={18} />
        </button>

        <div className="flex flex-col sm:flex-row">
          <div className="relative sm:w-72 h-64 sm:h-auto bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 overflow-hidden">
            <img
              src={`https://picsum.photos/seed/${product.id}/288/320`}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            {outOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-xs tracking-[0.3em] uppercase font-semibold">Sold Out</span>
              </div>
            )}
          </div>

          <div className="flex-1 p-8 flex flex-col justify-between">
            <div>
              <p className="text-[10px] tracking-[0.25em] text-zinc-400 dark:text-zinc-500 uppercase mb-3">{product.category}</p>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4 leading-tight">{product.name}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                {product.description || "A curated piece for the modern creative. Crafted with precision and designed to elevate your workflow."}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 tracking-wide mb-1">
                {outOfStock ? "Out of stock" : `${product.stock} in stock`}
              </p>
            </div>

            <div>
              <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-5">{formatPrice(product.price)}</p>

              {!outOfStock && (
                <div className="flex items-center gap-0 mb-4 border border-zinc-200 dark:border-zinc-700 w-fit">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                    className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleAdd}
                  disabled={outOfStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-semibold tracking-[0.15em] uppercase transition-colors duration-200 ${
                    outOfStock
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
                      : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-100"
                  }`}
                >
                  {outOfStock ? <ShoppingBag size={14} /> : <ShoppingCart size={14} />}
                  {outOfStock ? "Unavailable" : `Add ${qty > 1 ? `${qty} ` : ""}to Bag`}
                </button>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`w-12 h-12 flex items-center justify-center border transition-colors duration-200 ${
                    isWishlisted
                      ? "border-red-300 dark:border-red-700 text-red-500 dark:text-red-400"
                      : "border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-red-500 hover:border-red-200 dark:hover:border-red-700"
                  }`}
                >
                  <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
