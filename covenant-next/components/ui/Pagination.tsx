'use client';

import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className={styles.pagination}>
      <span className={styles.info}>
        {startItem}-{endItem} of {totalItems}
      </span>
      <div className={styles.controls}>
        <button
          className={styles.arrow}
          onClick={handlePrev}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          ❮
        </button>
        <button
          className={styles.arrow}
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          ❯
        </button>
      </div>
    </div>
  );
}
