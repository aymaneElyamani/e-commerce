"use client";
import React, { useEffect, useState } from "react";
import useAuthStore from "@/store/useAuthStore"; 
import { getOrdersByUserId } from "@/services/order";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

function OrdersPage() {
  const { user } = useAuthStore(); // Get user data
  const [orders, setOrders] = useState<Order[]>([]); // Orders state
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]); // Filtered orders
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // Selected order for modal
  
  const [filter, setFilter] = useState({
    startDate: '',
    endDate: '',
    status: '',
    minPrice: 0,
    maxPrice: 1000,
  });

  useEffect(() => {
    if (!user?.id) return;

    // Fetch orders by user ID
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

  // Filter orders based on user input
  useEffect(() => {
    let filtered = orders;

    // Filter by date range
    if (filter.startDate) {
      filtered = filtered.filter(order =>
        new Date(order.created_at) >= new Date(filter.startDate)
      );
    }

    if (filter.endDate) {
      filtered = filtered.filter(order =>
        new Date(order.created_at) <= new Date(filter.endDate)
      );
    }

    // Filter by status
    if (filter.status) {
      filtered = filtered.filter(order => order.status === filter.status);
    }

    // Filter by price range
    filtered = filtered.filter(order =>
      order.total_price >= filter.minPrice && order.total_price <= filter.maxPrice
    );

    setFilteredOrders(filtered);
  }, [filter, orders]);

  // Order item component
  const OrderItem = ({ order }: { order: Order }) => (
    <div className="bg-white shadow-lg rounded-md p-4 mb-4 border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold text-gray-800">Order</h3>
        <span className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</span>
      </div>
      <p className="text-gray-700 text-lg font-medium">Status: {order.status}</p>
      <p className="text-gray-700 text-lg font-medium mt-2">Total: ${order.total_price.toFixed(2)}</p>

      <div className="mt-4 space-y-2">
        {order.items?.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-sm text-gray-600">
            <span>{item.name} x{item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => setSelectedOrder(order)}
        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        View Details
      </button>
    </div>
  );

  // Loading state skeletons
  const OrderSkeleton = () => (
    <div className="bg-white shadow-md rounded-md p-4 mb-6">
      <div className="flex justify-between items-center">
        <Skeleton className="w-3/4 h-6" />
        <Skeleton className="w-1/4 h-6" />
      </div>
      <Skeleton className="w-3/4 h-4 mt-4" />
      <Skeleton className="w-1/2 h-4 mt-2" />
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">Your Orders</h1>
      
      {/* Filter Section */}
      <div className="flex flex-wrap gap-6 mb-6">
        <div className="flex gap-2">
          <label className="text-gray-600">Start Date:</label>
          <input
            type="date"
            value={filter.startDate}
            onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
            className="p-2 border rounded-md"
          />
        </div>
        <div className="flex gap-2">
          <label className="text-gray-600">End Date:</label>
          <input
            type="date"
            value={filter.endDate}
            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
            className="p-2 border rounded-md"
          />
        </div>
        <div className="flex gap-2">
          <label className="text-gray-600">Status:</label>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="p-2 border rounded-md"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="shipped">Shipped</option>
          </select>
        </div>
        <div className="flex gap-2">
          <label className="text-gray-600">Price Range:</label>
          <input
            type="number"
            value={filter.minPrice || ''}
            onChange={(e) => setFilter({ ...filter, minPrice: e.target.value ? parseFloat(e.target.value) : 0 })}
            className="p-2 border rounded-md"
            placeholder="Min"
          />
          <input
            type="number"
            value={filter.maxPrice || ''}
            onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value ? parseFloat(e.target.value) : 1000 })}
            className="p-2 border rounded-md"
            placeholder="Max"
          />
        </div>
      </div>

      {isLoading ? (
        // Display skeletons while loading
        <div className="space-y-6">
          {Array(3)
            .fill(null)
            .map((_, index) => <OrderSkeleton key={index} />)}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders && filteredOrders.length > 0 ? (
            filteredOrders.map((order) => <OrderItem key={order.id} order={order} />)
          ) : (
            <p className="text-gray-500 text-center">No orders match your filter.</p>
          )}
        </div>
      )}

      {selectedOrder && (
        <Dialog open={true} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent>
            <DialogTitle className="text-xl font-semibold">Order Details</DialogTitle>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-semibold">Total Amount:</span>
                <span>${selectedOrder.total_price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Status:</span>
                <span>{selectedOrder.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Order Date:</span>
                <span>{new Date(selectedOrder.created_at).toLocaleDateString()}</span>
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-semibold">Items:</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span>{item.name} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default OrdersPage;
