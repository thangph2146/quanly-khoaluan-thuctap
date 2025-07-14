import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { InternshipPeriodService } from '../services/internship-period.service';
import type { InternshipPeriodMutationData } from '../types';

export function useInternshipPeriodActions(onSuccess?: () => void) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const createInternshipPeriod = async (data: InternshipPeriodMutationData) => {
    try {
      setIsCreating(true);
      await InternshipPeriodService.create(data);
      toast({ title: 'Thành công', description: 'Tạo đợt thực tập mới thành công' });
      onSuccess?.();
    } catch (error) {
      toast({ title: 'Lỗi', description: error instanceof Error ? error.message : 'Không thể tạo đợt thực tập mới', variant: 'destructive' });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateInternshipPeriod = async (id: number, data: InternshipPeriodMutationData) => {
    try {
      setIsUpdating(true);
      await InternshipPeriodService.update(id, data);
      toast({ title: 'Thành công', description: 'Cập nhật đợt thực tập thành công' });
      onSuccess?.();
    } catch (error) {
      toast({ title: 'Lỗi', description: error instanceof Error ? error.message : 'Không thể cập nhật đợt thực tập', variant: 'destructive' });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteInternshipPeriod = async (id: number): Promise<boolean> => {
    try {
      setIsDeleting(true);
      await InternshipPeriodService.delete(id);
      toast({ title: 'Thành công', description: 'Xóa đợt thực tập thành công' });
      onSuccess?.();
      return true;
    } catch (error) {
      toast({ title: 'Lỗi', description: error instanceof Error ? error.message : 'Không thể xóa đợt thực tập', variant: 'destructive' });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const softDeleteInternshipPeriods = async (ids: number[]): Promise<boolean> => {
    try {
      setIsDeleting(true);
      await InternshipPeriodService.bulkSoftDelete(ids);
      toast({ title: 'Thành công', description: 'Xóa tạm thời các đợt thực tập thành công.' });
      onSuccess?.();
      return true;
    } catch (error) {
      toast({ title: 'Lỗi', description: error instanceof Error ? error.message : 'Không thể xóa tạm thời các đợt thực tập', variant: 'destructive' });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const permanentDeleteInternshipPeriods = async (ids: number[]): Promise<boolean> => {
    try {
      setIsDeleting(true);
      await InternshipPeriodService.bulkPermanentDelete(ids);
      toast({ title: 'Thành công', description: 'Xóa vĩnh viễn đợt thực tập thành công' });
      onSuccess?.();
      return true;
    } catch (error) {
      toast({ title: 'Lỗi', description: error instanceof Error ? error.message : 'Không thể xóa vĩnh viễn đợt thực tập', variant: 'destructive' });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    createInternshipPeriod,
    updateInternshipPeriod,
    deleteInternshipPeriod,
    softDeleteInternshipPeriods,
    permanentDeleteInternshipPeriods,
    isCreating,
    isUpdating,
    isDeleting,
  };
} 