'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { PartnerList } from './PartnerList';
import { PartnerForm } from './PartnerForm';
import { PartnerDeletedList } from './PartnerDeletedList';
import { PartnerDetails } from './PartnerDetails';
import { usePartners, usePartnerActions, useDeletedPartners } from '../hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader, Modal } from '@/components/common';
import type { Partner, PartnerMutationData, PartnerFilters } from '../types';
import { logger } from '@/lib/utils/logger';

type ModalState =
  | { type: 'create' }
  | { type: 'edit'; partner: Partner }
  | { type: 'view'; partner: Partner }
  | { type: 'delete'; partner: Partner }
  | { type: 'delete-many'; ids: (string | number)[] }
  | { type: 'restore-many'; ids: (string | number)[] }
  | { type: 'permanent-delete-many'; ids: (string | number)[] }
  | { type: 'idle' };

export function PartnersContainer() {
  const [showDeleted, setShowDeleted] = useState(false);
  const [filters, setFilters] = useState<PartnerFilters>({ page: 1, limit: 10, search: '' });
  const [modalState, setModalState] = useState<ModalState>({ type: 'idle' });

  const {
    partners: activePartners,
    total: activeTotal,
    isLoading: isLoadingActive,
    refetch: refetchActive,
  } = usePartners(filters);

  const {
    deletedPartners,
    total: deletedTotal,
    isLoading: isLoadingDeleted,
    refetch: refetchDeleted,
  } = useDeletedPartners(filters);

  useEffect(() => {
    setFilters(f => ({ ...f, page: 1 }));
  }, [showDeleted, filters.search]);

  const {
    createPartner,
    updatePartner,
    deletePartner,
    softDeletePartners,
    restorePartners,
    permanentDeletePartners,
    isCreating,
    isUpdating,
    isDeleting,
    isRestoring,
  } = usePartnerActions(() => {
    refetchActive();
    refetchDeleted();
    setModalState({ type: 'idle' });
  });

  const totalPages = Math.ceil((showDeleted ? deletedTotal : activeTotal) / (filters.limit || 10));

  const handleCreate = () => setModalState({ type: 'create' });
  const handleEdit = (partner: Partner) => setModalState({ type: 'edit', partner });
  const handleView = (partner: Partner) => setModalState({ type: 'view', partner });
  const handleDelete = (partner: Partner) => setModalState({ type: 'delete', partner });
  const handleCancel = useCallback(() => setModalState({ type: 'idle' }), []);
  const handleSubmit = useCallback(async (data: PartnerMutationData) => {
    try {
      if (modalState.type === 'edit') {
        await updatePartner(modalState.partner.id, data);
      } else {
        await createPartner(data);
      }
    } catch (error) {
      logger.error('Failed to save partner', error);
      // The hook will show a toast, no need to show another one here
    }
  }, [modalState, createPartner, updatePartner]);

  const handleDeleteMany = (ids: (string | number)[]) => {
    setModalState({ type: 'delete-many', ids });
  };

  const handleRestoreMany = (ids: (string | number)[]) => {
    setModalState({ type: 'restore-many', ids });
  };

  const handlePermanentDeleteMany = (ids: (string | number)[]) => {
    setModalState({ type: 'permanent-delete-many', ids });
  };
  
  const FilterBar = (
    <div className="flex items-center justify-between">
        <Input
          placeholder="Tìm kiếm đối tác..."
          value={filters.search || ''}
          onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
          className="max-w-sm"
        />
    </div>
  );

  return (
    <PageHeader
      title="Quản lý Đối tác"
      description="Quản lý thông tin các đối tác của khoa."
      breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Đối tác', href: '/partners' }]}
      actions={
        <div className="flex gap-2">
          <Button onClick={handleCreate}>+ Thêm đối tác</Button>
          <Button variant={showDeleted ? 'default' : 'outline'} onClick={() => setShowDeleted(v => !v)}>
            {showDeleted ? 'Danh sách hoạt động' : 'Xem thùng rác'}
          </Button>
        </div>
      }
    >
      {showDeleted ? (
        <PartnerDeletedList
          partners={deletedPartners}
          isLoading={isLoadingDeleted}
          onRestore={handleRestoreMany}
          onPermanentDelete={handlePermanentDeleteMany}
          page={filters.page || 1}
          totalPages={totalPages}
          onPageChange={(p) => setFilters(f => ({ ...f, page: p }))}
          limit={filters.limit || 10}
          onLimitChange={(l) => setFilters(f => ({ ...f, limit: l, page: 1 }))}
          filterBar={FilterBar}
        />
      ) : (
        <PartnerList
          partners={activePartners}
          isLoading={isLoadingActive}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          onDeleteMany={handleDeleteMany}
          page={filters.page || 1}
          totalPages={totalPages}
          onPageChange={(p) => setFilters(f => ({ ...f, page: p }))}
          limit={filters.limit || 10}
          onLimitChange={(l) => setFilters(f => ({ ...f, limit: l, page: 1 }))}
          filterBar={FilterBar}
        />
      )}

      <PartnerForm
        isOpen={modalState.type === 'create' || modalState.type === 'edit'}
        mode={modalState.type === 'create' ? 'create' : 'edit'}
        partner={modalState.type === 'edit' ? modalState.partner : null}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isCreating || isUpdating}
      />
      
      <PartnerDetails 
        isOpen={modalState.type === 'view'}
        onClose={handleCancel}
        partner={modalState.type === 'view' ? modalState.partner : null}
      />

      <Modal
        isOpen={modalState.type === 'delete'}
        onOpenChange={handleCancel}
        title="Xác nhận xóa"
        className="sm:max-w-md"
      >
        <div className="p-4">
            <p>Bạn có chắc chắn muốn xóa đối tác <strong>{modalState.type === 'delete' && modalState.partner.name}</strong> không?</p>
            <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleCancel} disabled={isDeleting}>Hủy</Button>
                <Button variant="destructive" onClick={() => modalState.type === 'delete' && deletePartner(modalState.partner.id)} disabled={isDeleting}>
                    {isDeleting ? 'Đang xóa...' : 'Xác nhận'}
                </Button>
            </div>
        </div>
      </Modal>

      {/* Soft Delete Confirmation */}
      <Modal
        isOpen={modalState.type === 'delete-many'}
        onOpenChange={handleCancel}
        title="Xác nhận xóa"
        className="sm:max-w-md"
      >
        <div className="p-4">
            <p>Bạn có chắc chắn muốn xóa <strong>{modalState.type === 'delete-many' && modalState.ids.length}</strong> đối tác này không?</p>
            <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleCancel} disabled={isDeleting}>Hủy</Button>
                <Button variant="destructive" onClick={() => modalState.type === 'delete-many' && softDeletePartners(modalState.ids as number[])} disabled={isDeleting}>
                    {isDeleting ? 'Đang xóa...' : 'Xác nhận'}
                </Button>
            </div>
        </div>
      </Modal>

      {/* Restore Confirmation */}
      <Modal
        isOpen={modalState.type === 'restore-many'}
        onOpenChange={handleCancel}
        title="Xác nhận khôi phục"
        className="sm:max-w-md"
      >
        <div className="p-4">
            <p>Bạn có chắc chắn muốn khôi phục <strong>{modalState.type === 'restore-many' && modalState.ids.length}</strong> đối tác này không?</p>
            <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleCancel} disabled={isRestoring}>Hủy</Button>
                <Button onClick={() => modalState.type === 'restore-many' && restorePartners(modalState.ids as number[])} disabled={isRestoring}>
                    {isRestoring ? 'Đang khôi phục...' : 'Xác nhận'}
                </Button>
            </div>
        </div>
      </Modal>

      {/* Permanent Delete Confirmation */}
      <Modal
        isOpen={modalState.type === 'permanent-delete-many'}
        onOpenChange={handleCancel}
        title="Xác nhận xóa vĩnh viễn"
        className="sm:max-w-md"
      >
        <div className="p-4">
            <p>Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa vĩnh viễn <strong>{modalState.type === 'permanent-delete-many' && modalState.ids.length}</strong> đối tác này không?</p>
            <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleCancel} disabled={isDeleting}>Hủy</Button>
                <Button variant="destructive" onClick={() => modalState.type === 'permanent-delete-many' && permanentDeletePartners(modalState.ids as number[])} disabled={isDeleting}>
                    {isDeleting ? 'Đang xóa...' : 'Xác nhận xóa vĩnh viễn'}
                </Button>
            </div>
        </div>
      </Modal>
    </PageHeader>
  );
} 