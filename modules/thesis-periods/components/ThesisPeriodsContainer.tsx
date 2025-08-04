import React, { useState, useCallback, useEffect } from 'react';
import { ThesisPeriodList } from './ThesisPeriodList';
import { ThesisPeriodForm } from './ThesisPeriodForm';
import { ThesisPeriodDeletedList } from './ThesisPeriodDeletedList';
import { useThesisPeriods, useThesisPeriodActions, useDeletedThesisPeriods } from '../hooks';
import { Button } from '@/components/ui/button';
import { CreateButton } from '@/components/common/ProtectedButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader, Modal } from '@/components/common';
import type { ThesisPeriod, ThesisPeriodMutationData, ThesisPeriodFilters } from '../types';
import { removeThesisPeriodFromList } from '../utils/thesis-period-tree.utils';
import { ThesisPeriodDetails } from './ThesisPeriodDetails';

type ModalState =
  | { type: 'create' }
  | { type: 'edit', thesisPeriod: ThesisPeriod }
  | { type: 'delete', thesisPeriod: ThesisPeriod }
  | { type: 'view', thesisPeriod: ThesisPeriod }
  | { type: 'idle' };

export function ThesisPeriodsContainer() {
  const [filters, setFilters] = useState<ThesisPeriodFilters>({ page: 1, limit: 10, search: '' });

  // Active periods state
  const {
    thesisPeriods: activePeriods,
    setThesisPeriods: setActivePeriods,
    total: activeTotal,
    isLoading: isLoadingActive,
    refetch: refetchActive,
  } = useThesisPeriods(filters);

  // Actions
  const {
    createThesisPeriod,
    updateThesisPeriod,
    deleteThesisPeriod,
    isCreating,
    isUpdating,
    isDeleting,
  } = useThesisPeriodActions(() => {
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
            placeholder="Tìm kiếm đợt khóa luận..."
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
  const handleEdit = (thesisPeriod: ThesisPeriod) => setModalState({ type: 'edit', thesisPeriod });
  const handleDelete = (thesisPeriod: ThesisPeriod) => setModalState({ type: 'delete', thesisPeriod });
  const handleView = (thesisPeriod: ThesisPeriod) => setModalState({ type: 'view', thesisPeriod });
  const handleCancel = useCallback(() => setModalState({ type: 'idle' }), []);



  const handleCreateSubmit = useCallback(async (data: ThesisPeriodMutationData) => {
    try {
      await createThesisPeriod(data);
      handleCancel();
    } catch {
      // handle error
    }
  }, [createThesisPeriod, handleCancel]);

  const handleEditSubmit = useCallback(async (data: ThesisPeriodMutationData) => {
    if (modalState.type !== 'edit') return;
    try {
      await updateThesisPeriod(modalState.thesisPeriod.id, data);
      handleCancel();
    } catch {
      // handle error
    }
  }, [modalState, updateThesisPeriod, handleCancel]);

  const handleConfirmDelete = async () => {
    if (modalState.type !== 'delete') return;
    const success = await deleteThesisPeriod(modalState.thesisPeriod.id);
    if (success) {
      setActivePeriods((prev: ThesisPeriod[]) => removeThesisPeriodFromList(prev, modalState.thesisPeriod.id));
      handleCancel();
    }
  };



  return (
    <PageHeader
      title="Quản lý đợt khóa luận"
      description="Thêm, sửa, xóa và quản lý các đợt khóa luận trong hệ thống"
      breadcrumbs={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Đợt khóa luận', href: '/thesis-periods' },
      ]}
      actions={
        <div className="flex gap-2">
          <CreateButton module="ThesisPeriod" onClick={handleCreate} disabled={isCreating}>
            + Thêm đợt khóa luận
          </CreateButton>
        </div>
      }
    >
      <ThesisPeriodList
        thesisPeriods={activePeriods}
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
      <ThesisPeriodForm
        isOpen={modalState.type === 'create' || modalState.type === 'edit'}
        title={modalState.type === 'create' ? 'Tạo đợt khóa luận mới' : 'Chỉnh sửa đợt khóa luận'}
        thesisPeriod={modalState.type === 'edit' ? modalState.thesisPeriod : undefined}
        onSubmit={modalState.type === 'create' ? handleCreateSubmit : handleEditSubmit}
        onCancel={handleCancel}
        isLoading={isCreating || isUpdating}
        mode={modalState.type === 'create' ? 'create' : 'edit'}
      />

      {/* Details Modal */}
      <ThesisPeriodDetails
        isOpen={modalState.type === 'view'}
        onClose={handleCancel}
        thesisPeriod={modalState.type === 'view' ? modalState.thesisPeriod : null}
      />

      {/* Delete Confirmation Dialog */}
      <Modal
        isOpen={modalState.type === 'delete'}
        onOpenChange={(open) => !open && handleCancel()}
        title="Xác nhận xóa"
      >
        <div>
          <p className="text-sm text-muted-foreground">
            Bạn có chắc chắn muốn xóa đợt khóa luận &quot;{modalState.type === 'delete' ? modalState.thesisPeriod.name : ''}&quot;?
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


    </PageHeader>
  );
} 