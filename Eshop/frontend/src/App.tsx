import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import type { Product } from "./types";
import ProductList from "./components/ProductList";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("") // Stores the search text
  const [selectedCategory, setSelectedCategory] = useState("All"); // Current category filter

  // Load cart from browser memory or start empty
  const [cart, setCart] = useState<Product[]>(() => {
    const savedCart = localStorage.getItem("my_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to memory every time it changes
  useEffect(() => {
    localStorage.setItem("my_cart", JSON.stringify(cart));
  }, [cart]);

  // Fetch product list from our API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("API error:", err));
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;

    return matchesSearch && matchesCategory; // Must match both
  });


  // Delete one item from cart by its position
  const removeFromCart = (indexToRemove: number) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  // Add a new product to the cart array
  const addToCart = (course: Product) => {
    setCart([...cart, course]);
  };








  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Pass cart item count to Navbar */}
      <Navbar
        cartCount={cart.length}
        onCartClick={() => setIsCartOpen(true)}
      />

      <ProductList
        products={products}
        onAddToCart={addToCart}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Footer />
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveItem={removeFromCart} // Pass the delete function
      />
    </div>
  );
}

export default App;