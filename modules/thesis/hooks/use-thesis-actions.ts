/**
 * Thesis Actions Hook
 */
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ThesisService } from '../services/thesis.service';
import type { ThesisMutationData } from '../types';

export function useThesisActions(onSuccess?: () => void) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const { toast } = useToast();

  const createThesis = async (data: ThesisMutationData) => {
    try {
      setIsCreating(true);
      await ThesisService.create(data);
      toast({
        title: 'Thành công',
        description: 'Tạo khóa luận mới thành công',
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể tạo khóa luận mới',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateThesis = async (id: number, data: ThesisMutationData) => {
    try {
      setIsUpdating(true);
      await ThesisService.update(id, data);
      toast({
        title: 'Thành công',
        description: 'Cập nhật khóa luận thành công',
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể cập nhật khóa luận',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteThesis = async (id: number): Promise<boolean> => {
    try {
      setIsDeleting(true);
      await ThesisService.delete(id);
      toast({
        title: 'Thành công',
        description: 'Xóa khóa luận thành công',
      });
      onSuccess?.();
      return true;
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa khóa luận',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const softDeleteTheses = async (ids: number[]): Promise<boolean> => {
    try {
      setIsDeleting(true);
      await ThesisService.bulkSoftDelete(ids);
      toast({
        title: 'Thành công',
        description: 'Xóa tạm thời các khóa luận thành công.',
      });
      onSuccess?.();
      return true;
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa tạm thời các khóa luận',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const restoreTheses = async (ids: number[]): Promise<boolean> => {
    try {
      setIsRestoring(true);
      await ThesisService.bulkRestore(ids);
      toast({
        title: 'Thành công',
        description: 'Khôi phục khóa luận thành công',
      });
      onSuccess?.();
      return true;
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể khôi phục khóa luận',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsRestoring(false);
    }
  };

  const permanentDeleteTheses = async (ids: number[]): Promise<boolean> => {
    try {
      setIsDeleting(true);
      await ThesisService.bulkPermanentDelete(ids);
      toast({
        title: 'Thành công',
        description: 'Xóa vĩnh viễn khóa luận thành công',
      });
      onSuccess?.();
      return true;
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa vĩnh viễn khóa luận',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    createThesis,
    updateThesis,
    deleteThesis,
    softDeleteTheses,
    restoreTheses,
    permanentDeleteTheses,
    isCreating,
    isUpdating,
    isDeleting,
    isRestoring,
  };
} 