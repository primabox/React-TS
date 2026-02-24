import { useState, useCallback, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { useTheme } from "./hooks/useTheme";
import { useCart } from "./hooks/useCart";
import { useWishlist } from "./hooks/useWishlist";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import CartSidebar from "./components/CartSidebar";
import ProductModal from "./components/ProductModal";
import AuthModal from "./components/AuthModal";
import Footer from "./components/Footer";
import OrderHistory from "./components/OrderHistory";
import type { Product } from "./types";

function AppInner() {
  const { isDark, toggle: toggleTheme } = useTheme();
  const { cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, checkout } = useCart();
  const { wishlistIds, toggle: toggleWishlistId } = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [activeSection, setActiveSection] = useState("all");
  const [externalCategory, setExternalCategory] = useState<string | undefined>(undefined);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  const fetchProducts = useCallback(() => {
    fetch("http://localhost:30001/api/products/")
      .then((r) => r.json())
      .then((data) => { setProducts(data); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleCheckout = useCallback(async (email: string) => {
    const ok = await checkout(email);
    if (ok) fetchProducts();   // refresh stock after order
    return ok;
  }, [checkout, fetchProducts]);

  const openAuth = useCallback((tab: "login" | "register" = "login") => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  }, []);

  const handleNavClick = useCallback((section: string) => {
    setActiveSection(section);
    if (section === "about") {
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
    } else {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
      if (section === "all" || section === "courses") {
        setExternalCategory("All");
      } else {
        setExternalCategory(section.charAt(0).toUpperCase() + section.slice(1));
      }
    }
  }, []);

  const handleToggleWishlist = useCallback((product: Product) => {
    toggleWishlistId(product.id, product.name);
  }, [toggleWishlistId]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: isDark ? "#27272a" : "#ffffff",
            color: isDark ? "#f4f4f5" : "#18181b",
            border: isDark ? "1px solid #3f3f46" : "1px solid #e4e4e7",
            fontSize: "12px",
            letterSpacing: "0.05em",
            borderRadius: "0",
          },
        }}
      />

      <Navbar
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        onCartOpen={() => setIsCartOpen(true)}
        isDark={isDark}
        onThemeToggle={toggleTheme}
        onAuthOpen={openAuth}
        onNavClick={handleNavClick}
        activeSection={activeSection}
        onOrdersOpen={() => setIsOrdersOpen(true)}
      />

      <ProductList
        products={products}
        isLoading={isLoading}
        onAddToCart={addToCart}
        onSelectProduct={setSelectedProduct}
        wishlistIds={wishlistIds}
        onToggleWishlist={(id: number) => toggleWishlistId(id)}
        externalCategory={externalCategory}
      />

      <Footer />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
        onCheckout={handleCheckout}
        onAuthOpen={openAuth}
      />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, qty) => { addToCart(p, qty); setSelectedProduct(null); }}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={selectedProduct ? wishlistIds.has(selectedProduct.id) : false}
      />

      <OrderHistory
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultTab={authTab}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
