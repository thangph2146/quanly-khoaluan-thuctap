/**
 * Theses Hook
 */
import { useState, useEffect, useCallback } from 'react';
import { ThesisService } from '../services/thesis.service';
import type { Thesis, ThesisFilters } from '../types';
import { useDebounce } from '@/hooks/use-debounce';

export function useTheses(filters: ThesisFilters) {
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const debouncedSearch = useDebounce(filters.search || "", 500);

  const fetchTheses = useCallback(async (currentFilters: ThesisFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ThesisService.getAll(currentFilters);

      if (response && typeof response === 'object' && 'data' in response) {
        setTheses(response.data);
        setTotal(response.total);
      } else {
        console.error("Received unexpected data format for theses:", response);
        setTheses([]);
        setTotal(0);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách khóa luận');
      setTheses([]); // Clear data on error
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTheses({ ...filters, search: debouncedSearch });
  }, [fetchTheses, filters.page, filters.limit, debouncedSearch, filters.submissionDate]);

  return {
    theses,
    setTheses, // For optimistic updates
    total,
    isLoading,
    error,
    refetch: () => fetchTheses({ ...filters, search: debouncedSearch }),
  };
} 