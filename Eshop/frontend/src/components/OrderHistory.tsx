import { useState, useEffect } from "react";
import { X, Package, ChevronDown, ChevronUp } from "lucide-react";
import { formatPrice } from "../utils/format";

interface Order {
  id: number;
  created_at: string;
  total_price: string;
  customer_email: string;
  items: number[];
}

interface OrderHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function OrderHistory({ isOpen, onClose }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const token = localStorage.getItem("studio_token");
    if (!token) return;
    setLoading(true);
    fetch("http://localhost:30001/api/orders/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 z-50 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <Package size={15} className="text-zinc-400 dark:text-zinc-500" />
            <h2 className="text-xs font-semibold tracking-[0.2em] text-zinc-700 dark:text-zinc-300 uppercase">
              Order History
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="space-y-3 pt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <Package size={36} className="text-zinc-200 dark:text-zinc-700 mb-4" />
              <p className="font-serif italic text-xl text-zinc-300 dark:text-zinc-600 mb-2">No orders yet</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-600 tracking-wide">Your order history will appear here.</p>
            </div>
          ) : (
            <div className="space-y-2 pt-2">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-zinc-100 dark:border-zinc-800 overflow-hidden"
                >
                  <button
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    className="w-full text-left px-4 py-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div>
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                        Order #{order.id}
                      </p>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                        {formatDate(order.created_at)}  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {formatPrice(order.total_price)}
                      </span>
                      {expanded === order.id ? (
                        <ChevronUp size={13} className="text-zinc-400" />
                      ) : (
                        <ChevronDown size={13} className="text-zinc-400" />
                      )}
                    </div>
                  </button>

                  {expanded === order.id && (
                    <div className="px-4 pb-4 border-t border-zinc-100 dark:border-zinc-800 pt-3 space-y-1">
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mb-2">
                        Delivered to: <span className="text-zinc-600 dark:text-zinc-400">{order.customer_email}</span>
                      </p>
                      {order.items.map((productId, idx) => (
                        <div key={idx} className="flex items-center gap-3 py-1">
                          <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 overflow-hidden">
                            <img
                              src={`https://picsum.photos/seed/${productId}/32/32`}
                              alt=""
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-xs text-zinc-600 dark:text-zinc-400">Product #{productId}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
