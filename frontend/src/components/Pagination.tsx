import React from 'react';

interface PaginationProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, itemsPerPage, totalItems, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleFirst = () => {
    if (currentPage !== 1) {
      onPageChange(1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleLast = () => {
    if (currentPage !== totalPages) {
      onPageChange(totalPages);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button onClick={handleFirst} disabled={currentPage === 1}>
        第一页
      </button>
      <button onClick={handlePrevious} disabled={currentPage === 1}>
        上一页
      </button>
      <span>
        第 {currentPage} 页 / 共 {totalPages} 页
      </span>
      <button onClick={handleNext} disabled={currentPage === totalPages}>
        下一页
      </button>
      <button onClick={handleLast} disabled={currentPage === totalPages}>
        最后一页
      </button>
    </div>
  );
};

export default Pagination;