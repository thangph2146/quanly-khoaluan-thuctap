import { useState, useEffect, useCallback } from 'react';
import { InternshipPeriodService } from '../services/internship-period.service';
import type { InternshipPeriod, InternshipPeriodFilters } from '../types';
import { useDebounce } from '@/hooks/use-debounce';

export function useInternshipPeriods(filters: InternshipPeriodFilters) {
  const [internshipPeriods, setInternshipPeriods] = useState<InternshipPeriod[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(filters.search || '', 500);

  const fetchInternshipPeriods = useCallback(async (currentFilters: InternshipPeriodFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await InternshipPeriodService.getAll(currentFilters);
      if (response && typeof response === 'object' && 'data' in response) {
        setInternshipPeriods(response.data);
        setTotal(response.total);
      } else {
        setInternshipPeriods([]);
        setTotal(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách đợt thực tập');
      setInternshipPeriods([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInternshipPeriods({ ...filters, search: debouncedSearch });
  }, [fetchInternshipPeriods, filters.page, filters.limit, debouncedSearch]);

  return {
    internshipPeriods,
    setInternshipPeriods,
    total,
    isLoading,
    error,
    refetch: () => fetchInternshipPeriods({ ...filters, search: debouncedSearch }),
  };
} 