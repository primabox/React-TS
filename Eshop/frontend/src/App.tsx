import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import type { Product } from "./types";
import ProductList from "./components/ProductList";
import { Toaster } from "react-hot-toast";
import { useCart } from "./hooks/useCart";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Cart state and actions
  const { cart, addToCart, removeFromCart, checkout } = useCart();

  // Fetch products from the API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("API error:", err));
  }, []);

  // Build category list
  const categories = ["All", ...new Set(products.map((p) => p.category))];
  
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Toast notifications */}
      <Toaster 
        position="bottom-right" 
        toastOptions={{ className: "bg-zinc-900! border! border-zinc-800! text-white! rounded-2xl!" }} 
      />
      
      <Navbar 
        cartCount={cart.length} 
        onCartClick={() => setIsCartOpen(true)} 
      />

      <ProductList
        products={filteredProducts} 
        onAddToCart={addToCart}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <Footer />

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart} 
        onRemoveItem={removeFromCart}
        onCheckout={checkout}
      />
    </div>
  );
}

export default App;