"use client";

import React, { useEffect, useState } from "react";
import useAuthStore from "@/store/useAuthStore";
import { getOrdersByUserId } from "@/services/order";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { FaFilter } from "react-icons/fa";


function OrdersPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const router = useRouter();

  const [filter, setFilter] = useState({
    startDate: "",
    endDate: "",
    status: "",
    minPrice: 0,
    maxPrice: 1000,
  });

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated]);

  useEffect(() => {
    if (!user?.id) return;
    getOrdersByUserId(user.id)
      .then((data) => {
        setOrders(data as Order[]);
        setFilteredOrders(data as Order[]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setIsLoading(false);
      });
  }, [user?.id]);

  useEffect(() => {
    let filtered = orders;

    if (filter.startDate) {
      filtered = filtered.filter(
        (order) => new Date(order.created_at) >= new Date(filter.startDate)
      );
    }

    if (filter.endDate) {
      filtered = filtered.filter(
        (order) => new Date(order.created_at) <= new Date(filter.endDate)
      );
    }

    if (filter.status) {
      filtered = filtered.filter((order) => order.status === filter.status);
    }

    filtered = filtered.filter(
      (order) =>
        order.total_price >= filter.minPrice &&
        order.total_price <= filter.maxPrice
    );

    setFilteredOrders(filtered);
  }, [filter, orders]);

  const resetFilter = () => {
    setFilter({
      startDate: "",
      endDate: "",
      status: "",
      minPrice: 0,
      maxPrice: 1000,
    });
  };

  const OrderItem = ({ order }: { order: Order }) => (
    <div className="bg-white/90 shadow-xl rounded-2xl p-6 mb-6 border border-blue-100 hover:shadow-2xl transition-all group relative overflow-hidden">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
          Order #{order.id}
        </h3>
        <span className="text-xs text-gray-400">
          {new Date(order.created_at).toLocaleDateString()}
        </span>
      </div>
      <div className="flex flex-wrap gap-4 items-center mb-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            order.status === "completed"
              ? "bg-green-100 text-primary"
              : order.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-blue-100 text-primary"
          }`}
        >
          {/* {order.status.charAt(0).toUpperCase() + order.status.slice(1)} */}
          Pending
        </span>
        <span className="text-gray-700 font-medium">
          Total:{" "}
          <span className="text-blue-700">${order.total_price.toFixed(2)}</span>
        </span>
      </div>
      <div className="mt-2 space-y-1">
        {order.items!.slice(0, 2).map((item) => (
          <div key={item.id} className="flex justify-between text-sm text-gray-600">
            <span>
              {item.name} <span className="text-gray-400">x{item.quantity}</span>
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        {order.items!.length > 2 && (
          <div className="text-xs text-gray-400 italic">
            + {order.items!.length - 2} more items
          </div>
        )}
      </div>
      <button
        onClick={() => setSelectedOrder(order)}
        className="absolute right-6 bottom-6 bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition-all font-semibold"
      >
        View Details
      </button>
    </div>
  );

  const OrderSkeleton = () => (
    <div className="bg-white/80 shadow rounded-2xl p-6 mb-6 border border-blue-50">
      <div className="flex justify-between items-center">
        <Skeleton className="w-1/3 h-6 rounded" />
        <Skeleton className="w-1/6 h-6 rounded" />
      </div>
      <Skeleton className="w-1/2 h-4 mt-4 rounded" />
      <Skeleton className="w-1/4 h-4 mt-2 rounded" />
      <Skeleton className="w-full h-3 mt-4 rounded" />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-4xl font-extrabold mb-8 text-blue-700 tracking-tight text-center">
        <FaFilter className="inline mr-2 text-blue-400" /> My Orders
      </h1>

      {/* Filter Section */}
      <div className="bg-white/90 rounded-xl shadow p-6 mb-10 border border-blue-100 flex flex-wrap gap-4 items-end justify-between">
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 text-sm">Start Date</label>
          <input
            type="date"
            value={filter.startDate}
            onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
            className="p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 bg-blue-50"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 text-sm">End Date</label>
          <input
            type="date"
            value={filter.endDate}
            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
            className="p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 bg-blue-50"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 text-sm">Status</label>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 bg-blue-50"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="shipped">Shipped</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 text-sm">Price Range</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={filter.minPrice}
              onChange={(e) =>
                setFilter({ ...filter, minPrice: parseFloat(e.target.value) || 0 })
              }
              className="p-2 border border-blue-200 rounded-md w-20 focus:ring-2 focus:ring-blue-400 bg-blue-50"
              placeholder="Min"
            />
            <input
              type="number"
              value={filter.maxPrice}
              onChange={(e) =>
                setFilter({ ...filter, maxPrice: parseFloat(e.target.value) || 1000 })
              }
              className="p-2 border border-blue-200 rounded-md w-20 focus:ring-2 focus:ring-blue-400 bg-blue-50"
              placeholder="Max"
            />
          </div>
        </div>
        <button
          onClick={resetFilter}
          className="ml-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Reset Filters
        </button>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <>
          <OrderSkeleton />
          <OrderSkeleton />
        </>
      ) : filteredOrders.length > 0 ? (
        filteredOrders.map((order) => <OrderItem key={order.id} order={order} />)
      ) : (
        <p className="text-center text-gray-500">No orders found.</p>
      )}

      {/* Dialog for selected order */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent>
          <DialogTitle>Order Details</DialogTitle>
          {selectedOrder && (
            <div>
              <p>Status: {selectedOrder.status}</p>
              <p>Total: ${selectedOrder.total_price.toFixed(2)}</p>
              <ul className="mt-4 space-y-2">
                {selectedOrder.items!.map((item) => (
                  <li key={item.id}>
                    {item.name} x{item.quantity} - $
                    {(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default OrdersPage;
