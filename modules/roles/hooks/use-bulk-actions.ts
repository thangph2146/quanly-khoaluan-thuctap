import { useState } from 'react';
import { RoleService } from '../services';
import { useToast } from '@/components/ui/use-toast';

type BulkAction = 'softDelete' | 'restore' | 'permanentDelete';

export function useBulkRoleActions(onSuccess?: (ids: number[], action: BulkAction) => void) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    const executeBulkAction = async (ids: number[], action: BulkAction) => {
        setIsLoading(true);
        try {
            let successMessage = '';
            switch (action) {
                case 'softDelete':
                    await RoleService.bulkSoftDelete(ids);
                    successMessage = `Đã xóa tạm thời ${ids.length} vai trò.`;
                    break;
                case 'restore':
                    await RoleService.bulkRestore(ids);
                    successMessage = `Đã khôi phục ${ids.length} vai trò.`;
                    break;
                case 'permanentDelete':
                    await RoleService.bulkPermanentDelete(ids);
                    successMessage = `Đã xóa vĩnh viễn ${ids.length} vai trò.`;
                    break;
                default:
                    throw new Error('Hành động không hợp lệ');
            }
            
            toast({
                title: 'Thành công',
                description: successMessage,
            });
            onSuccess?.(ids, action);
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: error instanceof Error ? error.message : `Không thể thực hiện hành động hàng loạt.`,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        executeBulkAction,
        isLoading,
    };
} 