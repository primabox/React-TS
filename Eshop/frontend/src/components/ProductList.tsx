import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import type { Product } from "../types";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  onAddToCart: (product: Product) => void;
}

export default function ProductList({ products, isLoading, onAddToCart }: ProductListProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    return ["All", ...cats];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, search]);

  return (
    <main className="min-h-screen bg-zinc-950">
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end mb-20">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-zinc-500 uppercase mb-4">
              Current Collection
            </p>
            <h1 className="text-5xl md:text-6xl font-serif italic font-light text-zinc-100 leading-[1.1]">
              Crafted for<br />the curious
            </h1>
          </div>
          <div className="md:text-right">
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs md:ml-auto">
              Thoughtfully designed pieces for those who value quality and intention in every choice.
            </p>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-8 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-1 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs tracking-wider uppercase transition-colors duration-200 ${
                  activeCategory === cat
                    ? "bg-zinc-100 text-zinc-900 font-semibold"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-4 py-2 bg-transparent border-b border-zinc-700 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 w-52 tracking-wide transition-colors"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            {products.length === 0 ? (
              <>
                <p className="text-4xl font-serif italic text-zinc-700 mb-3">No products yet</p>
                <p className="text-sm text-zinc-600">Check back soon.</p>
              </>
            ) : (
              <>
                <p className="text-4xl font-serif italic text-zinc-700 mb-3">No results</p>
                <p className="text-sm text-zinc-600">Try a different search or category.</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
