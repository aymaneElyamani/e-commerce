
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/orders`;
export const createOrder = async (
  utilisateur_id: number,
  items: OrderItem[]
): Promise<{ message: string; order_id: number }> => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ utilisateur_id, items }),
    });

    if (!response.ok) {
      const errorData: { error?: string } = await response.json();
      throw new Error(errorData.error || "Failed to create order.");
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Failed to create order. Please try again. " + error.message);
    }
    throw new Error("Failed to create order. Please try again.");
  }
};


// Get all orders
export const getAllOrders = async (): Promise<Order[]> => {
  const response = await fetch(`${BASE_URL}/`);
  if (!response.ok) throw new Error("Failed to fetch orders");
  return await response.json();
};

// Get order by ID
export const getOrderById = async (orderId: number): Promise<Order> => {
  const response = await fetch(`${BASE_URL}/${orderId}`);
  if (!response.ok) throw new Error("Failed to fetch order by ID");
  return await response.json();
};

// Get orders for a specific user
export const getOrdersByUserId = async (userId: number): Promise<Order[]> => {
  const response = await fetch(`${BASE_URL}/user/${userId}`);
  if (!response.ok) throw new Error("Failed to fetch orders for user");
  return await response.json();
};
