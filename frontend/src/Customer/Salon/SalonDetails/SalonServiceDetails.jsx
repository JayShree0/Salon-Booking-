import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import ServiceCard from "./ServiceCard";
import { Button, Divider, MenuItem, Select, TextField } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import SelectedServiceList from "./SelectedServiceList";
import api from "../../../config/api";

const formatDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const SalonServiceDetails = () => {
  const { id: salonId } = useParams();
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [date, setDate] = useState(formatDate(new Date()));
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get(`/api/salons/${salonId}`),
      api.get(`/api/categories/salon/${salonId}`),
      api.get(`/api/service-offering/salon/${salonId}`),
    ])
      .then(([salonResponse, categoryResponse, serviceResponse]) => {
        setSalon(salonResponse.data);
        setCategories(categoryResponse.data || []);
        setServices(serviceResponse.data || []);
      })
      .catch((requestError) => setError(requestError.response?.data?.message || requestError.message))
      .finally(() => setLoading(false));
  }, [salonId]);

  useEffect(() => {
    if (!date) return;

    api.get(`/api/bookings/slots/salon/${salonId}/date/${date}`, { params: { date } })
      .then(({ data }) => setSlots(data || []))
      .catch((requestError) => setError(requestError.response?.data?.message || requestError.message));
  }, [date, salonId]);

  const chosenServices = services.filter((service) => selectedServices.includes(service.id));
  const filteredServices = selectedCategory === "all"
    ? services
    : services.filter((service) => String(service.categoryId) === String(selectedCategory));
  const totalPrice = chosenServices.reduce((total, service) => total + Number(service.price || 0), 0);
  const totalDuration = chosenServices.reduce((total, service) => total + Number(service.duration || 0), 0);

  const toMinutes = (value) => {
    const time = String(value || "00:00").split("T").pop().slice(0, 5);
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const openingTime = toMinutes(salon?.openTime || "09:00");
  const closingTime = toMinutes(salon?.closeTime || "18:00");
  const availableTimes = [];
  for (let time = openingTime; time + Math.max(totalDuration, 30) <= closingTime; time += 30) {
    const isBooked = slots.some((slot) => {
      const slotStart = toMinutes(slot.startTime);
      const slotEnd = toMinutes(slot.endTime);
      return time < slotEnd && time + Math.max(totalDuration, 30) > slotStart;
    });
    if (!isBooked) {
      availableTimes.push(`${String(Math.floor(time / 60)).padStart(2, "0")}:${String(time % 60).padStart(2, "0")}`);
    }
  }

  const toggleService = (serviceId) => {
    setSelectedServices((current) => current.includes(serviceId)
      ? current.filter((id) => id !== serviceId)
      : [...current, serviceId]);
  };

  const bookAppointment = async () => {
    if (!localStorage.getItem("jwt")) {
      setError("Please sign in before booking an appointment.");
      return;
    }
    if (!chosenServices.length || !selectedTime) {
      setError("Choose a service and an available time first.");
      return;
    }

    const startMinutes = toMinutes(selectedTime);
    const endMinutes = startMinutes + Math.max(totalDuration, 30);
    const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}:00`;
    setBooking(true);
    setError("");

    try {
      const { data } = await api.post("/api/bookings", {
        startTime: `${date}T${selectedTime}:00`,
        endTime: `${date}T${endTime}`,
        serviceIds: chosenServices.map((service) => Number(service.id)),
      }, { params: { salonId, paymentMethod } });

      if (data.payment_link_url) {
        window.location.assign(data.payment_link_url);
      } else {
        navigate("/bookings");
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <p className="py-8 text-gray-600">Loading services...</p>;
  if (error && !salon) return <p role="alert" className="py-8 text-red-700">Unable to load services: {error}</p>;

  return (
    <div className="lg:flex gap-5 h-[90vh] mt-10">
      <section className="space-y-5 border-r lg:w-[25%] pr-5">
        <CategoryCard category={{ id: "all", name: "All services" }} selected={selectedCategory === "all"} onClick={() => setSelectedCategory("all")} />
        {categories.map((category) => <CategoryCard key={category.id} category={category} selected={selectedCategory === category.id} onClick={() => setSelectedCategory(category.id)} />)}
      </section>

      <section className="space-y-2 lg:w-[50%] px-5 lg:px-20 overflow-y-auto">
        {error && <p role="alert" className="text-red-700">{error}</p>}
        {filteredServices.length === 0 && <p className="py-8 text-gray-600">No services are available in this category.</p>}
        {filteredServices.map((service) => (
          <div key={service.id} className="space-y-4">
            <ServiceCard service={service} selected={selectedServices.includes(service.id)} onToggle={() => toggleService(service.id)} />
            <Divider />
          </div>
        ))}
      </section>

      <section className="lg:w-[25%]">
        <div>
            <div className="flex items-center gap-2">
              <ShoppingCart
                sx={{
                  fontSize: "30px",
                  color: "green",
                }}
              />
              <h1 className="font-thin text-sm">Selected Services</h1>
                
               
            
            </div>
            <SelectedServiceList services={chosenServices} onRemove={toggleService} />
            <p className="flex justify-between py-2 font-semibold"><span>Total ({totalDuration} mins)</span><span>₹{totalPrice}</span></p>
            <TextField type="date" label="Appointment date" fullWidth InputLabelProps={{ shrink: true }} inputProps={{ min: formatDate(new Date()) }} value={date} onChange={(event) => { setDate(event.target.value); setSelectedTime(""); }} />
            <p className="pt-4 pb-2 font-semibold">Available times</p>
            <div className="grid grid-cols-3 gap-2">
              {availableTimes.map((time) => <Button key={time} size="small" variant={selectedTime === time ? "contained" : "outlined"} onClick={() => setSelectedTime(time)}>{time}</Button>)}
            </div>
            {chosenServices.length > 0 && availableTimes.length === 0 && <p className="py-2 text-sm text-gray-600">No times available. Try another date.</p>}
            <Select fullWidth className="mt-4" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
              <MenuItem value="RAZORPAY">Razorpay</MenuItem>
              <MenuItem value="STRIPE">Stripe</MenuItem>
            </Select>
            <Button sx={{ py: ".7rem", mt: 2 }} fullWidth variant="contained" disabled={booking || !selectedTime || !chosenServices.length} onClick={bookAppointment}>
              {booking ? "Creating booking..." : "Continue to payment"}
            </Button>
            {!localStorage.getItem("jwt") && <p className="pt-2 text-sm text-gray-600">Sign in from the top menu to book.</p>}
        </div>
      </section>
    </div>
  );
};

export default SalonServiceDetails;
