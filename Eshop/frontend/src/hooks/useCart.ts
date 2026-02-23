import { useState, useEffect } from "react";
import type { Product } from "../types";
import toast from "react-hot-toast";

export function useCart() {
  // Load cart from localStorage on startup
  const [cart, setCart] = useState<Product[]>(() => {
    const saved = localStorage.getItem("my_cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("my_cart", JSON.stringify(cart));
  }, [cart]);

  // Add a product to the cart
  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    toast.success(`${product.name} added! 🛒`, {
      className: "bg-zinc-900! border! border-zinc-800! text-white! rounded-2xl!",
    });
  };

  // Remove a product from the cart by index
  const removeFromCart = (index: number) => {
    const item = cart[index];
    setCart(cart.filter((_, i) => i !== index));
    
    if (item) {
      toast.error(`${item.name} removed`, {
        className: "bg-zinc-900! border! border-zinc-800! text-white! rounded-2xl!",
      });
    }
  };

  // Function to handle the checkout process
const checkout = async (email: string) => {
  if (cart.length === 0) {
    toast.error("Cart is empty");
    return false;
  }

  // Formatting data for Django backend
  const orderData = {
    customer_email: email,
    total_price: cart.reduce((sum, item) => sum + Number(item.price), 0),
    items: cart.map(item => item.id) // Django expects a list of IDs
  };

  try {
    const response = await fetch("http://127.0.0.1:8000/api/orders/", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      toast.success("Order sent to database! 🚀");
      setCart([]); // Clear state after success
      return true;
    } else {
      toast.error("Failed to save order");
      return false;
    }
  } catch (error) {
    toast.error("Connection error");
    return false;
  }
};

  // Expose cart state and actions
  return { 
    cart, 
    addToCart, 
    removeFromCart,
    checkout
  };
}