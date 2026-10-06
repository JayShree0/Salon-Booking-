import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TextField, InputAdornment, Rating, Chip, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SalonCard from "../Salon/SalonCard";
import { SalonCardSkeleton } from "../../components/common/SkeletonCard";
import EmptyState from "../../components/common/EmptyState";
import { fetchSalons } from "../../Redux/Salon/action";
import { services } from "../../Data/services";

const ExploreSalons = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { salons, loading } = useSelector((state) => state.salon);

  const initialCity = searchParams.get("city") || "";
  const initialCategory = searchParams.get("category") || "";

  const [searchTerm, setSearchTerm] = useState(initialCity);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("all");

  useEffect(() => {
    dispatch(fetchSalons());
  }, [dispatch]);

  // Keep state synced with URL params
  useEffect(() => {
    if (initialCity) setSearchTerm(initialCity);
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCity, initialCategory]);

  // Filter salons locally
  const filteredSalons = salons.filter((salon) => {
    const matchSearch =
      !searchTerm ||
      salon.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.address?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRating = !minRating || (salon.rating && Number(salon.rating) >= minRating);

    return matchSearch && matchRating;
  });

  // Sort
  const sortedSalons = [...filteredSalons].sort((a, b) => {
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
    return 0;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setMinRating(0);
    setSortBy("all");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page Header */}
        <div className="mb-8 space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-amber-600">
            Discovery Directory
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Verified Salons
          </h1>
          <p className="text-slate-500 text-sm">
            Find the premier salon, spa, or barbershop matching your personal preferences.
          </p>
        </div>

        {/* Content Grid: Left Filter / Right Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <FilterListIcon sx={{ fontSize: 18 }} className="text-amber-600" />
                <span>Filters</span>
              </h3>
              {(searchTerm || selectedCategory || minRating > 0 || sortBy !== "all") && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-amber-600 hover:underline font-semibold"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Search</label>
              <TextField
                fullWidth
                size="small"
                placeholder="Salon name or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Categories</label>
              <div className="flex flex-wrap gap-1.5">
                <Chip
                  label="All"
                  clickable
                  color={!selectedCategory ? "primary" : "default"}
                  variant={!selectedCategory ? "filled" : "outlined"}
                  size="small"
                  onClick={() => setSelectedCategory("")}
                />
                {services.map((cat) => (
                  <Chip
                    key={cat.id}
                    label={cat.name}
                    clickable
                    color={selectedCategory === cat.name ? "primary" : "default"}
                    variant={selectedCategory === cat.name ? "filled" : "outlined"}
                    size="small"
                    onClick={() =>
                      setSelectedCategory(selectedCategory === cat.name ? "" : cat.name)
                    }
                  />
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Minimum Rating</label>
              <div className="flex items-center gap-2">
                <Rating
                  value={minRating}
                  onChange={(_, val) => setMinRating(val || 0)}
                  precision={1}
                />
                <span className="text-xs text-slate-500">{minRating > 0 ? `${minRating}+ Stars` : "Any"}</span>
              </div>
            </div>

            {/* Sort Order */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-amber-500"
              >
                <option value="all">Default (Recommended)</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Showing <strong>{sortedSalons.length}</strong> available salons</span>
              {searchTerm && <span>Filtered by "{searchTerm}"</span>}
            </div>

            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <SalonCardSkeleton key={i} />
                ))}
              </div>
            )}

            {!loading && sortedSalons.length === 0 && (
              <EmptyState
                icon="✂️"
                title="No Matching Salons Found"
                description="We couldn't find any salons matching your search criteria. Try removing some filters or search for another city."
                actionText="Reset All Filters"
                onAction={clearFilters}
              />
            )}

            {!loading && sortedSalons.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedSalons.map((salon) => (
                  <SalonCard key={salon.id} item={salon} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreSalons;

