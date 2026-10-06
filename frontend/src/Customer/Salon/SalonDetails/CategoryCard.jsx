import React from "react";

const CategoryCard = ({ category, selected, onClick }) => {
  return (
    <button onClick={onClick} className={`px-3 py-2 cursor-pointer flex gap-2 items-center w-full text-left ${selected ? "bg-green-500 text-white rounded-md" : ""}`}>
      <img
        className="w-14 h-14 object-cover rounded-full"
        src={category.image || "https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=300"}
        alt=""
      />
      <span>{category.name}</span>
    </button>
  );
};

export default CategoryCard;
