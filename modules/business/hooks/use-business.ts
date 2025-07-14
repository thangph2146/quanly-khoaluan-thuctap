/**
 * Businesses Hook
 */
import { useState, useEffect, useCallback } from 'react';
import { BusinessService } from '../services/business.service';
import type { Business, BusinessFilters } from '../types';
import { useDebounce } from '@/hooks/use-debounce';

export function useBusinesses(filters: BusinessFilters) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(filters.search || '', 500);

  const fetchBusinesses = useCallback(async (currentFilters: BusinessFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await BusinessService.getAll(currentFilters);
      if (response && typeof response === 'object' && 'data' in response) {
        setBusinesses(response.data);
        setTotal(response.total);
      } else {
        console.error('Received unexpected data format for businesses:', response);
        setBusinesses([]);
        setTotal(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách business');
      setBusinesses([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusinesses({ ...filters, search: debouncedSearch });
  }, [fetchBusinesses, filters.page, filters.limit, debouncedSearch]);

  return {
    businesses,
    setBusinesses,
    total,
    isLoading,
    error,
    refetch: () => fetchBusinesses({ ...filters, search: debouncedSearch }),
  };
}
