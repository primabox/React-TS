import { useState } from "react";
import toast from "react-hot-toast";

export function useWishlist() {
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(() => {
    const saved = localStorage.getItem("studio_wishlist");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const toggle = (id: number, name?: string) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast(name ? `${name} removed from saved` : "Removed from saved", { icon: "" });
      } else {
        next.add(id);
        toast(name ? `${name} saved` : "Saved", { icon: "" });
      }
      localStorage.setItem("studio_wishlist", JSON.stringify([...next]));
      return next;
    });
  };

  const isWishlisted = (id: number) => wishlistIds.has(id);

  return { wishlistIds, toggle, isWishlisted };
}
