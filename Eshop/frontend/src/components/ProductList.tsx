import { useState, useMemo } from "react";
import { Search, Heart } from "lucide-react";
import type { Product } from "../types";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import HeroCarousel from "./HeroCarousel";

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  wishlistIds: Set<number>;
  onToggleWishlist: (id: number) => void;
  externalCategory?: string;
}

export default function ProductList({ products, isLoading, onAddToCart, onSelectProduct, wishlistIds, onToggleWishlist, externalCategory }: ProductListProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);

  // Allow parent (navbar) to control active category
  const resolvedCategory = externalCategory !== undefined ? externalCategory : activeCategory;

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    return ["All", ...cats];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = resolvedCategory === "All" || p.category === resolvedCategory;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchSaved = !savedOnly || wishlistIds.has(p.id);
      return matchCat && matchSearch && matchSaved;
    });
  }, [products, resolvedCategory, search, savedOnly, wishlistIds]);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setSavedOnly(false);
  };

  const displayCategory = externalCategory !== undefined ? externalCategory : activeCategory;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <HeroCarousel onCategorySelect={(cat) => handleCategoryClick(cat)} />
      <section id="products" className="pt-16 pb-20 px-6 max-w-7xl mx-auto">

        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-1 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-2 text-xs tracking-wider uppercase transition-colors duration-200 ${
                  displayCategory === cat && !savedOnly
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => { setSavedOnly((v) => !v); setActiveCategory("All"); }}
              className={`px-4 py-2 text-xs tracking-wider uppercase transition-colors duration-200 flex items-center gap-1.5 ${
                savedOnly
                  ? "bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <Heart size={11} fill={savedOnly ? "currentColor" : "none"} />
              Saved
              {wishlistIds.size > 0 && (
                <span className="ml-0.5 text-[10px] opacity-70">({wishlistIds.size})</span>
              )}
            </button>
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-4 py-2 bg-transparent border-b border-zinc-300 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 dark:focus:border-zinc-400 w-52 tracking-wide transition-colors"
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
            {savedOnly ? (
              <>
                <p className="text-4xl font-serif italic text-zinc-300 dark:text-zinc-700 mb-3">Nothing saved yet</p>
                <p className="text-sm text-zinc-400 dark:text-zinc-600">Click the heart on any product to save it.</p>
              </>
            ) : products.length === 0 ? (
              <>
                <p className="text-4xl font-serif italic text-zinc-300 dark:text-zinc-700 mb-3">No products yet</p>
                <p className="text-sm text-zinc-400 dark:text-zinc-600">Check back soon.</p>
              </>
            ) : (
              <>
                <p className="text-4xl font-serif italic text-zinc-300 dark:text-zinc-700 mb-3">No results</p>
                <p className="text-sm text-zinc-400 dark:text-zinc-600">Try a different search or category.</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onSelect={onSelectProduct}
                isWishlisted={wishlistIds.has(product.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
