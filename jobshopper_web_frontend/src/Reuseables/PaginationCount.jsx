import React from "react";

const PaginationCount = ({ page, handlePageChange, totalPages }) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const totalVisiblePages = 5; // Show 5 pages before and after current

    // Add "First" button
    if (page > 1) {
      pageNumbers.push(
        <button
          key="first"
          onClick={() => handlePageChange(1)}
          className="px-2 py-1 border rounded-md mx-1"
        >
          First
        </button>
      );
    }

    // Add ellipsis (...) before the current range if necessary
    if (page > totalVisiblePages) {
      pageNumbers.push(<span key="start-ellipsis">...</span>);
    }

    // Show the pages around the current page
    for (
      let i = Math.max(1, page - totalVisiblePages);
      i <= Math.min(totalPages, page + totalVisiblePages);
      i++
    ) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-2 py-1 border rounded-md  text-xs ${
            i === page ? "bg-btn-primary text-white" : "bg-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }

    // Add ellipsis (...) after the current range if necessary
    if (page + totalVisiblePages < totalPages) {
      pageNumbers.push(<span key="end-ellipsis">...</span>);
    }

    // Add "Last" button
    if (page < totalPages) {
      pageNumbers.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          className="px-2 py-1 border rounded-md mx-1"
        >
          Last
        </button>
      );
    }

    return pageNumbers;
  };

  return <div>{renderPageNumbers()}</div>;
};

export default PaginationCount;
