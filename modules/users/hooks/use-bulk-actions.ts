import { useState } from 'react';
import { UserService } from '../services';
import { useToast } from '@/components/ui/use-toast';

type BulkAction = 'softDelete' | 'restore' | 'permanentDelete';

export function useBulkUserActions(onSuccess?: () => void) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    const executeBulkAction = async (ids: number[], action: BulkAction) => {
        setIsLoading(true);
        try {
            let successMessage = '';
            switch (action) {
                case 'softDelete':
                    await UserService.bulkSoftDelete(ids);
                    successMessage = `Đã xóa tạm thời ${ids.length} người dùng.`;
                    break;
                case 'restore':
                    await UserService.bulkRestore(ids);
                    successMessage = `Đã khôi phục ${ids.length} người dùng.`;
                    break;
                case 'permanentDelete':
                    successMessage = await UserService.bulkPermanentDelete(ids);
                    break;
                default:
                    throw new Error('Hành động không hợp lệ');
            }
            
            toast({
                title: 'Thành công',
                description: successMessage,
            });
            onSuccess?.();
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