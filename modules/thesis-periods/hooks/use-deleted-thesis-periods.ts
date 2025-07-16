import { useState, useEffect, useCallback } from 'react';
import { ThesisPeriodService } from '../services/thesis-period.service';
import type { ThesisPeriod, ThesisPeriodFilters } from '../types';
import { useDebounce } from '@/hooks/use-debounce';

export function useDeletedThesisPeriods(filters: ThesisPeriodFilters) {
  const [thesisPeriods, setThesisPeriods] = useState<ThesisPeriod[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(filters.search || '', 500);

  const fetchThesisPeriods = useCallback(async (currentFilters: ThesisPeriodFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ThesisPeriodService.getDeleted(currentFilters);
      if (response && typeof response === 'object' && 'data' in response) {
        setThesisPeriods(response.data);
        setTotal(response.total);
      } else {
        setThesisPeriods([]);
        setTotal(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách đợt khóa luận đã xóa');
      setThesisPeriods([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchThesisPeriods({ ...filters, search: debouncedSearch });
  }, [fetchThesisPeriods, filters.page, filters.limit, debouncedSearch]);

  return {
    deletedThesisPeriods: thesisPeriods,
    setDeletedThesisPeriods: setThesisPeriods,
    total,
    isLoading,
    error,
    refetch: () => fetchThesisPeriods({ ...filters, search: debouncedSearch }),
  };
} 