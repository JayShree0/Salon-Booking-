import React, { useState } from "react";
import CategoryTables from "./CategoryTable";
import CategoryForm from "./CategoryForm";
import { CategoryOutlined, AddCircleOutlineOutlined } from "@mui/icons-material";

const Catergory = () => {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="space-y-6">
      {/* 1. Header with Breadcrumb and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Categories Management
          </h1>
          <p className="text-xs text-slate-500">
            Organize services into clear categories for simple customer browsing
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="inline-flex p-1 bg-white rounded-xl border border-slate-200/90 shadow-2xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab(1)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 1
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CategoryOutlined sx={{ fontSize: 16 }} />
            <span>All Categories</span>
          </button>

          <button
            onClick={() => setActiveTab(2)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 2
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <AddCircleOutlineOutlined sx={{ fontSize: 16 }} className={activeTab === 2 ? "text-amber-400" : ""} />
            <span>Create Category</span>
          </button>
        </div>
      </div>

      {/* 2. Active Tab Content View */}
      <div className="pt-2">
        {activeTab === 1 ? (
          <CategoryTables />
        ) : (
          <CategoryForm onCreated={() => setActiveTab(1)} />
        )}
      </div>
    </div>
  );
};

export default Catergory;
