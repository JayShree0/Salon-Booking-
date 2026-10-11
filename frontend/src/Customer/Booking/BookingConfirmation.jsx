import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutlined";
import CalendarTodayOutlined from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import PaymentsOutlined from "@mui/icons-material/PaymentsOutlined";
import ContentCutOutlined from "@mui/icons-material/ContentCutOutlined";
import PrintOutlined from "@mui/icons-material/PrintOutlined";
import ArrowForward from "@mui/icons-material/ArrowForward";
import StorefrontOutlined from "@mui/icons-material/StorefrontOutlined";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import api from "../../config/api";

const FALLBACK_SALON_IMAGE =
  "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800";

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setError("Invalid booking reference.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        // 1. Fetch booking details by ID
        const { data: bookingData } = await api.get(`/api/bookings/${bookingId}`);
        if (!isMounted) return;
        setBooking(bookingData);

        // 2. Fetch associated salon details if available
        if (bookingData.salonId) {
          try {
            const { data: salonData } = await api.get(`/api/salons/${bookingData.salonId}`);
            if (isMounted) setSalon(salonData);
          } catch (err) {
            console.warn("Could not load salon details:", err);
          }
        }

        // 3. Fetch full service offerings
        const serviceIds = bookingData.serviceIds || [];
        if (serviceIds.length > 0) {
          try {
            const serviceResponse = await api
              .get(`/api/service-offering/list/${serviceIds.join(",")}`)
              .catch(() => null);

            if (serviceResponse?.data && isMounted) {
              setServices(serviceResponse.data);
            } else {
              // Fallback: fetch individually
              const results = await Promise.allSettled(
                serviceIds.map((id) => api.get(`/api/service-offering/${id}`))
              );
              if (isMounted) {
                setServices(
                  results
                    .filter((r) => r.status === "fulfilled")
                    .map((r) => r.value.data)
                );
              }
            }
          } catch (err) {
            console.warn("Could not load service details:", err);
          }
        }
      } catch (err) {
        if (!isMounted) return;
        const status = err.response?.status;
        if (status === 403) {
          setError("You are not authorized to view this booking confirmation.");
        } else if (status === 404) {
          setError(`Booking #${bookingId} was not found.`);
        } else {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load booking confirmation details."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBookingDetails();

    return () => {
      isMounted = false;
    };
  }, [bookingId]);

  const handlePrint = () => {
    window.print();
  };

  // Format date and time
  const startTimeObj = booking?.startTime ? new Date(booking.startTime) : null;
  const endTimeObj = booking?.endTime ? new Date(booking.endTime) : null;

  const formattedDate = startTimeObj && !isNaN(startTimeObj.getTime())
    ? startTimeObj.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date unrecorded";

  const formattedTime = startTimeObj && !isNaN(startTimeObj.getTime())
    ? startTimeObj.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }) +
      (endTimeObj && !isNaN(endTimeObj.getTime())
        ? ` - ${endTimeObj.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}`
        : "")
    : "Time unrecorded";

  const totalDuration = services.length
    ? services.reduce((acc, s) => acc + (Number(s.duration) || 0), 0)
    : 0;

  const salonName = salon?.name || booking?.salonName || `Salon #${booking?.salonId || ""}`;
  const salonAddress = salon?.address || booking?.salonAddress || "Address provided at salon";
  const salonImage = salon?.images?.[0] || FALLBACK_SALON_IMAGE;

  // Loading Skeleton State
  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 min-h-[75vh]">
        <div className="space-y-6 animate-pulse">
          <div className="h-28 bg-slate-100 rounded-3xl" />
          <div className="h-64 bg-slate-100 rounded-3xl" />
          <div className="h-48 bg-slate-100 rounded-3xl" />
        </div>
      </main>
    );
  }

  // Error State
  if (error || !booking) {
    return (
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 shadow-2xs">
          <InfoOutlined sx={{ fontSize: 32 }} />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          Booking Information Unavailable
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
          {error || "We could not find the requested booking record."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/bookings"
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            Go to My Bookings
          </Link>
          <Link
            to="/explore"
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
          >
            Explore Salons
          </Link>
        </div>
      </main>
    );
  }

  const isCashOnDelivery =
    booking.paymentMethod === "CASH_ON_DELIVERY" || booking.paymentMethod === "CASH";

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-[80vh] space-y-6 text-left">
      {/* 1. Booking Success Hero Banner */}
      <section className="bg-gradient-to-b from-emerald-50/70 to-white rounded-3xl border border-emerald-200/80 p-6 sm:p-8 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-emerald-100/80 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-600 mx-auto shadow-sm">
          <CheckCircleOutline sx={{ fontSize: 36 }} />
        </div>

        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider font-extrabold text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-300">
            APPOINTMENT CONFIRMED
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Booking Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            {isCashOnDelivery
              ? "Your salon appointment has been successfully booked. You can pay at the salon when you arrive."
              : "Your salon appointment has been successfully booked and confirmed."}
          </p>
        </div>

        {/* Quick Reference Badge Row */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 text-xs">
          <div className="bg-white/90 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs">
            <span className="text-slate-400 font-semibold">Reference:</span>
            <span className="font-mono font-black text-slate-900">#BKG-{booking.id}</span>
          </div>

          <div className="bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-emerald-800 font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Booking: {booking.status || "CONFIRMED"}</span>
          </div>

          {isCashOnDelivery && (
            <div className="bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-amber-800 font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Payment: PENDING (Pay at Salon)</span>
            </div>
          )}
        </div>
      </section>

      {/* 2. Customer & Salon Summary Card */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <StorefrontOutlined sx={{ fontSize: 18 }} className="text-amber-600" />
            <span>Salon & Customer Details</span>
          </h2>
          <span className="text-xs font-semibold text-slate-400">Scheduled Visit</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Salon Info Left */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Salon Location
            </span>
            <h3 className="text-sm font-bold text-slate-900">{salonName}</h3>
            <p className="text-xs text-slate-600 flex items-start gap-1.5">
              <LocationOnOutlined sx={{ fontSize: 16 }} className="text-amber-600 shrink-0 mt-0.5" />
              <span>{salonAddress}</span>
            </p>
          </div>

          {/* Customer Info Right */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Customer Details
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <PersonOutlined sx={{ fontSize: 16 }} className="text-amber-600" />
              <span>{booking.customerName || `Customer #${booking.customerId}`}</span>
            </div>
            {booking.customerEmail && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <EmailOutlined sx={{ fontSize: 14 }} className="text-slate-400" />
                <span className="truncate">{booking.customerEmail}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <PhoneOutlined sx={{ fontSize: 14 }} className="text-slate-400" />
              <span>{booking.customerPhone || "Phone provided at check-in"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Appointment Schedule & Services Breakdown Card */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ContentCutOutlined sx={{ fontSize: 18 }} className="text-amber-600" />
            <span>Appointment Services</span>
          </h2>
          <span className="text-xs font-bold text-slate-500">
            {services.length || booking.serviceIds?.length || 1} Service(s)
          </span>
        </div>

        {/* Schedule Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-amber-50/50 border border-amber-200/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <CalendarTodayOutlined sx={{ fontSize: 18 }} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Appointment Date
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-800">{formattedDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <AccessTimeOutlined sx={{ fontSize: 18 }} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Time & Duration
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                {formattedTime} {totalDuration > 0 ? `(${totalDuration} mins)` : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Services List Table */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Selected Services
          </span>
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/40">
            {services.length > 0 ? (
              services.map((service) => (
                <div
                  key={service.id}
                  className="p-3.5 flex items-start justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-900">{service.name}</p>
                    {service.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-1">{service.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>Stylist: Dedicated Specialist</span>
                      {service.duration && <span>· Duration: {service.duration} mins</span>}
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-900 shrink-0">
                    ₹{Number(service.price || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {booking.serviceName || "Salon Services"}
                  </p>
                  <p className="text-[10px] text-slate-400">Stylist: Dedicated Specialist</p>
                </div>
                <span className="text-xs font-black text-slate-900">
                  ₹{Number(booking.totalPrice || 0).toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Subtotal Breakdown */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Services Subtotal</span>
            <span className="font-semibold text-slate-900">
              ₹{Number(booking.totalPrice || 0).toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Taxes & Convenience Fee</span>
            <span className="text-emerald-700 font-semibold">₹0 (Included)</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-black text-slate-900">
            <span>Total Payable Amount</span>
            <span className="text-base text-amber-700">
              ₹{Number(booking.totalPrice || 0).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </section>

      {/* 4. Payment Information Card */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <PaymentsOutlined sx={{ fontSize: 18 }} className="text-amber-600" />
            <span>Payment Summary</span>
          </h2>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
              isCashOnDelivery
                ? "bg-amber-50 text-amber-800 border-amber-300"
                : "bg-emerald-50 text-emerald-800 border-emerald-300"
            }`}
          >
            {isCashOnDelivery ? "PAYMENT PENDING" : "PAID ONLINE"}
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Payment Method:</span>
            <span className="font-bold text-slate-900">
              {isCashOnDelivery ? "Cash on Delivery (Pay at Salon)" : "Online Payment (Razorpay)"}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Payment Status:</span>
            <span className={`font-bold ${isCashOnDelivery ? "text-amber-700" : "text-emerald-700"}`}>
              {isCashOnDelivery ? "PENDING (Pay at Salon)" : "SUCCESS"}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Amount Due at Salon:</span>
            <span className="text-base font-black text-slate-900">
              ₹{Number(booking.totalPrice || 0).toLocaleString("en-IN")}
            </span>
          </div>

          {isCashOnDelivery && (
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Reference Code:</span>
              <span className="font-mono text-slate-700">COD-{booking.id}</span>
            </div>
          )}

          {/* Payment Instructions Box */}
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-amber-900 text-xs space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <InfoOutlined sx={{ fontSize: 16 }} className="text-amber-600" />
              <span>Payment Instructions</span>
            </p>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              {isCashOnDelivery
                ? "Please pay at the salon after your service is completed. Your appointment slot is guaranteed and fully confirmed with the salon."
                : "Your online payment has been registered. No additional payment is required at the salon."}
            </p>
          </div>
        </div>
      </section>

      {/* 5. Action Buttons (Print-hidden for clean receipt printing) */}
      <section className="print:hidden pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Link
          to="/bookings"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>View My Bookings</span>
          <ArrowForward sx={{ fontSize: 16 }} />
        </Link>

        <div className="w-full sm:w-auto flex items-center gap-3">
          <Link
            to={booking.salonId ? `/salon/${booking.salonId}` : "/explore"}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 font-bold text-xs shadow-2xs inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Explore More Services</span>
          </Link>

          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 font-bold text-xs shadow-2xs inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <PrintOutlined sx={{ fontSize: 16 }} />
            <span>Print Receipt</span>
          </button>
        </div>
      </section>
    </main>
  );
};

export default BookingConfirmation;

