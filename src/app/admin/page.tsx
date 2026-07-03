"use client";

import { useEffect, useState, useCallback } from "react";

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
type SubStatus = "active" | "cancelled" | "paused";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: { productId: string; name: string; price: number; quantity: number }[];
  total: number;
  status: OrderStatus;
  shippingAddress: string;
  createdAt: string;
}

interface Subscription {
  id: string;
  email: string;
  name: string;
  status: SubStatus;
  subscribedAt: string;
  cancelledAt: string | null;
}

const orderStatuses: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
const subStatuses: SubStatus[] = ["active", "cancelled", "paused"];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  active: "bg-green-100 text-green-800",
  paused: "bg-orange-100 text-orange-800",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
}

function AdminPage() {
  const [tab, setTab] = useState<"orders" | "subscriptions">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error((await res.json()).error);
      setOrders(await res.json());
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  const fetchSubs = useCallback(async () => {
    try {
      const res = await fetch("/api/subscriptions");
      if (!res.ok) throw new Error((await res.json()).error);
      setSubs(await res.json());
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    (tab === "orders" ? fetchOrders() : fetchSubs()).finally(() => setLoading(false));
  }, [tab, fetchOrders, fetchSubs]);

  async function updateOrderStatus(id: string, status: OrderStatus) {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function deleteOrder(id: string) {
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function updateSubStatus(id: string, status: SubStatus) {
    try {
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setSubs((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function deleteSub(id: string) {
    try {
      const res = await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      setSubs((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const activeSubs = subs.filter((s) => s.status === "active").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
          <a href="/" className="text-sm text-gray-500 hover:text-gray-700 underline">
            View Site
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Pending Orders</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingOrders}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Active Subscriptions</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{activeSubs}</p>
          </div>
        </div>

        <div className="flex gap-1 mb-6">
          <button
            onClick={() => setTab("orders")}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              tab === "orders"
                ? "bg-white text-gray-900 border border-b-0 border-gray-200"
                : "bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setTab("subscriptions")}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              tab === "subscriptions"
                ? "bg-white text-gray-900 border border-b-0 border-gray-200"
                : "bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
          >
            Subscriptions
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          {error && (
            <div className="p-4 border-b border-red-200 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
            </div>
          ) : tab === "orders" ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Items</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Total</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-gray-500 text-xs">{order.customerEmail}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {order.items.map((i) => i.name).join(", ")}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        ${order.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 mr-2"
                        >
                          {orderStatuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Subscribed</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                      No subscriptions yet.
                    </td>
                  </tr>
                ) : (
                  subs.map((sub) => (
                    <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{sub.email}</td>
                      <td className="px-4 py-3 text-gray-600">{sub.name || "—"}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(sub.subscribedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <select
                          value={sub.status}
                          onChange={(e) => updateSubStatus(sub.id, e.target.value as SubStatus)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 mr-2"
                        >
                          {subStatuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => deleteSub(sub.id)}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
