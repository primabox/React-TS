import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Definice toho, jak vypadá jeden produkt
interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  category: string;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  
  // Tady vytváříme "krabici" pro košík. Na začátku je prázdná []
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Chyba API:", err));
  }, []);

  // Funkce pro přidání do košíku. 
  // Používáme [...cart], abychom vytvořili kopii starého košíku a přidali nový kus.
  const addToCart = (course: Product) => {
    setCart([...cart, course]); 
    console.log("V košíku je nyní položek:", cart.length + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbaru posíláme informaci, kolik věcí je v košíku */}
      <Navbar cartCount={cart.length} />

      <main className="flex-grow p-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
          My Modern E-shop 🚀
        </h1>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 transition-transform hover:scale-105">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-500 bg-blue-50 px-3 py-1 rounded-full">
                {item.category}
              </span>
              <h2 className="text-2xl font-bold text-gray-800 mt-4">{item.name}</h2>
              <p className="text-gray-600 mt-2 line-clamp-3">{item.description}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-2xl font-black text-gray-900">{item.price} CZK</span>
                
                <button 
                  onClick={() => addToCart(item)}
                  className="bg-black text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors cursor-pointer active:scale-95"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;