/**
 * Business Container Component
 * Manages state and actions for businesses
 */
'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useBusinesses, useBusinessActions } from '../hooks';
import { flattenBusinesses } from '../utils/business-tree.utils';
import { BusinessList } from './BusinessList';
import { BusinessForm } from './BusinessForm';
import { BusinessDetails } from './BusinessDetails';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { CreateButton } from '@/components/common/ProtectedButton';
import { Modal } from '@/components/common';
import type { Business, BusinessFilters, BusinessMutationData } from '../types';
import { logger } from '@/lib/utils/logger';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// Định nghĩa ModalState giống departments
export type ModalState =
  | { type: 'create' }
  | { type: 'edit', business: Business }
  | { type: 'delete', business: Business }
  | { type: 'delete-many', ids: (string | number)[], onSuccess: () => void, permanent?: boolean }
  | { type: 'restore-many', ids: number[], onSuccess: () => void }
  | { type: 'view', business: Business }
  | { type: 'idle' };

export function BusinessContainer() {
  const [filters, setFilters] = useState<BusinessFilters>({ page: 1, limit: 10, search: '' });

  // Active businesses state
  const {
    businesses: activeBusinesses,
    total: activeTotal,
    isLoading: isLoadingActive,
    refetch: refetchActive,
  } = useBusinesses(filters);

  // Actions
  const {
    createBusiness,
    updateBusiness,
    deleteBusiness,
    isCreating,
    isUpdating,
    isDeleting,
  } = useBusinessActions(() => {
    refetchActive();
  });

  // Modal state
  const [modalState, setModalState] = useState<ModalState>({ type: 'idle' });

  const allBusinessesForForm = useMemo(() => flattenBusinesses(activeBusinesses), [activeBusinesses]);
  const totalPages = Math.ceil(activeTotal / (filters.limit || 10));

  // Map lại dữ liệu để đảm bảo đủ trường cho FE
  const safeActiveBusinesses = (activeBusinesses || []).map(b => ({
    ...b
  }));

  // filterBar giống departments
  const filterBar = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div className="flex flex-col space-y-2 justify-between">
        <Label htmlFor="search">Tìm kiếm</Label>
        <div className="flex items-center gap-2">
          <Input
            id="search"
            placeholder="Tìm kiếm business..."
            value={filters.search || ''}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))
            }
            className="flex-grow"
          />
          {filters.search && (
            <Button
              onClick={() =>
                setFilters((f) => ({ ...f, search: '', page: 1 }))
              }
            >
              Xóa filter
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  // Handlers
  const handleCreate = () => setModalState({ type: 'create' });
  const handleEdit = (business: Business) => setModalState({ type: 'edit', business });
  const handleDelete = (business: Business) => setModalState({ type: 'delete', business });
  const handleView = (business: Business) => setModalState({ type: 'view', business });
  const handleCancel = useCallback(() => setModalState({ type: 'idle' }), []);

  const handleDeleteMany = (ids: (string | number)[], onSuccess: () => void) => {
    setModalState({ type: 'delete-many', ids, onSuccess });
  };
  const handleRestoreMany = (ids: (string | number)[], onSuccess: () => void) => {
    setModalState({ type: 'restore-many', ids: ids.map(Number), onSuccess });
  };
  const handlePermanentDeleteMany = (ids: (string | number)[], onSuccess: () => void) => {
    setModalState({ type: 'delete-many', ids, onSuccess, permanent: true });
  };

  // Submit handlers có try/catch giống departments
  const handleCreateSubmit = useCallback(async (data: BusinessMutationData) => {
    try {
      await createBusiness(data);
      handleCancel();
    } catch (error) {
      logger.error('Failed to create business', error);
    }
  }, [createBusiness, handleCancel]);

  const handleEditSubmit = useCallback(async (data: BusinessMutationData) => {
    if (modalState.type !== 'edit') return;
    try {
      await updateBusiness(modalState.business.id, data);
      handleCancel();
    } catch (error) {
      logger.error('Failed to update business', error);
    }
  }, [modalState, updateBusiness, handleCancel]);

  const handleConfirmDelete = async () => {
    if (modalState.type !== 'delete') return;
    try {
      await deleteBusiness(modalState.business.id);
      handleCancel();
    } catch (error) {
      logger.error('Failed to delete business', error);
    }
  };

  const handleConfirmDeleteMany = async () => {
    if (modalState.type !== 'delete-many') return;
    try {
      if (modalState.permanent) {
        // await permanentDeleteBusinesses(modalState.ids.map(Number)); // This line was removed
      } else {
        // await softDeleteBusinesses(modalState.ids.map(Number)); // This line was removed
      }
      modalState.onSuccess();
      handleCancel();
    } catch (error) {
      logger.error('Failed to delete many businesses', error);
    }
  };

  const handleConfirmRestoreMany = async () => {
    if (modalState.type !== 'restore-many') return;
    try {
      // await restoreBusinesses(modalState.ids.map(Number)); // This line was removed
      modalState.onSuccess();
      handleCancel();
    } catch (error) {
      logger.error('Failed to restore many businesses', error);
    }
  };

  // Render
  return (
    <PageHeader
      title="Quản lý Business"
      description="Quản lý các business trong hệ thống"
      breadcrumbs={[
        { label: "Trang chủ", href: "/" },
        { label: "Business", href: "/business" },
      ]}
      actions={
        <div className="flex gap-2">
          <CreateButton module="Business" onClick={handleCreate} disabled={isCreating}>
            + Thêm business
          </CreateButton>
        </div>
      }
    >
      <BusinessList
        businesses={safeActiveBusinesses}
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
      <BusinessForm
        isOpen={modalState.type === 'create' || modalState.type === 'edit'}
        title={modalState.type === 'create' ? 'Tạo business mới' : 'Chỉnh sửa business'}
        business={modalState.type === 'edit' ? modalState.business : undefined}
        allBusinesses={allBusinessesForForm}
        onSubmit={modalState.type === 'create' ? handleCreateSubmit : handleEditSubmit}
        onCancel={handleCancel}
        isLoading={isCreating || isUpdating}
        mode={modalState.type === 'create' ? 'create' : 'edit'}
      />

      {/* Details Modal */}
      <BusinessDetails
        isOpen={modalState.type === 'view'}
        onClose={handleCancel}
        business={modalState.type === 'view' ? modalState.business : null}
      />

      {/* Delete Confirmation Dialog */}
      <Modal
        isOpen={modalState.type === 'delete'}
        onOpenChange={(open) => !open && handleCancel()}
        title="Xác nhận xóa"
      >
        <div>
          <p className="text-sm text-muted-foreground">
            Bạn có chắc chắn muốn xóa business &quot;{modalState.type === 'delete' ? modalState.business.name : ''}&quot;?
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
              Xóa
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
            {modalState.type === 'delete-many' && Array.isArray(modalState.ids)
              ? (modalState.permanent
                ? `Bạn có chắc chắn muốn xóa vĩnh viễn ${modalState.ids.length} business?`
                : `Bạn có chắc chắn muốn xóa ${modalState.ids.length} business?`)
              : ''}
          </p>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDeleteMany}
              disabled={isDeleting}
            >
              Xóa
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Restore Confirmation */}
      <Modal
        isOpen={modalState.type === 'restore-many'}
        onOpenChange={(open) => !open && handleCancel()}
        title="Xác nhận khôi phục"
      >
        <div>
          <p className="text-sm text-muted-foreground">
            Bạn có chắc chắn muốn khôi phục {modalState.type === 'restore-many' && Array.isArray(modalState.ids) ? modalState.ids.length : 0} business?
          </p>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button
              variant="default"
              onClick={handleConfirmRestoreMany}
              disabled={isDeleting} // Changed from isRestoring to isDeleting
            >
              Khôi phục
            </Button>
          </div>
        </div>
      </Modal>
    </PageHeader>
  );
}
