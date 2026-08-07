import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight, ShoppingBag } from "lucide-react";

const ReturnPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }> | undefined;
}) => {
  const session_id = (await searchParams)?.session_id;

  if (!session_id) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center max-w-md w-full">
          <XCircle className="mx-auto h-14 w-14 text-red-500" />
          <h1 className="mt-4 text-2xl font-semibold text-gray-900">
            Invalid Session
          </h1>
          <p className="mt-2 text-gray-500">
            No payment session was found.
          </p>
        </div>
      </div>
    );
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/${session_id}`
  );

  const data = await res.json();

  const success = data.paymentStatus === "paid";

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-10">
      <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white shadow-xl p-8">
        {/* Icon */}
        <div className="flex justify-center">
          {success ? (
            <CheckCircle2 className="h-20 w-20 text-green-500" />
          ) : (
            <XCircle className="h-20 w-20 text-red-500" />
          )}
        </div>

        {/* Heading */}
        <div className="mt-6 text-center">
          <h1 className="text-3xl font-semibold text-gray-900">
            {success ? "Payment Successful!" : "Payment Failed"}
          </h1>

          <p className="mt-2 text-gray-500">
            {success
              ? "Thank you! Your order has been placed successfully."
              : "Unfortunately your payment could not be completed."}
          </p>
        </div>

        {/* Details */}
        <div className="mt-8 rounded-2xl bg-gray-50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Checkout Status</span>

            <span className="font-medium capitalize text-gray-900">
              {data.status}
            </span>
          </div>

          <div className="border-t border-gray-200" />

          <div className="flex items-center justify-between">
            <span className="text-gray-500">Payment Status</span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                success
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {data.paymentStatus}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/orders"
            className="flex-1 bg-black hover:bg-gray-900 transition-all text-white rounded-xl py-3 flex items-center justify-center gap-2 font-medium"
          >
            <ShoppingBag className="w-4 h-4" />
            View Orders
          </Link>

          <Link
            href="/"
            className="flex-1 border border-gray-300 hover:bg-gray-100 transition-all rounded-xl py-3 flex items-center justify-center gap-2 font-medium"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReturnPage;