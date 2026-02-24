import { useState } from "react";
import { Plus, Heart } from "lucide-react";
import type { Product } from "../types";
import { formatPrice } from "../utils/format";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onSelect: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: number) => void;
}

export default function ProductCard({ product, onAddToCart, onSelect, isWishlisted, onToggleWishlist }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const outOfStock = product.stock === 0;
  const imageUrl = `https://picsum.photos/seed/${product.id}/400/500`;

  const handleCardClick = () => {
    if (outOfStock) {
      toast.error("This product is currently out of stock");
    }
    onSelect(product);
  };

  return (
    <div
      className="group cursor-pointer animate-fade-up"
      onClick={handleCardClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 aspect-[4/5] mb-4">
        {/* Placeholder shimmer */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
        )}
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out ${
            hovered ? "scale-105" : "scale-100"
          } ${imgLoaded ? "opacity-100" : "opacity-0"}`}
        />

        {/* Wishlist heart */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/70 dark:bg-zinc-950/60 backdrop-blur-sm transition-colors ${
            isWishlisted ? "text-rose-500 hover:text-rose-400" : "text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
          }`}
        >
          <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {outOfStock ? (
          <div className="absolute top-3 left-3 px-2 py-1 bg-white/80 dark:bg-zinc-950/80 text-zinc-500 dark:text-zinc-400 text-[10px] tracking-widest uppercase">
            Sold Out
          </div>
        ) : product.stock <= 3 ? (
          <div className="absolute top-3 left-3 px-2 py-1 bg-white/80 dark:bg-zinc-950/80 text-amber-600 dark:text-amber-400 text-[10px] tracking-widest uppercase">
            Only {product.stock} left
          </div>
        ) : null}

        {!outOfStock && (
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className={`absolute bottom-0 left-0 right-0 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-transform duration-300 ease-out ${
              hovered ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <Plus size={13} strokeWidth={2.5} />
            Add to Bag
          </button>
        )}
      </div>

      <div>
        <p className="text-sm text-zinc-800 dark:text-zinc-200 font-medium leading-snug mb-1 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
          {product.name}
        </p>
        {product.category && (
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 tracking-wider uppercase mb-1">
            {product.category}
          </p>
        )}
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
}
