import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
 

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}) {
  // 🔹 Generate visible pages with ellipsis
  const getPages = React.useCallback(() => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }

    return pages;
  }, [currentPage, totalPages]);

  const pages = getPages();


  const handleChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <div className="flex items-center justify-center flex-wrap gap-1  select-none">
     
      <button
        aria-label="Previous Page"
        disabled={currentPage === 1}
        onClick={() => handleChange(currentPage - 1)}
        className="p-3 cursor-pointer rounded-full hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

     
      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => handleChange(p)}
            className={`w-10 h-10 rounded-full  cursor-pointer flex items-center justify-center text-sm transition ${
              p === currentPage
                ? " border border-main text-main font-medium shadow-sm"
                : "text-gray-800 hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        )
      )}

 
      <button
        aria-label="Next Page"
        disabled={currentPage === totalPages}
        onClick={() => handleChange(currentPage + 1)}
        className="p-3 rounded-full  cursor-pointer  hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
