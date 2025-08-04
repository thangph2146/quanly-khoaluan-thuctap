import React, { useState, useCallback, useEffect } from 'react';
import { InternshipPeriodList } from './InternshipPeriodList';
import { InternshipPeriodForm } from './InternshipPeriodForm';
import { InternshipPeriodDeletedList } from './InternshipPeriodDeletedList';
import { useInternshipPeriods, useInternshipPeriodActions, useDeletedInternshipPeriods } from '../hooks';
import { Button } from '@/components/ui/button';
import { CreateButton } from '@/components/common/ProtectedButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader, Modal } from '@/components/common';
import type { InternshipPeriod, InternshipPeriodMutationData, InternshipPeriodFilters } from '../types';
import { removeInternshipPeriodFromList } from '../utils/internship-period-tree.utils';
import { InternshipPeriodDetails } from './InternshipPeriodDetails';

type ModalState =
  | { type: 'create' }
  | { type: 'edit', internshipPeriod: InternshipPeriod }
  | { type: 'delete', internshipPeriod: InternshipPeriod }
  | { type: 'delete-many', ids: (string | number)[], onSuccess: () => void, permanent?: boolean }
  | { type: 'restore-many', ids: number[], onSuccess: () => void }
  | { type: 'view', internshipPeriod: InternshipPeriod }
  | { type: 'idle' };

