import React, { useEffect, useState } from "react";
import ProfileFieldcard from "./ProfileFieldcard";
import { Button, Divider, TextField } from "@mui/material";
import api from "../../config/api";

const Profile = () => {
  const [owner, setOwner] = useState(null);
  const [salon, setSalon] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phoneNumber: "", address: "", city: "", openTime: "09:00", closeTime: "18:00", images: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: user } = await api.get("/api/users/profile");
        setOwner(user);
        try {
          const { data } = await api.get("/api/salons/owner");
          setSalon(data);
          setForm({
            name: data.name || "",
            email: data.email || user.email || "",
            phoneNumber: data.phoneNumber || "",
            address: data.address || "",
            city: data.city || "",
            openTime: String(data.openTime || "09:00").slice(0, 5),
            closeTime: String(data.closeTime || "18:00").slice(0, 5),
            images: (data.images || []).join("\n"),
          });
        } catch (requestError) {
          setError(requestError.response?.data?.message || "Create your salon profile to start taking bookings.");
          setForm((current) => ({ ...current, email: user.email || "" }));
        }
      } catch (requestError) {
        setError(requestError.response?.data?.message || requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const saveSalon = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    const salonDetails = {
      ...form,
      images: form.images.split("\n").map((image) => image.trim()).filter(Boolean),
    };

    try {
      const response = salon
        ? await api.put(`/api/salons/${salon.id}`, salonDetails)
        : await api.post("/api/salons", salonDetails);
      setSalon(response.data);
      setMessage(salon ? "Salon details updated." : "Salon profile created.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading salon profile...</p>;

  return (
    <div className="max-w-3xl space-y-8">
      <section>
        <h1 className="text-3xl font-bold pb-3">Owner details</h1>
        {owner && <>
          <ProfileFieldcard keys="Name" value={owner.fullName} />
          <Divider />
          <ProfileFieldcard keys="Email" value={owner.email} />
          <Divider />
          <ProfileFieldcard keys="Role" value={owner.role} />
        </>}
      </section>

      <section>
        <h2 className="text-2xl font-bold pb-3">{salon ? "Salon details" : "Create salon profile"}</h2>
        {error && <p role="alert" className="mb-4 text-red-700">{error}</p>}
        {message && <p role="status" className="mb-4 text-green-700">{message}</p>}
        <form onSubmit={saveSalon} className="grid gap-4 sm:grid-cols-2">
          <TextField name="name" label="Salon name" value={form.name} onChange={handleChange} required />
          <TextField name="email" label="Contact email" type="email" value={form.email} onChange={handleChange} required />
          <TextField name="phoneNumber" label="Phone number" value={form.phoneNumber} onChange={handleChange} required />
          <TextField name="city" label="City" value={form.city} onChange={handleChange} required />
          <TextField className="sm:col-span-2" name="address" label="Address" value={form.address} onChange={handleChange} required />
          <TextField name="openTime" label="Opening time" type="time" value={form.openTime} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
          <TextField name="closeTime" label="Closing time" type="time" value={form.closeTime} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
          <TextField className="sm:col-span-2" name="images" label="Image URLs (one per line)" multiline minRows={3} value={form.images} onChange={handleChange} />
          <div className="sm:col-span-2"><Button type="submit" variant="contained" disabled={saving}>{saving ? "Saving..." : salon ? "Save salon details" : "Create salon"}</Button></div>
        </form>
      </section>
    </div>
  );
};

export default Profile;
