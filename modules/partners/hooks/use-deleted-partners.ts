import { useState, useEffect, useCallback } from 'react';
import { PartnerService } from '../services/partner.service';
import type { Partner, PartnerFilters } from '../types';
import { useDebounce } from '@/hooks/use-debounce';

export function useDeletedPartners(filters: PartnerFilters) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(filters.search || '', 500);

  const fetchDeletedPartners = useCallback(async (currentFilters: PartnerFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await PartnerService.getDeleted(currentFilters);

      if (response && typeof response === 'object' && 'data' in response) {
        setPartners(response.data);
        setTotal(response.total);
      } else {
        console.error('Received unexpected data format for deleted partners:', response);
        setPartners([]);
        setTotal(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách đối tác đã xóa');
      setPartners([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeletedPartners({ ...filters, search: debouncedSearch });
  }, [fetchDeletedPartners, filters.page, filters.limit, debouncedSearch]);

  return {
    deletedPartners: partners,
    setDeletedPartners: setPartners,
    total,
    isLoading,
    error,
    refetch: () => fetchDeletedPartners({ ...filters, search: debouncedSearch }),
  };
} 