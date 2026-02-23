import type { Product } from "../types";

interface Props {
  product: Product;
  onAddToCart: (p: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: Props) => {
  const inStock = product.stock > 0;

  return (
    <div className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-3 hover:border-zinc-600 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.06)] transition-all duration-300 cursor-default">
      {/* Top row: category + stock badge */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
          {product.category}
        </span>
        {inStock ? (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
            In Stock
          </span>
        ) : (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">
            Sold Out
          </span>
        )}
      </div>

      {/* Product name */}
      <h2 className="text-base font-bold text-zinc-100 leading-snug group-hover:text-white transition-colors duration-200">
        {product.name}
      </h2>

      {/* Description */}
      <p className="text-sm text-zinc-500 line-clamp-3 leading-relaxed grow">{product.description}</p>

      {/* Price + button */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
        <span className="text-xl font-bold text-zinc-100">
          {product.price}{" "}
          <span className="text-sm font-medium text-zinc-500">CZK</span>
        </span>
        <button
          disabled={!inStock}
          onClick={() => onAddToCart(product)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 ${
            inStock
              ? "bg-white text-zinc-900 hover:bg-zinc-200 cursor-pointer"
              : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
          }`}
        >
          {inStock ? "Add to Cart" : "Sold Out"}
        </button>
      </div>
    </div>
  );
};