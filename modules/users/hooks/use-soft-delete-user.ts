import { useState } from 'react';
import { UserService } from '../services';

export function useSoftDeleteUser() {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const softDeleteUser = async (id: number) => {
        try {
            setIsDeleting(true);
            setError(null);
            await UserService.softDelete(id);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not delete user');
            throw err;
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        softDeleteUser,
        isDeleting,
        error,
    };
} 