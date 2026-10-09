import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import ServiceCard from "./ServiceCard";
import SelectedServiceList from "./SelectedServiceList";
import api from "../../../config/api";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import CircularProgress from "@mui/material/CircularProgress";

const formatDate = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

const SalonServiceDetails = ({ salon: propSalon }) => {
  const { id: salonId } = useParams();
  const navigate = useNavigate();
  const servicesScrollRef = useRef(null);

  const [salon, setSalon] = useState(propSalon || null);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState(formatDate(new Date()));
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  const userRole = localStorage.getItem("role") || "";
  const isSalonOwner = Boolean(localStorage.getItem("jwt")) && (userRole === "SALON_OWNER" || userRole === "ROLE_SALON_OWNER");

  useEffect(() => {
    if (propSalon) setSalon(propSalon);
  }, [propSalon]);

  // 1. Initial Data Fetching
  useEffect(() => {
    setLoading(true);
    const requests = [
      api.get(`/api/categories/salon/${salonId}`),
      api.get(`/api/service-offering/salon/${salonId}`),
    ];
    if (!propSalon) {
      requests.push(api.get(`/api/salons/${salonId}`));
    }

    Promise.allSettled(requests)
      .then(([categoryRes, serviceRes, salonRes]) => {
        if (categoryRes.status === "fulfilled") {
          setCategories(categoryRes.value.data || []);
        }

        if (serviceRes.status === "fulfilled") {
          setServices(serviceRes.value.data || []);
        }

        if (salonRes && salonRes.status === "fulfilled") {
          setSalon(salonRes.value.data);
        }
      })
      .catch((requestError) =>
        setError(requestError.response?.data?.message || requestError.message)
      )
      .finally(() => setLoading(false));
  }, [salonId]);

  // 2. Slots Fetching for selected date
  useEffect(() => {
    if (!date || !salonId) return;

    api
      .get(`/api/bookings/slots/salon/${salonId}/date/${date}`, { params: { date } })
      .then(({ data }) => setSlots(data || []))
      .catch(() => setSlots([]));
  }, [date, salonId]);

  // 3. Compute Service Counts per Category
  const categoryCounts = useMemo(() => {
    const counts = { all: services.length };
    services.forEach((s) => {
      if (s.categoryId) {
        counts[s.categoryId] = (counts[s.categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [services]);

  // 4. Filter Services by Category and Search Query
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchCategory =
        selectedCategory === "all" ||
        String(service.categoryId) === String(selectedCategory);

      const matchSearch =
        !searchQuery.trim() ||
        service.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  // 5. Selected Services & Totals
  const chosenServices = useMemo(() => {
    return services.filter((service) => selectedServices.includes(service.id));
  }, [services, selectedServices]);

  const totalPrice = useMemo(() => {
    return chosenServices.reduce((total, service) => total + Number(service.price || 0), 0);
  }, [chosenServices]);

  const totalDuration = useMemo(() => {
    return chosenServices.reduce((total, service) => total + Number(service.duration || 0), 0);
  }, [chosenServices]);

  // 6. Calculate Available Time Slots
  const toMinutes = (value) => {
    const time = String(value || "00:00").split("T").pop().slice(0, 5);
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const openingTime = toMinutes(salon?.openTime || "09:00");
  const closingTime = toMinutes(salon?.closeTime || "21:00");

  const availableTimes = useMemo(() => {
    const times = [];
    const step = 30; // 30-min intervals
    const requiredDuration = Math.max(totalDuration, 30);

    for (let time = openingTime; time + requiredDuration <= closingTime; time += step) {
      const isBooked = slots.some((slot) => {
        const slotStart = toMinutes(slot.startTime);
        const slotEnd = toMinutes(slot.endTime);
        return time < slotEnd && time + requiredDuration > slotStart;
      });

      if (!isBooked) {
        times.push(
          `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(time % 60).padStart(2, "0")}`
        );
      }
    }
    return times;
  }, [openingTime, closingTime, totalDuration, slots]);

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    if (servicesScrollRef.current) {
      servicesScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleService = (serviceId) => {
    setSelectedServices((current) =>
      current.includes(serviceId)
        ? current.filter((id) => id !== serviceId)
        : [...current, serviceId]
    );
  };

  // 7. Booking Submission
  const bookAppointment = async () => {
    if (!localStorage.getItem("jwt")) {
      setError("Please sign in before booking an appointment.");
      window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { mode: "login" } }));
      return;
    }
    if (!chosenServices.length || !selectedTime) {
      setError("Please choose a service and an available appointment time.");
      return;
    }

    const startMinutes = toMinutes(selectedTime);
    const endMinutes = startMinutes + Math.max(totalDuration, 30);
    const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, "0")}:${String(
      endMinutes % 60
    ).padStart(2, "0")}:00`;

    setBooking(true);
    setError("");

    try {
      const { data } = await api.post(
        "/api/bookings",
        {
          startTime: `${date}T${selectedTime}:00`,
          endTime: `${date}T${endTime}`,
          serviceIds: chosenServices.map((service) => Number(service.id)),
        },
        { params: { salonId, paymentMethod } }
      );

      if (data?.payment_link_url) {
        window.location.assign(data.payment_link_url);
      } else {
        navigate("/bookings");
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Failed to create appointment.");
    } finally {
      setBooking(false);
    }
  };

  const activeCategoryObj = useMemo(() => {
    if (selectedCategory === "all") return { name: "All Services", id: "all" };
    return categories.find((c) => String(c.id) === String(selectedCategory)) || { name: "Services", id: selectedCategory };
  }, [categories, selectedCategory]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4 text-center">
        <CircularProgress sx={{ color: "#d97706" }} size={42} thickness={4} />
        <p className="text-sm font-semibold text-slate-600">Loading salon services and catalog...</p>
      </div>
    );
  }

  return (
    <div id="salon-categories-section" className="space-y-6 mt-4 pb-12 scroll-mt-24">
      {/* Mobile Sticky Horizontal Categories Bar (< lg) */}
      <div className="lg:hidden sticky top-20 z-20 bg-white/95 backdrop-blur-md -mx-4 sm:-mx-6 px-4 sm:px-6 py-2.5 border-b border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          <button
            type="button"
            onClick={() => handleSelectCategory("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All ({categoryCounts.all || 0})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                String(selectedCategory) === String(cat.id)
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                String(selectedCategory) === String(cat.id) ? "bg-amber-400 text-slate-950 font-extrabold" : "bg-slate-200 text-slate-600"
              }`}>
                {categoryCounts[cat.id] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main 3-Column Independent Desktop Layout (lg:) */}
      <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start">
        {/* Column 1: Desktop Fixed Sticky Category Sidebar */}
        <aside className="hidden lg:block lg:w-64 xl:w-72 shrink-0 sticky top-24 self-start max-h-[calc(100vh-7.5rem)] overflow-y-auto no-scrollbar space-y-3 p-1">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-200/80">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <StorefrontOutlinedIcon sx={{ fontSize: 16 }} className="text-amber-600" />
              <span>Service Categories</span>
            </h3>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              {categories.length + 1}
            </span>
          </div>

          <div className="space-y-1.5">
            <CategoryCard
              category={{ id: "all", name: "All Services" }}
              selected={selectedCategory === "all"}
              count={categoryCounts.all || 0}
              onClick={() => handleSelectCategory("all")}
            />
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                selected={String(selectedCategory) === String(category.id)}
                count={categoryCounts[category.id] || 0}
                onClick={() => handleSelectCategory(category.id)}
              />
            ))}
          </div>
        </aside>

        {/* Column 2: Independent Scrollable Services Center Section */}
        <main
          ref={servicesScrollRef}
          className="flex-1 min-w-0 w-full space-y-4 lg:max-h-[calc(100vh-7.5rem)] lg:overflow-y-auto pr-0 lg:pr-2"
        >
          {/* Header of Active Category with Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <h2 className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                  {activeCategoryObj.name}
                </h2>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {filteredServices.length} {filteredServices.length === 1 ? "service" : "services"}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Choose one or more treatments to create your customized session.
              </p>
            </div>

            {/* Quick in-catalog Search Bar */}
            <div className="relative sm:w-60">
              <SearchOutlinedIcon
                sx={{ fontSize: 18 }}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search treatments..."
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Service Cards List */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {filteredServices.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-slate-200/80 p-8">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <AutoAwesomeOutlinedIcon sx={{ fontSize: 26 }} />
              </div>
              <h3 className="font-bold text-base text-slate-800">
                No services available
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchQuery
                  ? `No services matched "${searchQuery}". Try a different keyword.`
                  : "No services are currently listed in this category."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-300 font-bold text-xs hover:bg-amber-100 transition-colors cursor-pointer"
              >
                <span>View All Services</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  selected={selectedServices.includes(service.id)}
                  onToggle={() => toggleService(service.id)}
                  isSalonOwner={isSalonOwner}
                />
              ))}
            </div>
          )}
        </main>

        {/* Column 3: Fixed Sticky Booking Drawer & Appointment Selector (or Partner Notice for Salon Owners) */}
        {isSalonOwner ? (
          <aside className="w-full lg:w-80 xl:w-88 shrink-0 sticky top-24 self-start space-y-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm text-left">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <StorefrontOutlinedIcon sx={{ fontSize: 18 }} />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                Partner Portal Notice
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <AutoAwesomeOutlinedIcon sx={{ fontSize: 15 }} className="text-amber-600" />
                <span>Partner Account Active</span>
              </div>
              <p className="text-[11px] text-amber-800/90 leading-relaxed">
                You are currently signed in with a <strong>Salon Partner</strong> account. You can explore public salons, categories, and services, but salon owners cannot book customer appointments using a partner account.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <p className="text-[11px] text-slate-500">
                Need to manage treatments, pricing, or appointments for your own salon?
              </p>
              <button
                type="button"
                onClick={() => navigate("/salon-dashboard")}
                className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                <StorefrontOutlinedIcon sx={{ fontSize: 16 }} />
                <span>Go to Salon Dashboard</span>
              </button>
            </div>
          </aside>
        ) : (
          <aside className="w-full lg:w-80 xl:w-88 shrink-0 sticky top-24 self-start max-h-[calc(100vh-7.5rem)] overflow-y-auto no-scrollbar space-y-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                Appointment Summary
              </h3>
            </div>
            {chosenServices.length > 0 && (
              <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {chosenServices.length} {chosenServices.length === 1 ? "Item" : "Items"}
              </span>
            )}
          </div>

          {/* Selected Services Itemized List */}
          <SelectedServiceList
            services={chosenServices}
            onRemove={toggleService}
          />

          {/* Combined Duration & Total Price */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span className="flex items-center gap-1 font-medium">
                <AccessTimeOutlinedIcon sx={{ fontSize: 14 }} className="text-slate-400" />
                Combined Duration:
              </span>
              <span className="font-bold text-slate-800">{totalDuration} mins</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
              <span className="text-xs font-bold text-slate-900">Total Payable:</span>
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* 1. Date Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} className="text-amber-600" />
              <span>Select Date</span>
            </label>
            <input
              type="date"
              min={formatDate(new Date())}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setSelectedTime("");
              }}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all cursor-pointer"
            />
          </div>

          {/* 2. Available Time Slots Grid */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <AccessTimeOutlinedIcon sx={{ fontSize: 14 }} className="text-amber-600" />
                <span>Available Times</span>
              </label>
              {selectedTime && (
                <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {selectedTime}
                </span>
              )}
            </div>

            {chosenServices.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic py-2 text-center bg-slate-50 rounded-xl">
                Select a treatment above to view matching slots.
              </p>
            ) : availableTimes.length === 0 ? (
              <p className="text-[11px] text-rose-600 font-medium py-2.5 px-3 bg-rose-50 rounded-xl border border-rose-100 text-center">
                No slots open for this duration. Try another date.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
                {availableTimes.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`h-8 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs scale-102"
                          : "bg-white text-slate-700 border-slate-200 hover:border-amber-400 hover:bg-amber-50/50"
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Payment Method */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <PaymentOutlinedIcon sx={{ fontSize: 14 }} className="text-amber-600" />
              <span>Payment Gateway</span>
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:border-amber-500 focus:outline-none cursor-pointer"
            >
              <option value="RAZORPAY">Razorpay (Cards, UPI, NetBanking)</option>
              <option value="STRIPE">Stripe (International Credit Cards)</option>
            </select>
          </div>

          {/* 4. Action Button */}
          <div className="pt-2">
            {!localStorage.getItem("jwt") ? (
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("open-auth-modal", { detail: { mode: "login" } })
                  )
                }
                className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-amber-600/25 active:scale-95 transition-all cursor-pointer"
              >
                <LoginOutlinedIcon sx={{ fontSize: 16 }} />
                <span>Sign In to Reserve</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={booking || !selectedTime || !chosenServices.length}
                onClick={bookAppointment}
                className={`w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 ${
                  booking || !selectedTime || !chosenServices.length
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-amber-600/25 cursor-pointer"
                }`}
              >
                {booking ? (
                  <>
                    <CircularProgress size={16} sx={{ color: "white" }} />
                    <span>Confirming Booking...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Payment</span>
                    <ArrowForwardIcon sx={{ fontSize: 15 }} />
                  </>
                )}
              </button>
            )}

            {!localStorage.getItem("jwt") && (
              <p className="text-[10px] text-center text-slate-400 mt-2">
                Authentication required to guarantee your slot reservation.
              </p>
            )}
          </div>
        </aside>
      )}
      </div>
    </div>
  );
};

export default SalonServiceDetails;
