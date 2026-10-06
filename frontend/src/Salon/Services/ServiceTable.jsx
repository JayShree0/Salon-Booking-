import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from "@mui/material";
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
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function ServiceTables() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [salonId, setSalonId] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", duration: "", categoryId: "", image: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadServices = async () => {
      try {
        const [serviceResponse, salonResponse] = await Promise.all([
          api.get("/api/service-offering/salon-owner"),
          api.get("/api/salons/owner"),
        ]);
        setServices(serviceResponse.data || []);
        setSalonId(salonResponse.data.id);
        const { data } = await api.get(`/api/categories/salon/${salonResponse.data.id}`);
        setCategories(data || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const openEditor = (service) => {
    setEditingService(service);
    setForm({
      name: service.name || "",
      description: service.description || "",
      price: service.price ?? "",
      duration: service.duration ?? "",
      categoryId: service.categoryId ?? "",
      image: service.image || "",
    });
  };

  const saveService = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        duration: Number(form.duration),
        categoryId: Number(form.categoryId),
        salonId,
      };
      const { data } = await api.put(`/api/service-offering/salon-owner/${editingService.id}`, payload);
      setServices((current) => current.map((service) => service.id === data.id ? data : service));
      setEditingService(null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-3 pb-5">
        <h1 className="font-bold text-2xl">Services</h1>
        <Button component={Link} to="/salon-dashboard/add-services" variant="contained">Add service</Button>
      </div>
      {loading && <p className="py-4">Loading services...</p>}
      {error && <p role="alert" className="py-4 text-red-700">{error}</p>}
      {!loading && !error && services.length === 0 && <p className="py-4">No services added yet.</p>}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="salon services">
          <TableHead>
            <TableRow>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell align="right">Price</StyledTableCell>
              <StyledTableCell align="right">Duration</StyledTableCell>
              <StyledTableCell align="right">Category</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <StyledTableRow key={service.id}>
                <StyledTableCell component="th" scope="row">
                  <div className="flex gap-1 flex-wrap">
                    <img
                      className="w-20 rounded-md"
                      src={service.image || "https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=300"}
                      alt={service.name}
                    />
                  </div>
                </StyledTableCell>
                <StyledTableCell>{service.name}<p className="text-sm text-gray-500">{service.description}</p></StyledTableCell>
                <StyledTableCell align="right">₹{service.price}</StyledTableCell>
                <StyledTableCell align="right">{service.duration} min</StyledTableCell>
                <StyledTableCell align="right">{categories.find((category) => category.id === service.categoryId)?.name || "-"}</StyledTableCell>
                <StyledTableCell align="right"><button onClick={() => openEditor(service)}>Edit</button></StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={Boolean(editingService)} onClose={() => setEditingService(null)} fullWidth maxWidth="sm">
        <DialogTitle>Edit service</DialogTitle>
        <DialogContent className="space-y-4">
          <TextField fullWidth margin="dense" label="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <TextField fullWidth multiline minRows={2} margin="dense" label="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          <TextField fullWidth type="number" margin="dense" label="Price" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
          <TextField fullWidth type="number" margin="dense" label="Duration in minutes" value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} />
          <TextField fullWidth margin="dense" label="Image URL" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} />
          <TextField fullWidth select margin="dense" label="Category" value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}>
            {categories.map((category) => <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingService(null)}>Cancel</Button>
          <Button onClick={saveService} variant="contained" disabled={saving}>{saving ? "Saving..." : "Save changes"}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}