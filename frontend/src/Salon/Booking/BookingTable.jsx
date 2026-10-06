import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import api from "../../config/api";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function BookingTables() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const { data } = await api.get("/api/bookings/salon");
        const details = await Promise.all((data || []).map(async (booking) => {
          const [customerResult, ...serviceResults] = await Promise.allSettled([
            api.get(`/api/users/${booking.customerId}`),
            ...(booking.serviceIds || []).map((serviceId) => api.get(`/api/service-offering/${serviceId}`)),
          ]);

          return {
            ...booking,
            customer: customerResult.status === "fulfilled" ? customerResult.value.data : null,
            services: serviceResults.filter((result) => result.status === "fulfilled").map((result) => result.value.data),
          };
        }));
        setBookings(details);
      } catch (requestError) {
        setError(requestError.response?.data?.message || requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const updateStatus = async (bookingId, status) => {
    try {
      const { data } = await api.put(`/api/bookings/${bookingId}/status`, null, { params: { status } });
      setBookings((current) => current.map((booking) => booking.id === bookingId ? { ...booking, ...data } : booking));
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    }
  };

  return (
    <>
      <h1 className="pb-5 font-bold text-2xl">Bookings</h1>
      {loading && <p className="py-4">Loading bookings...</p>}
      {error && <p role="alert" className="py-4 text-red-700">{error}</p>}
      {!loading && !error && bookings.length === 0 && <p className="py-4">No bookings found.</p>}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="salon bookings">
          <TableHead>
            <TableRow>
              <StyledTableCell>Services</StyledTableCell>
              <StyledTableCell align="right">Time & Date</StyledTableCell>
              <StyledTableCell align="right">Price</StyledTableCell>
              <StyledTableCell align="right">Customer</StyledTableCell>
              <StyledTableCell align="right">Status</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <StyledTableRow key={booking.id}>
                <StyledTableCell component="th" scope="row">
                  {booking.services.map((service) => service.name).join(", ") || `${booking.serviceIds?.length || 0} service(s)`}
                </StyledTableCell>
                <StyledTableCell align="right">{booking.startTime ? new Date(booking.startTime).toLocaleString() : "Unavailable"}</StyledTableCell>
                <StyledTableCell align="right">₹{booking.totalPrice}</StyledTableCell>
                <StyledTableCell className="space-y-2" align="right">
                  <p>{booking.customer?.fullName || `Customer #${booking.customerId}`}</p>
                  <p>{booking.customer?.email || ""}</p>
                </StyledTableCell>
                <StyledTableCell align="right">{booking.status}</StyledTableCell>
                <StyledTableCell align="right">
                  {booking.status === "PENDING" && <div className="flex gap-2 justify-end"><button onClick={() => updateStatus(booking.id, "CONFIRMED")}>Confirm</button><button onClick={() => updateStatus(booking.id, "CANCELLED")}>Cancel</button></div>}
                  {booking.status === "CONFIRMED" && <button onClick={() => updateStatus(booking.id, "COMPLETED")}>Complete</button>}
                  {!["PENDING", "CONFIRMED"].includes(booking.status) && booking.status}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
