import React from "react";

const CategoryCard = ({ category, selected, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-2.5 cursor-pointer flex gap-3 items-center w-full text-left rounded-xl transition-all duration-200 ${
        selected
          ? "bg-amber-600 text-white shadow-sm font-bold"
          : "hover:bg-slate-100 text-slate-700 font-medium"
      }`}
    >
      <img
        className="w-12 h-12 object-cover rounded-xl shrink-0 shadow-2xs"
        src={category.image || "https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=300"}
        alt={category.name}
      />
      <span className="text-sm tracking-tight truncate">{category.name}</span>
    </button>
  );
};

export default CategoryCard;