export function InternshipPeriodsContainer() {
  const [filters, setFilters] = useState<InternshipPeriodFilters>({ page: 1, limit: 10, search: '' });

  // Active periods state
  const {
    internshipPeriods: activePeriods,
    total: activeTotal,
    isLoading: isLoadingActive,
    refetch: refetchActive,
  } = useInternshipPeriods(filters);

  // Actions
  const {
    createInternshipPeriod,
    updateInternshipPeriod,
    deleteInternshipPeriod,
    isCreating,
    isUpdating,
    isDeleting,
  } = useInternshipPeriodActions(() => {
    refetchActive();
  });

  const [modalState, setModalState] = useState<ModalState>({ type: 'idle' });

  const totalPages = Math.ceil(activeTotal / (filters.limit || 10));

  const filterBar = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div className="flex flex-col space-y-2 justify-between">
        <Label htmlFor="search">Tìm kiếm</Label>
        <div className="flex items-center gap-2">
          <Input
            id="search"
            placeholder="Tìm kiếm đợt thực tập..."
            value={filters.search || ''}
            onChange={(e) => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
            className="flex-grow"
          />
          {filters.search && (
            <Button onClick={() => setFilters(f => ({ ...f, search: '', page: 1 }))}>
              Xóa filter
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  // Modal handlers
  const handleCreate = () => setModalState({ type: 'create' });
  const handleEdit = (internshipPeriod: InternshipPeriod) => setModalState({ type: 'edit', internshipPeriod });
  const handleDelete = (internshipPeriod: InternshipPeriod) => setModalState({ type: 'delete', internshipPeriod });
  const handleView = (internshipPeriod: InternshipPeriod) => setModalState({ type: 'view', internshipPeriod });
  const handleCancel = useCallback(() => setModalState({ type: 'idle' }), []);

  const handleDeleteMany = (ids: (string | number)[], onSuccess: () => void) => {
    setModalState({ type: 'delete-many', ids, onSuccess });
  };

  const handleRestoreMany = (ids: (string | number)[], onSuccess: () => void) => {
    setModalState({ type: 'restore-many', ids: ids as number[], onSuccess });
  };

  const handleCreateSubmit = useCallback(async (data: InternshipPeriodMutationData) => {
    try {
      await createInternshipPeriod(data);
      handleCancel();
    } catch {
      // handle error
    }
  }, [createInternshipPeriod, handleCancel]);

  const handleEditSubmit = useCallback(async (data: InternshipPeriodMutationData) => {
    if (modalState.type !== 'edit') return;
    try {
      await updateInternshipPeriod(modalState.internshipPeriod.id, data);
      handleCancel();
    } catch {
      // handle error
    }
  }, [modalState, updateInternshipPeriod, handleCancel]);

  const handleConfirmDelete = async () => {
    if (modalState.type !== 'delete') return;
    const success = await deleteInternshipPeriod(modalState.internshipPeriod.id);
    if (success) {
      // setActivePeriods((prev: InternshipPeriod[]) => removeInternshipPeriodFromList(prev, modalState.internshipPeriod.id));
      handleCancel();
    }
  };

  const handleConfirmDeleteMany = async () => {
    if (modalState.type !== 'delete-many') return;
    // const success = await softDeleteInternshipPeriods(modalState.ids as number[]);
    // if (success) {
    modalState.onSuccess();
    handleCancel();
    // }
  };

  const handleConfirmRestoreMany = async () => {
    if (modalState.type !== 'restore-many') return;
    // Nếu có bulkRestoreInternshipPeriods, gọi ở đây
    // await bulkRestoreInternshipPeriods(modalState.ids);
    modalState.onSuccess();
    handleCancel();
  };

  const handlePermanentDeleteMany = (ids: (string | number)[], onSuccess: () => void) => {
    setModalState({ type: 'delete-many', ids, onSuccess, permanent: true });
  };

  const handleConfirmPermanentDeleteMany = async () => {
    if (modalState.type !== 'delete-many' || !modalState.permanent) return;
    // const success = await permanentDeleteInternshipPeriods(modalState.ids as number[]);
    // if (success) {
    modalState.onSuccess();
    handleCancel();
    // }
  };

  return (
    <PageHeader
      title="Quản lý đợt thực tập"
      description="Thêm, sửa, xóa và quản lý đợt thực tập trong hệ thống"
      breadcrumbs={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Đợt thực tập', href: '/internship-periods' },
      ]}
      actions={
        <div className="flex gap-2">
          <CreateButton module="InternshipPeriod" onClick={handleCreate} disabled={isCreating}>
            + Thêm đợt thực tập
          </CreateButton>
        </div>
      }
    >
      <InternshipPeriodList
        internshipPeriods={activePeriods}
        isLoading={isLoadingActive}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        filterBar={filterBar}
        page={filters.page}
        totalPages={totalPages}
        onPageChange={(p) => setFilters(f => ({ ...f, page: p }))}
        limit={filters.limit}
        onLimitChange={(l) => setFilters(f => ({ ...f, limit: l, page: 1 }))}
      />

      {/* Create/Edit Modal */}
      <InternshipPeriodForm
        isOpen={modalState.type === 'create' || modalState.type === 'edit'}
        title={modalState.type === 'create' ? 'Tạo đợt thực tập mới' : 'Chỉnh sửa đợt thực tập'}
        internshipPeriod={modalState.type === 'edit' ? modalState.internshipPeriod : undefined}
        onSubmit={modalState.type === 'create' ? handleCreateSubmit : handleEditSubmit}
        onCancel={handleCancel}
        isLoading={isCreating || isUpdating}
        mode={modalState.type === 'create' ? 'create' : 'edit'}
      />

      {/* Details Modal */}
      <InternshipPeriodDetails
        isOpen={modalState.type === 'view'}
        onClose={handleCancel}
        internshipPeriod={modalState.type === 'view' ? modalState.internshipPeriod : null}
      />

      {/* Delete Confirmation Dialog */}
      <Modal
        isOpen={modalState.type === 'delete'}
        onOpenChange={(open) => !open && handleCancel()}
        title="Xác nhận xóa"
      >
        <div>
          <p className="text-sm text-muted-foreground">
            Bạn có chắc chắn muốn xóa đợt thực tập &quot;{modalState.type === 'delete' ? modalState.internshipPeriod.name : ''}&quot;? 
            Hành động này sẽ chuyển mục này vào thùng rác.
          </p>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Soft/Permanent Delete Confirmation */}
      <Modal
        isOpen={modalState.type === 'delete-many'}
        onOpenChange={(open) => !open && handleCancel()}
        title={modalState.type === 'delete-many' && modalState.permanent ? "Xác nhận xóa vĩnh viễn" : "Xác nhận xóa nhiều mục"}
      >
        <div>
          <p className="text-sm text-muted-foreground">
            {modalState.type === 'delete-many' && modalState.permanent
              ? `Bạn có chắc chắn muốn xóa vĩnh viễn ${Array.isArray(modalState.ids) ? modalState.ids.length : 0} mục đã chọn? Hành động này không thể hoàn tác.`
              : `Bạn có chắc chắn muốn xóa ${modalState.type === 'delete-many' && Array.isArray(modalState.ids) ? modalState.ids.length : 0} mục đã chọn? Hành động này sẽ chuyển các mục vào thùng rác.`}
          </p>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={modalState.type === 'delete-many' && modalState.permanent ? handleConfirmPermanentDeleteMany : handleConfirmDeleteMany}
              disabled={isDeleting}
            >
              {isDeleting ? 'Đang xóa...' : 'Xác nhận'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Restore Confirmation */}
      <Modal
        isOpen={modalState.type === 'restore-many'}
        onOpenChange={(open) => !open && handleCancel()}
        title="Xác nhận khôi phục nhiều mục"
      >
        <div>
          <p className="text-sm text-muted-foreground">
            Bạn có chắc chắn muốn khôi phục {modalState.type === 'restore-many' ? modalState.ids.length : 0} mục đã chọn?
          </p>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button
              onClick={handleConfirmRestoreMany}
              disabled={false}
            >
              Khôi phục
            </Button>
          </div>
        </div>
      </Modal>
    </PageHeader>
  );
}