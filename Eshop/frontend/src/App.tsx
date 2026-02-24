import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import ProductList from "./components/ProductList";
import type { Product } from "./types";
import { useCart } from "./hooks/useCart";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, checkout, totalCount } = useCart();

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:30001/api/products/")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("API error:", err);
        setIsLoading(false);
      });
  }, []);

  // Subtract cart quantities from displayed stock
  const cartCountById = cart.reduce<Record<number, number>>((acc, item) => {
    acc[item.id] = item.quantity;
    return acc;
  }, {});

  const productsWithRealStock = products.map((p) => ({
    ...p,
    stock: Math.max(0, p.stock - (cartCountById[p.id] || 0)),
  }));

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#18181b",
            border: "1px solid #3f3f46",
            color: "#f4f4f5",
            borderRadius: "2px",
            fontSize: "12px",
            letterSpacing: "0.05em",
          },
        }}
      />

      <Navbar cartCount={totalCount} onCartOpen={() => setIsCartOpen(true)} />

      <ProductList
        products={productsWithRealStock}
        isLoading={isLoading}
        onAddToCart={addToCart}
      />

      <Footer />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
        onCheckout={checkout}
      />
    </div>
  );
}

export default App;
