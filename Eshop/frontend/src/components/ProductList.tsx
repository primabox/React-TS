import type { Product } from "../types";
import { ProductCard } from "./ProductCard";

interface Props {
  products: Product[];
  onAddToCart: (product: Product) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export default function ProductList({ products, onAddToCart, searchQuery, onSearchChange, categories, selectedCategory, onCategoryChange }: Props) {
 return (
    <main className="flex-grow p-10">
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-8">
          My Modern E-shop 🚀
        </h1>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* This is your Search Bar */}
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)} // Updates the state in App.tsx
            className="w-full px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
          <span className="absolute right-4 top-3 opacity-50">🔍</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.length > 0 ? (
          products.map((item) => (
            <div key={item.id} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 transition-transform hover:scale-105">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-900/30 px-3 py-1 rounded-full">
                {item.category}
              </span>
              <h2 className="text-2xl font-bold text-white mt-4">{item.name}</h2>
              
              <div className="mt-2">
                {item.stock > 0 ? (
                  <p className="text-sm text-green-400 italic">In Stock: {item.stock} pcs</p>
                ) : (
                  <p className="text-sm text-red-500 font-bold underline">Sold Out</p>
                )}
              </div>

              <p className="text-zinc-400 mt-2 line-clamp-3">{item.description}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-2xl font-black text-white">{item.price} CZK</span>
                <button
                  disabled={item.stock === 0}
                  onClick={() => onAddToCart(item)}
                  className={`px-5 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                    item.stock > 0 ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  {item.stock > 0 ? 'Buy Now' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))
        ) : (
          /* Show this when no products match the search */
          <div className="col-span-full text-center py-20">
            <p className="text-zinc-500 text-xl italic">No products found... 😢</p>
          </div>
        )}
      </div>
    </main>
  );
}