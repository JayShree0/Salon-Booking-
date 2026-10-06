import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import api from "../../config/api";

export default function TransactionTable() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/payments/salon")
      .then(({ data }) => setPayments(data || []))
      .catch((requestError) => setError(requestError.response?.data?.message || requestError.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <h1 className="pb-5 font-bold text-2xl">Transactions</h1>
      {loading && <p className="py-4">Loading transactions...</p>}
      {error && <p role="alert" className="py-4 text-red-700">{error}</p>}
      {!loading && !error && payments.length === 0 && <p className="py-4">No payments have been recorded yet.</p>}
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="salon payment transactions">
        <TableHead>
          <TableRow>
            <TableCell>Payment</TableCell>
            <TableCell align="right">Booking</TableCell>
            <TableCell align="right">Method</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment) => (
            <TableRow
              key={payment.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                #{payment.id}
              </TableCell>
              <TableCell align="right">#{payment.bookingId}</TableCell>
              <TableCell align="right">{payment.paymentMethod}</TableCell>
              <TableCell align="right">₹{payment.amount}</TableCell>
              <TableCell align="right">{payment.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </section>
  );
}
