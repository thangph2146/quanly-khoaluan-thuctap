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
import type { AcademicYear, CreateAcademicYearData, UpdateAcademicYearData, AcademicYearFilters } from '../types'
import { Button } from '@/components/ui/button'

type ModalState = 
  | { type: 'create' }
  | { type: 'edit', year: AcademicYear }
  | { type: 'delete', year: AcademicYear }
  | { type: 'delete-many', ids: (string | number)[], permanent?: boolean }
  | { type: 'restore-many', ids: number[] }
  | { type: 'view', year: AcademicYear }
  | { type: 'idle' };

export function AcademicYearsContainer() {
  const [showDeleted, setShowDeleted] = useState(false);
  const [filters, setFilters] = useState<Omit<AcademicYearFilters, 'startDate' | 'endDate'>>({ page: 1, limit: 10, search: "" });
  const [modalState, setModalState] = useState<ModalState>({ type: 'idle' });

  const handleRefetch = () => {
    refetchActive();
    refetchDeleted();
  }

  const {
    data: activeYears, 
    total: activeTotal, 
    isLoading: isLoadingActive, 
    refetch: refetchActive,
  } = useAcademicYears(filters);

  const { 
    deletedAcademicYears, 
    total: deletedTotal, 
    isLoading: isLoadingDeleted,
    refetch: refetchDeleted,
  } = useDeletedAcademicYears(filters);

  const {
    createAcademicYear,
    updateAcademicYear,
    softDeleteAcademicYear,
    softDeleteAcademicYears,
    restoreAcademicYears,
    permanentDeleteAcademicYears,
    isCreating,
    isUpdating,
    isDeleting,
    isRestoring,
  } = useAcademicYearActions(handleRefetch)

  const handleCreate = () => setModalState({ type: 'create' });
  const handleEdit = (year: AcademicYear) => setModalState({ type: 'edit', year });
  const handleDelete = (year: AcademicYear) => setModalState({ type: 'delete', year });
  const handleView = (year: AcademicYear) => setModalState({ type: 'view', year });
  const handleCancel = useCallback(() => setModalState({ type: 'idle' }), []);

  const handleFormSubmit = async (
    data: CreateAcademicYearData | UpdateAcademicYearData,
  ) => {
    let success = false;
    if (modalState.type === 'create') {
      await createAcademicYear(data as CreateAcademicYearData)
      success = true;
    } else if (modalState.type === 'edit') {
      await updateAcademicYear(modalState.year.id, data as UpdateAcademicYearData)
      success = true;
    }
    if (success) handleCancel();
  }

  const handleConfirmDelete = async () => {
    if (modalState.type !== 'delete') return
    const success = await softDeleteAcademicYear(modalState.year.id)
    if (success) handleCancel();
  }

  const handleDeleteMany = (ids: (string | number)[]) => {
    return new Promise<void>((resolve, reject) => {
      if (window.confirm(`Bạn có chắc muốn xóa ${ids.length} năm học đã chọn?`)) {
        softDeleteAcademicYears(ids as number[]).then((success) => {
          if (success) {
            resolve();
          } else {
            reject(new Error("Xóa nhiều năm học thất bại"));
          }
        });
      } else {
        reject(new Error("Hủy bỏ hành động"));
      }
    });
  };
  
  const handleRestoreMany = (ids: (string | number)[]) => {
    return new Promise<void>((resolve, reject) => {
      if (window.confirm(`Bạn có chắc muốn khôi phục ${ids.length} năm học đã chọn?`)) {
        restoreAcademicYears(ids as number[]).then((success) => {
          if (success) {
            resolve();
          } else {
            reject(new Error("Khôi phục nhiều năm học thất bại"));
          }
        });
      } else {
        reject(new Error("Hủy bỏ hành động"));
      }
    });
  };
  
  const handlePermanentDeleteMany = (ids: (string | number)[]) => {
    return new Promise<void>((resolve, reject) => {
      if (window.confirm(`Bạn có chắc muốn xóa vĩnh viễn ${ids.length} năm học đã chọn? Hành động này không thể hoàn tác.`)) {
        permanentDeleteAcademicYears(ids as number[]).then((success) => {
          if (success) {
            resolve();
          } else {
            reject(new Error("Xóa vĩnh viễn nhiều năm học thất bại"));
          }
        });
      } else {
        reject(new Error("Hủy bỏ hành động"));
      }
    });
  };
  
  const handleConfirmBulkAction = async () => {
    if (modalState.type !== 'delete-many' && modalState.type !== 'restore-many') return;
    
    let success = false;
    if (modalState.type === 'delete-many') {
        if(modalState.permanent) {
            success = await permanentDeleteAcademicYears(modalState.ids as number[]);
        } else {
            success = await softDeleteAcademicYears(modalState.ids as number[]);
        }
    } else if (modalState.type === 'restore-many') {
        success = await restoreAcademicYears(modalState.ids);
    }

    if (success) handleCancel();
  }
  
  const totalPages = Math.ceil((showDeleted ? deletedTotal : activeTotal) / (filters.limit || 10))

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
      title="Quản lý Năm học"
      description="Quản lý các năm học trong hệ thống"
      breadcrumbs={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Năm học', href: '/academic-years' },
      ]}
      actions={
        <div className="flex gap-2">
            <Button onClick={handleCreate} disabled={isCreating}>
                + Thêm năm học
            </Button>
            <Button variant={showDeleted ? 'default' : 'outline'} onClick={() => setShowDeleted(v => !v)}>
                {showDeleted ? 'Danh sách hoạt động' : 'Xem thùng rác'}
            </Button>
        </div>
      }
    >
        {showDeleted ? (
            <AcademicYearDeletedList 
                academicYears={deletedAcademicYears}
                isLoading={isLoadingDeleted}
                onRestore={handleRestoreMany}
                onPermanentDelete={handlePermanentDeleteMany}
                deleteButtonText="Xóa vĩnh viễn"
                filterBar={filterBar}
                page={filters.page}
                totalPages={totalPages}
                onPageChange={(p) => setFilters(f => ({ ...f, page: p }))}
                limit={filters.limit}
                onLimitChange={(l) => setFilters(f => ({ ...f, limit: l, page: 1 }))}
            />
        ) : (
            <AcademicYearList
                academicYears={activeYears}
                isLoading={isLoadingActive}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
                onDeleteMany={handleDeleteMany}
                filterBar={filterBar}
                page={filters.page}
                totalPages={totalPages}
                onPageChange={(p) => setFilters(f => ({ ...f, page: p }))}
                limit={filters.limit}
                onLimitChange={(l) => setFilters(f => ({ ...f, limit: l, page: 1 }))}
            />
        )}
      
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
       {/* This modal can now be removed if we are using window.confirm */}
      <Modal
        isOpen={
          (modalState.type === 'delete-many' || modalState.type === 'restore-many') && false // Keep it disabled
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
              disabled={isDeleting || isRestoring}
              variant={modalState.type === 'delete-many' ? 'destructive' : 'default'}
            >
              {isDeleting || isRestoring ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          </div>
        </div>
      </Modal>
    </PageHeader>
  )
}
