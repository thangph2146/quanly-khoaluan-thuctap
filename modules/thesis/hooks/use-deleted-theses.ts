/**
 * Deleted Theses Hook
 */
import { useState, useEffect, useCallback } from 'react';
import { ThesisService } from '../services/thesis.service';
import type { Thesis, ThesisFilters } from '../types';
import { useDebounce } from '@/hooks/use-debounce';

export function useDeletedTheses(filters: ThesisFilters) {
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(filters.search || "", 500);

  const fetchDeletedTheses = useCallback(async (currentFilters: ThesisFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ThesisService.getDeleted(currentFilters);

      if (response && typeof response === 'object' && 'data' in response) {
        setTheses(response.data);
        setTotal(response.total);
      } else {
        console.error("Received unexpected data format for deleted theses:", response);
        setTheses([]);
        setTotal(0);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách khóa luận đã xóa');
      setTheses([]); // Clear data on error
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeletedTheses({ ...filters, search: debouncedSearch });
  }, [fetchDeletedTheses, filters.page, filters.limit, debouncedSearch]);

  return {
    deletedTheses: theses,
    setDeletedTheses: setTheses, // For optimistic updates
    total,
    isLoading,
    error,
    refetch: () => fetchDeletedTheses({ ...filters, search: debouncedSearch }),
  };
} 