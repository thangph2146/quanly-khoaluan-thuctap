/**
 * Academic Years Container Component
 * Manages state and actions for academic years
 */
'use client'

import React, { useState, useCallback } from 'react'
import {
  AcademicYearList,
  AcademicYearForm,
  AcademicYearDetail,
  AcademicYearDeletedList,
} from './'
import { 
    useAcademicYears, 
    useDeletedAcademicYears,
    useAcademicYearActions 
} from '../hooks'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader, Modal } from '@/components/common';
import type { 
    AcademicYear, 
    AcademicYearFilters, 
    ApiCreateAcademicYearData, 
    ApiUpdateAcademicYearData,
    AcademicYearMutationData
} from '../types'
import { Button } from '@/components/ui/button'
import { CreateButton } from '@/components/common/ProtectedButton';

type ModalState = 
  | { type: 'create' }
  | { type: 'edit', year: AcademicYear }
  | { type: 'delete', year: AcademicYear }
  | { type: 'delete-many', ids: (string | number)[], onSuccess: () => void, permanent?: boolean }
  | { type: 'restore-many', ids: number[], onSuccess: () => void }
  | { type: 'view', year: AcademicYear }
  | { type: 'idle' };

export function AcademicYearsContainer() {
  const [filters, setFilters] = useState<AcademicYearFilters>({ page: 1, limit: 10, search: '' });

  // Active academic years state
  const {
    data: activeAcademicYears,
    total: activeTotal,
    isLoading: isLoadingActive,
    refetch: refetchActive,
  } = useAcademicYears(filters);

  // Actions
  const {
    createAcademicYear,
    updateAcademicYear,
    softDeleteAcademicYear,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAcademicYearActions(() => {
    refetchActive();
  });

  const [modalState, setModalState] = useState<ModalState>({ type: 'idle' });

  const totalPages = Math.ceil(activeTotal / (filters.limit || 10));

  const handleCreate = () => setModalState({ type: 'create' });
  const handleEdit = (year: AcademicYear) => setModalState({ type: 'edit', year });
  const handleDelete = (year: AcademicYear) => setModalState({ type: 'delete', year });
  const handleView = (year: AcademicYear) => setModalState({ type: 'view', year });
  const handleCancel = useCallback(() => setModalState({ type: 'idle' }), []);

  const handleFormSubmit = async (
    data: AcademicYearMutationData,
  ) => {
    let success = false;
    if (modalState.type === 'create') {
        await createAcademicYear(data as ApiCreateAcademicYearData)
      success = true;
    } else if (modalState.type === 'edit') {
      await updateAcademicYear(modalState.year.id, data as ApiUpdateAcademicYearData)
      success = true;
    }
    if (success) handleCancel();
  }

  const handleConfirmDelete = async () => {
    if (modalState.type !== 'delete') return
    const success = await softDeleteAcademicYear(modalState.year.id)
    if (success) handleCancel();
  }

  const handleDeleteMany = (ids: (string | number)[], onSuccess: () => void) => {
    setModalState({ type: 'delete-many', ids, onSuccess });
  };
  
  const handleRestoreMany = (ids: (string | number)[], onSuccess: () => void) => {
    setModalState({ type: 'restore-many', ids: ids as number[], onSuccess });
  };
  
  const handlePermanentDeleteMany = (ids: (string | number)[], onSuccess: () => void) => {
    setModalState({ type: 'delete-many', ids, onSuccess, permanent: true });
  };
  
  const handleConfirmBulkAction = async () => {
    if (modalState.type !== 'delete-many' && modalState.type !== 'restore-many') return;
    
    let success = false;
    if (modalState.type === 'delete-many') {
        if(modalState.permanent) {
            // This functionality was removed, so this block will not be reached
        } else {
            // This functionality was removed, so this block will not be reached
        }
    } else if (modalState.type === 'restore-many') {
        // This functionality was removed, so this block will not be reached
    }

    if (success) {
      modalState.onSuccess();
      handleCancel();
    }
  }
  
  const filterBar = (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      <div className="flex flex-col space-y-2 sm:col-span-2">
        <Label htmlFor="search">Tìm kiếm</Label>
        <div className="flex items-center gap-2">
          <Input
            id="search"
            placeholder="Tìm kiếm năm học..."
            value={filters.search || ''}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
            className="flex-grow"
          />
        </div>
      </div>
      
       {filters.search && (
        <div className="flex items-end">
           <Button
            onClick={() => setFilters({ page: 1, limit: 10, search: ''})}
          >
            Xóa filter
          </Button>
        </div>
      )}
    </div>
  )

  const selectedYear = modalState.type === 'edit' || modalState.type === 'view' || modalState.type === 'delete' ? modalState.year : null;

  return (
    <PageHeader
      title="Quản lý năm học"
      description="Thêm, sửa, xóa và quản lý năm học trong hệ thống"
      breadcrumbs={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Năm học', href: '/academic-years' },
      ]}
      actions={
        <div className="flex gap-2">
          <CreateButton module="AcademicYear" onClick={handleCreate} disabled={isCreating}>
            + Thêm năm học
          </CreateButton>
        </div>
      }
    >
              <AcademicYearList
          academicYears={activeAcademicYears}
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
      <AcademicYearForm
        isOpen={modalState.type === 'create' || modalState.type === 'edit'}
        title={modalState.type === 'create' ? 'Tạo năm học mới' : 'Chỉnh sửa năm học'}
        academicYear={modalState.type === 'edit' ? modalState.year : undefined}
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
        isLoading={isCreating || isUpdating}
        mode={modalState.type === 'create' ? 'create' : 'edit'}
      />

      {/* Detail Dialog */}
      <AcademicYearDetail
        isOpen={modalState.type === 'view'}
        onClose={handleCancel}
        academicYear={selectedYear}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />


      {/* Single Delete Confirmation */}
      <Modal 
        isOpen={modalState.type === 'delete'} 
        onOpenChange={(open) => !open && handleCancel()}
        title="Xác nhận xóa"
      >
        <div>
            <p className="text-sm text-muted-foreground">
              Bạn có chắc chắn muốn xóa năm học &quot;
              {selectedYear?.name}&quot;? Hành động này sẽ chuyển mục này vào thùng rác.
            </p>
            <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={handleCancel}>Hủy</Button>
                <Button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                variant="destructive"
                >
                {isDeleting ? 'Đang xóa...' : 'Xác nhận'}
                </Button>
            </div>
        </div>
      </Modal>

       {/* Bulk Actions Confirmation */}
      <Modal
        isOpen={
          modalState.type === 'delete-many' || modalState.type === 'restore-many'
        }
        onOpenChange={(open) => !open && handleCancel()}
        title="Xác nhận hàng loạt"
      >
        <div>
          <p className="text-sm text-muted-foreground">
            {modalState.type === 'delete-many'
              ? `Bạn có chắc muốn ${modalState.permanent ? 'xóa vĩnh viễn' : 'xóa'} ${
                  modalState.ids.length
                } mục đã chọn?`
              : modalState.type === 'restore-many' ? `Bạn có chắc muốn khôi phục ${
                  modalState.ids.length
                } mục đã chọn?` : ''}
          </p>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button
              onClick={handleConfirmBulkAction}
              disabled={isDeleting}
              variant={modalState.type === 'delete-many' ? 'destructive' : 'default'}
            >
              {isDeleting ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          </div>
        </div>
      </Modal>
    </PageHeader>
  )
}
