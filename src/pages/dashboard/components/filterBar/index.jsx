import React, { useState } from "react";

function FilterBar({ selectedFilter = "today", setSelectedFilter }) {
  const filters = [
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "year", label: "This Year" },
    { key: "last_30_days", label: "Last 30 Days" },
    { key: "last_90_days", label: "Last 90 Days" },
    // { key: "custom", label: "Custom" },
  ];
  return (
    <div className="my-4 sticky overflow-x-auto no-scrollbar">
      <div className="flex gap-3 w-max px-1">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter.key)}
            className={`
              whitespace-nowrap
              rounded-full
              px-4
              py-2
              text-xs
              transition-all
              duration-200
              ${
                selectedFilter == filter.key
                  ? "bg-black text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }
            `}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterBar;
