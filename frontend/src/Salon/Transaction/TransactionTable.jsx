import React, { useEffect, useState, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import api from "../../config/api";

export default function TransactionTable() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/api/payments/salon");
      setPayments(data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getStatusBadge = (status) => {
    const s = String(status || "").toUpperCase();
    if (s === "SUCCESS" || s === "PAID" || s === "COMPLETED") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
          <CheckCircleOutlinedIcon sx={{ fontSize: 13 }} />
          <span>Success</span>
        </span>
      );
    }
    if (s === "PENDING" || s === "INITIATED") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-300">
          <HourglassEmptyIcon sx={{ fontSize: 13 }} />
          <span>Pending</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
        <CancelOutlinedIcon sx={{ fontSize: 13 }} />
        <span>{status || "Failed"}</span>
      </span>
    );
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((item) => {
      const matchesSearch =
        String(item.id || "").includes(searchTerm) ||
        String(item.bookingId || "").includes(searchTerm) ||
        String(item.paymentMethod || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      const s = String(item.status || "").toUpperCase();
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "SUCCESS" && (s === "SUCCESS" || s === "PAID" || s === "COMPLETED")) ||
        (statusFilter === "PENDING" && (s === "PENDING" || s === "INITIATED")) ||
        (statusFilter === "FAILED" && s !== "SUCCESS" && s !== "PAID" && s !== "COMPLETED" && s !== "PENDING" && s !== "INITIATED");

      return matchesSearch && matchesStatus;
    });
  }, [payments, searchTerm, statusFilter]);

  const totalRevenue = useMemo(() => {
    return payments
      .filter((p) => {
        const s = String(p.status || "").toUpperCase();
        return s === "SUCCESS" || s === "PAID" || s === "COMPLETED";
      })
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  }, [payments]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-300/80 text-amber-800 text-[11px] font-extrabold uppercase tracking-wider mb-2">
            <ReceiptLongIcon sx={{ fontSize: 14 }} />
            FINANCIAL AUDIT
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Transactions</h1>
          <p className="text-sm text-slate-500 mt-1">Detailed history of all incoming payments and payouts</p>
        </div>

        <button
          onClick={fetchTransactions}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RefreshIcon sx={{ fontSize: 16 }} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI mini-bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Recorded</p>
          <p className="text-xl font-black text-slate-900 mt-1">{payments.length} transactions</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Settled Revenue</p>
          <p className="text-xl font-black text-emerald-600 mt-1">₹{totalRevenue.toLocaleString("en-IN")}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gateway Provider</p>
          <p className="text-xl font-black text-slate-800 mt-1">Razorpay Live</p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between sticky top-0 z-10">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" sx={{ fontSize: 18 }} />
          <input
            type="text"
            placeholder="Search by Payment ID, Booking ID, or Method..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "SUCCESS", "PENDING", "FAILED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === status
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Loading & Error states */}
      {loading && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Loading transactions...</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium">
          {error}
        </div>
      )}

      {/* Transactions Table / List */}
      {!loading && !error && filteredPayments.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <ReceiptLongIcon sx={{ fontSize: 48 }} className="text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No transactions found</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {payments.length === 0
              ? "No customer payments have been processed yet."
              : "No transactions matched your current search filters."}
          </p>
        </div>
      )}

      {!loading && !error && filteredPayments.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">Payment Ref</th>
                  <th className="py-3.5 px-5">Booking Ref</th>
                  <th className="py-3.5 px-5">Payment Method</th>
                  <th className="py-3.5 px-5 text-right">Amount</th>
                  <th className="py-3.5 px-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-extrabold text-slate-900">#{p.id}</div>
                      <div className="text-[11px] text-slate-400">Razorpay</div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                        #{p.bookingId}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-slate-600 font-medium">
                      {p.paymentMethod || "ONLINE"}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <span className="font-black text-slate-900 text-sm">
                        ₹{Number(p.amount || 0).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      {getStatusBadge(p.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
