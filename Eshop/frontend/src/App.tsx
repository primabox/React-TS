import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import type { Product } from "./types";
import ProductList from "./components/ProductList";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Logic: Cart Management
  const [cart, setCart] = useState<Product[]>(() => {
    const saved = localStorage.getItem("my_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("my_cart", JSON.stringify(cart));
  }, [cart]);

  // Logic: API Fetch
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("API error:", err));
  }, []);

  // Handlers
  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    toast.success(`${product.name} added! 🛒`);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  // Memoized values for filtering
  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Toaster position="bottom-right" toastOptions={{ className: "bg-zinc-900! text-white!" }} />
      
      <Navbar cartCount={cart.length} onCartClick={() => setIsCartOpen(true)} />

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
      />
    </div>
  );
}

export default App;