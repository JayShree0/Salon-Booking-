import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import SalonDetail from "./SalonDetail";
import SalonServiceDetails from "./SalonServiceDetails";
import Review from "../../Review/Review";
import CreateReviewForm from "../../Review/CreateReviewForm";
import api from "../../../config/api";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const SalonDetails = () => {
  const { id } = useParams();
  const [salon, setSalon] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("services");

  const loadSalonData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");

    try {
      const [salonRes, reviewsRes] = await Promise.allSettled([
        api.get(`/api/salons/${id}`),
        api.get(`/api/reviews/salon/${id}`),
      ]);

      if (salonRes.status === "fulfilled") {
        setSalon(salonRes.value.data);
        if (salonRes.value.data?.name) {
          document.title = `${salonRes.value.data.name} | Salon Booking`;
        }
      } else {
        setError(salonRes.reason?.response?.data?.message || salonRes.reason?.message || "Failed to load salon.");
      }

      if (reviewsRes.status === "fulfilled") {
        setReviews(reviewsRes.value.data || []);
      } else {
        setReviews([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load salon.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setActiveTab("services");
    window.scrollTo({ top: 0, behavior: "smooth" });
    loadSalonData();
  }, [id, loadSalonData]);

  const handleScrollToCategories = () => {
    setActiveTab("services");
    setTimeout(() => {
      const el = document.getElementById("salon-categories-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleReviewCreated = () => {
    loadSalonData();
    setActiveTab("reviews");
  };

  const TABS = [
    {
      id: "services",
      label: "Services & Booking",
      icon: <ContentCutOutlinedIcon sx={{ fontSize: 17 }} />,
    },
    {
      id: "reviews",
      label: reviews.length > 0 ? `Client Reviews (${reviews.length})` : "Client Reviews",
      icon: <StarOutlineRoundedIcon sx={{ fontSize: 18 }} />,
    },
    {
      id: "create_review",
      label: "Write a Review",
      icon: <RateReviewOutlinedIcon sx={{ fontSize: 17 }} />,
    },
  ];

  if (error && !salon) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-rose-50 border border-rose-200 text-rose-800 space-y-4">
          <h2 className="font-bold text-lg">Unable to Find Salon</h2>
          <p className="text-xs text-rose-600">{error}</p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} />
            <span>Explore Other Salons</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 1. Breadcrumbs Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-4 select-none">
        <Link to="/" className="hover:text-slate-700 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/explore" className="hover:text-slate-700 transition-colors">
          Explore Salons
        </Link>
        <span>/</span>
        <span className="text-amber-700 font-bold truncate max-w-xs sm:max-w-none">
          {salon?.name || "Salon Details"}
        </span>
      </nav>

      {/* 2. Salon Media Header & Key Info */}
      <SalonDetail
        salon={salon}
        reviews={reviews}
        loading={loading}
        error={error}
        onScrollToCategories={handleScrollToCategories}
      />

      {/* 3. Brand Luxury Segmented Navigation Tabs */}
      <div className="my-6 border-b border-slate-200/90 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer select-none ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-102"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200/70"
                }`}
              >
                <span className={isActive ? "text-amber-400" : "text-slate-500"}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Tab Content Panels */}
      <div>
        {activeTab === "create_review" && (
          <div className="py-4">
            <CreateReviewForm
              onReviewCreated={handleReviewCreated}
            />
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="py-2">
            <Review
              reviews={reviews}
              onOpenWriteReview={() => setActiveTab("create_review")}
            />
          </div>
        )}

        {activeTab === "services" && (
          <div>
            <SalonServiceDetails salon={salon} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SalonDetails;
