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
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function CategoryTables() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data: salon } = await api.get("/api/salons/owner");
        const { data } = await api.get(`/api/categories/salon/${salon.id}`);
        setCategories(data || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const deleteCategory = async (categoryId) => {
    try {
      await api.delete(`/api/categories/salon-owner/${categoryId}`);
      setCategories((current) => current.filter((category) => category.id !== categoryId));
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    }
  };

  return (
    <>
      {loading && <p className="py-4">Loading categories...</p>}
      {error && <p role="alert" className="py-4 text-red-700">{error}</p>}
      {!loading && !error && categories.length === 0 && <p className="py-4">No categories found.</p>}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="salon categories">
          <TableHead>
            <TableRow>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <StyledTableRow key={category.id}>
                <StyledTableCell component="th" scope="row">
                  <div className="flex gap-1 flex-wrap">
                    <img
                      className="w-20 rounded-md"
                      src={category.image || "https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=300"}
                      alt={category.name}
                    />
                  </div>
                </StyledTableCell>
                <StyledTableCell>{category.name}</StyledTableCell>
                <StyledTableCell align="right">
                  <button className="text-red-700" onClick={() => deleteCategory(category.id)}>Delete</button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
