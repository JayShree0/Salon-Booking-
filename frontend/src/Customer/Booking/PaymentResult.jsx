import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import api from "../../config/api";

const PaymentResult = ({ cancelled = false }) => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState(cancelled ? "cancelled" : "checking");
  const [message, setMessage] = useState(cancelled ? "You left the payment page before completing payment." : "Confirming your payment...");

  useEffect(() => {
    if (cancelled) return;

    const confirmPayment = async () => {
      const paymentMethod = searchParams.get("paymentMethod") || "RAZORPAY";
      const paymentId = paymentMethod === "STRIPE"
        ? searchParams.get("session_id")
        : searchParams.get("razorpay_payment_id");
      const paymentLinkId = paymentMethod === "STRIPE"
        ? searchParams.get("session_id")
        : searchParams.get("razorpay_payment_link_id");
      const paymentStatus = searchParams.get("razorpay_payment_link_status");

      if (paymentStatus && paymentStatus !== "paid") {
        setStatus("failed");
        setMessage("The payment provider did not report a completed payment.");
        return;
      }
      if (!paymentId || !paymentLinkId) {
        setStatus("failed");
        setMessage("We could not verify the payment details returned by the provider.");
        return;
      }

      try {
        const { data } = await api.patch("/api/payments/proceed", null, {
          params: { paymentId, paymentLinkId },
        });
        if (data === true) {
          setStatus("success");
          setMessage("Your payment is confirmed and your booking is being finalized.");
        } else {
          setStatus("failed");
          setMessage("Payment is not confirmed yet. Check your bookings before placing another request.");
        }
      } catch (requestError) {
        setStatus("failed");
        setMessage(requestError.response?.data?.message || requestError.message || "We could not confirm your payment.");
      }
    };

    confirmPayment();
  }, [cancelled, searchParams]);

  return (
    <main className="min-h-[65vh] flex flex-col items-center justify-center text-center px-5">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${status === "success" ? "bg-green-100 text-green-800" : status === "checking" ? "bg-gray-100 text-gray-700" : "bg-orange-100 text-orange-800"}`}>
        {status === "success" ? "✓" : status === "checking" ? "…" : "!"}
      </div>
      <h1 className="mt-5 text-3xl font-bold">
        {status === "success" ? "Payment complete" : status === "checking" ? "Checking payment" : status === "cancelled" ? "Payment cancelled" : "Payment not confirmed"}
      </h1>
      <p className="mt-3 max-w-lg text-gray-600">{message}</p>
      {orderId && <p className="mt-2 text-sm text-gray-500">Payment order #{orderId}</p>}
      <Link to="/bookings" className="mt-6 rounded bg-green-800 px-5 py-3 text-white">View my bookings</Link>
    </main>
  );
};

export default PaymentResult;
