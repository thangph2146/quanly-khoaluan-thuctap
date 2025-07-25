import { useState, useEffect, useCallback } from 'react';
import { PartnerService } from '../services/partner.service';
import type { Partner, PartnerFilters } from '../types';
import { useDebounce } from '@/hooks/use-debounce';

export function usePartners(filters: PartnerFilters) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(filters.search || '', 500);

  const fetchPartners = useCallback(async (currentFilters: PartnerFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await PartnerService.getAll(currentFilters);

      if (response && typeof response === 'object' && 'data' in response) {
        setPartners(response.data);
        setTotal(response.total);
      } else {
        console.error('Received unexpected data format for partners:', response);
        setPartners([]);
        setTotal(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách đối tác');
      setPartners([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPartners({ ...filters, search: debouncedSearch });
  }, [fetchPartners, filters.page, filters.limit, debouncedSearch]);

  return {
    partners,
    setPartners,
    total,
    isLoading,
    error,
    refetch: () => fetchPartners({ ...filters, search: debouncedSearch }),
  };
} 