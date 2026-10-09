import React, { useEffect, useState } from "react";
import {
  AccountBalanceOutlined,
  CurrencyRupee,
  TrendingUpOutlined,
  ReceiptLongOutlined,
  CheckCircleOutlineOutlined,
  CreditCardOutlined,
  SavingsOutlined,
} from "@mui/icons-material";
import api from "../../config/api";

const Payment = () => {
  const [report, setReport] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.allSettled([
      api.get("/api/bookings/report"),
      api.get("/api/payments/salon"),
    ])
      .then(([reportRes, paymentRes]) => {
        if (reportRes.status === "fulfilled") setReport(reportRes.value.data);
        if (paymentRes.status === "fulfilled") setPayments(paymentRes.value.data || []);
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  const successfulPayments = payments.filter((p) => p.status === "SUCCESS");
  const totalVolume = successfulPayments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header with Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Earnings & Financial Overview
        </h1>
        <p className="text-xs text-slate-500">
          Summary of online revenues, processed payment orders, and refund metrics
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* 2. Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Earnings Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Earnings
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <CurrencyRupee sx={{ fontSize: 20 }} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900">
              ₹{Number(report?.totalEarnings || 0).toLocaleString("en-IN")}
            </p>
            <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUpOutlined sx={{ fontSize: 15 }} />
              <span>Net earnings after completions</span>
            </p>
          </div>
        </div>

        {/* Processed Payment Orders */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Payment Orders
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <ReceiptLongOutlined sx={{ fontSize: 20 }} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900">
              {payments.length}
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              {successfulPayments.length} marked successful ({Math.round((successfulPayments.length / (payments.length || 1)) * 100)}% completion)
            </p>
          </div>
        </div>

        {/* Refunds Issued */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Refunds
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <SavingsOutlined sx={{ fontSize: 20 }} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900">
              ₹{Number(report?.totalRefunds || 0).toLocaleString("en-IN")}
            </p>
            <p className="text-xs font-semibold text-rose-600 mt-1">
              {report?.cancelledBookings || 0} cancellations processed
            </p>
          </div>
        </div>
      </div>

      {/* 3. Payment Gateway Information Note */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CreditCardOutlined sx={{ fontSize: 18 }} className="text-amber-400" />
            <h3 className="text-sm font-bold text-white">Automated Razorpay Settlement</h3>
          </div>
          <p className="text-xs text-slate-300 max-w-xl">
            Customer booking payments are held securely in escrow and released directly to your verified salon bank account in accordance with RBI settlement standards.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold text-emerald-400 border border-white/10 self-start md:self-auto">
          <CheckCircleOutlineOutlined sx={{ fontSize: 16 }} />
          <span>Active Gateway</span>
        </div>
      </div>
    </div>
  );
};

export default Payment;