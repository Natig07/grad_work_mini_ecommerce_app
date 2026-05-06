'use client';

import { useEffect, useState } from 'react';

type OrderItem = {
  id: number;
  title: string;
  price: number;
};

type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Completed';
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Mock data (replace later with real API)
    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        items: [
          { id: 1, title: 'Product 1', price: 50 },
          { id: 2, title: 'Product 2', price: 30 },
        ],
        total: 80,
        status: 'Completed',
      },
      {
        id: 'ORD-002',
        items: [{ id: 3, title: 'Product 3', price: 120 }],
        total: 120,
        status: 'Pending',
      },
    ];

    setOrders(mockOrders);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between mb-2">
                <h2 className="font-semibold">{order.id}</h2>
                <span
                  className={`text-sm ${
                    order.status === 'Completed'
                      ? 'text-green-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <ul className="text-sm text-gray-600 mb-2">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.title} - ${item.price}
                  </li>
                ))}
              </ul>

              <div className="font-semibold">
                Total: ${order.total}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}