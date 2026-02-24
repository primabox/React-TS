import { useState } from "react";
import { Plus } from "lucide-react";
import type { Product } from "../types";
import { formatPrice } from "../utils/format";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const outOfStock = product.stock === 0;

  return (
    <div
      className="group cursor-pointer animate-fade-up"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden bg-zinc-800 aspect-[4/5] mb-4">
        <div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-xs tracking-widest uppercase">
          No Image
        </div>

        {outOfStock ? (
          <div className="absolute top-3 left-3 px-2 py-1 bg-zinc-950/80 text-zinc-400 text-[10px] tracking-widest uppercase">
            Sold Out
          </div>
        ) : product.stock <= 3 ? (
          <div className="absolute top-3 left-3 px-2 py-1 bg-zinc-950/80 text-amber-400 text-[10px] tracking-widest uppercase">
            Only {product.stock} left
          </div>
        ) : null}

        {!outOfStock && (
          <button
            onClick={() => onAddToCart(product)}
            className={`absolute bottom-0 left-0 right-0 py-3 bg-white text-zinc-900 text-xs font-semibold tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-transform duration-300 ease-out ${
              hovered ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <Plus size={13} strokeWidth={2.5} />
            Add to Bag
          </button>
        )}
      </div>

      <div>
        <p className="text-sm text-zinc-200 font-medium leading-snug mb-1 group-hover:text-white transition-colors">
          {product.name}
        </p>
        {product.category && (
          <p className="text-[11px] text-zinc-500 tracking-wider uppercase mb-1">
            {product.category}
          </p>
        )}
        <p className="text-sm text-zinc-400">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
}
