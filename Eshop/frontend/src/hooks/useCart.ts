import { useState, useEffect } from "react";
import type { Product } from "../types";
import toast from "react-hot-toast";

export interface CartItem {
  id: number;
  name: string;
  price: string;
  category: string;
  stock: number;
  quantity: number;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("studio_cart_v2");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("studio_cart_v2", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        toast.success(`${product.name} quantity updated`);
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      toast.success(`${product.name} added to bag`);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) toast(`${item.name} removed`);
      return prev.filter((i) => i.id !== id);
    });
  };

  const increaseQuantity = (id: number) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );
  };

  const decreaseQuantity = (id: number) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item && item.quantity <= 1) {
        toast(`${item.name} removed`);
        return prev.filter((i) => i.id !== id);
      }
      return prev.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  const checkout = async (email: string) => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return false;
    }

    const orderData = {
      customer_email: email,
      total_price: cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
      items: cart.flatMap((item) => Array(item.quantity).fill(item.id)),
    };

    try {
      const response = await fetch("http://localhost:30001/api/orders/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        toast.success("Order placed successfully!");
        setCart([]);
        return true;
      } else {
        toast.error("Order failed. Please try again.");
        return false;
      }
    } catch {
      toast.error("Network error. Please check your connection.");
      return false;
    }
  };

  const totalCount = cart.reduce((s, i) => s + i.quantity, 0);

  return { cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, checkout, totalCount };
}
