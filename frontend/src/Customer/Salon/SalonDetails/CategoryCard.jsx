import React from "react";

const CategoryCard = ({ handleCategoryClick, selectedCategory, item }) => {
  return (
    <div
      onClick={handleCategoryClick}
      className={`px-3 py-2 cursor-pointer flex gap-2 items-center
    ${selectedCategory===item ?" bg-green-500 text-white rounded-md":""}`}
    >
      <img
        className="w-14 h-14 object-cover rounded-full"
        src="https://images.unsplash.com/photo-1684868265714-fd2300637c23?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnJpZGFsJTIwbWFrZXVwfGVufDB8fDB8fHww"
        alt=""
      />
      <h1>Bridal Makeup</h1>
    </div>
  );
};

export default CategoryCard;
