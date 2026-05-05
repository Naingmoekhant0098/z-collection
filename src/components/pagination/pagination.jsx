import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "../../components/ui/pagination";
export default function CustomPagination({ currentPage, totalPages, onPageChange }) {
  
  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

     
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

     
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <Pagination className="md:justify-end w-full mb-4">
      <PaginationContent className="gap-1">
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={`rounded-lg transition-all ${
              currentPage === 1 
                ? "pointer-events-none opacity-40" 
                : "hover:bg-slate-100 cursor-pointer"
            }`}
          />
        </PaginationItem>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => (
          <PaginationItem key={index}>
            {page === "..." ? (
              <PaginationEllipsis className="text-slate-400" />
            ) : (
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page);
                }}
                isActive={currentPage === page}
                className={`cursor-pointer rounded-lg h-9 w-9 flex items-center justify-center transition-all ${
                  currentPage === page 
                    ? "bg-pink-500 text-white hover:bg-pink-600 hover:text-white border-none shadow-sm" 
                    : "hover:bg-slate-100 text-slate-600 border-none"
                }`}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            className={`rounded-lg transition-all ${
              currentPage === totalPages 
                ? "pointer-events-none opacity-40" 
                : "hover:bg-slate-100 cursor-pointer"
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}