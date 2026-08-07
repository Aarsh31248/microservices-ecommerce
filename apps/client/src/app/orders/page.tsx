import { auth } from "@clerk/nextjs/server";
import { OrderType } from "@repo/types";

const fetchOrders = async () => {
  const { getToken } = await auth();
  const token = await getToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/user-orders`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const data: OrderType[] = await res.json();
  return data;
};

const OrdersPage = async () => {
  const orders = await fetchOrders();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Your Orders</h1>
        <p className="text-sm text-gray-500 mt-1">
          View your purchase history and order details.
        </p>
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-xl p-12 text-center">
          <h2 className="text-lg font-medium text-gray-700">
            No orders yet
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Your completed orders will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 p-6"
            >
              {/* Top */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Order ID
                  </p>

                  <p className="font-mono text-sm text-gray-800 break-all">
                    {order._id}
                  </p>
                </div>

                <div
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium w-fit ${
                    order.status === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status}
                </div>
              </div>

              {/* Divider */}
              <div className="my-6 border-t border-gray-100" />

              {/* Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Total Amount
                  </p>

                  <p className="text-lg font-semibold text-gray-900">
                    ${(order.amount / 100).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Order Date
                  </p>

                  <p className="font-medium text-gray-700">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Products
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {order.products?.map((product, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                      >
                        {product.name}
                      </span>
                    )) || "-"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;