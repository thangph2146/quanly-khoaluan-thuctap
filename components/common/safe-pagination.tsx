import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

interface SafePaginationProps {
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function SafePagination({ page, totalPages, onPageChange }: SafePaginationProps) {
  // Ensure safe values
  const safePage = Math.max(1, page || 1);
  const safeTotalPages = Math.max(0, totalPages || 0);
  
  // Don't render if no valid pages or no change handler
  if (safeTotalPages <= 0 || !onPageChange || !Number.isFinite(safeTotalPages)) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (safePage > 1) onPageChange(safePage - 1);
            }}
            className={safePage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
        {Array.from({ length: safeTotalPages }, (_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i + 1);
              }}
              isActive={safePage === i + 1}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (safePage < safeTotalPages) onPageChange(safePage + 1);
            }}
            className={safePage === safeTotalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
} 