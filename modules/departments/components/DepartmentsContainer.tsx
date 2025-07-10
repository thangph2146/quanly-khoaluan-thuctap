/**
 * Departments Container Component
 * Manages state and actions for departments
 */
'use-client'

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { DepartmentList } from './DepartmentList'
import { DepartmentForm } from './DepartmentForm'
import { DepartmentDetails } from './DepartmentDetails'
import { DepartmentDeletedList } from './DepartmentDeletedList'
import { useDepartments, useDepartmentActions, useDeletedDepartments } from '../hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader, Modal } from '@/components/common';
import type { Department, DepartmentMutationData, DepartmentFilters } from '../types'
import { logger } from '@/lib/utils/logger'
import { flattenDepartments, removeDepartmentFromTree } from '../utils/department-tree.utils'

type ModalState = 
  | { type: 'create' }
  | { type: 'edit', department: Department }
  | { type: 'delete', department: Department }
  | { type: 'delete-many', ids: (string | number)[], permanent?: boolean }
  | { type: 'restore-many', ids: number[] }
  | { type: 'view', department: Department }
  | { type: 'idle' };


export function DepartmentsContainer() {
  const [showDeleted, setShowDeleted] = useState(false);
  const [filters, setFilters] = useState<DepartmentFilters>({ page: 1, limit: 10, search: "" });
  
  // Active departments state
  const { 
    departments: activeDepartments, 
    setDepartments: setActiveDepartments, 
    total: activeTotal, 
    isLoading: isLoadingActive, 
    refetch: refetchActive,
  } = useDepartments(filters);

  // Deleted departments state
  const { 
    deletedDepartments, 
    total: deletedTotal, 
    isLoading: isLoadingDeleted,
    refetch: refetchDeleted,
  } = useDeletedDepartments(filters);
  
  // Reset page to 1 when switching tabs
  useEffect(() => {
    setFilters(f => ({ ...f, page: 1 }));
  }, [showDeleted]);


  // Actions
  const { 
    createDepartment, 
    updateDepartment, 
    deleteDepartment, 
    restoreDepartments,
    permanentDeleteDepartments,
    softDeleteDepartments,
    isCreating, 
    isUpdating, 
    isDeleting,
    isRestoring,
  } = useDepartmentActions(() => {
    refetchActive();
    refetchDeleted();
  })
  
  const [modalState, setModalState] = useState<ModalState>({ type: 'idle' });

  const allDepartmentsForForm = useMemo(() => flattenDepartments(activeDepartments), [activeDepartments]);

  const totalPages = Math.ceil((showDeleted ? deletedTotal : activeTotal) / (filters.limit || 10));

  const filterBar = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div className="flex flex-col space-y-2 justify-between">
        <Label htmlFor="search">Tìm kiếm</Label>
        <div className="flex items-center gap-2">
          <Input
            id="search"
            placeholder="Tìm kiếm đơn vị..."
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
  )

  const handleCreate = () => setModalState({ type: 'create' });
  const handleEdit = (department: Department) => setModalState({ type: 'edit', department });
  const handleDelete = (department: Department) => setModalState({ type: 'delete', department });
  const handleView = (department: Department) => setModalState({ type: 'view', department });
  const handleCancel = useCallback(() => setModalState({ type: 'idle' }), []);

  const handleDeleteMany = (ids: (string | number)[]) => {
    setModalState({ type: 'delete-many', ids });
  };
  
  const handleRestoreMany = (ids: (string | number)[]) => {
    setModalState({ type: 'restore-many', ids: ids as number[] });
  };

  const handleCreateSubmit = useCallback(async (data: DepartmentMutationData) => {
    try {
      await createDepartment(data)
      handleCancel()
    } catch (error) {
      logger.error('Failed to create department', error)
    }
  }, [createDepartment, handleCancel])

  const handleEditSubmit = useCallback(async (data: DepartmentMutationData) => {
    if (modalState.type !== 'edit') return
    
    try {
      await updateDepartment(modalState.department.id, data)
      handleCancel()
    } catch (error) {
      logger.error('Failed to update department', error)
    }
  }, [modalState, updateDepartment, handleCancel])

  const handleConfirmDelete = async () => {
    if (modalState.type !== 'delete') return
    
    const success = await deleteDepartment(modalState.department.id)
    if (success) {
      // Optimistic update
      setActiveDepartments(prev => removeDepartmentFromTree(prev, modalState.department.id));
      handleCancel()
    }
  }

  const handleConfirmDeleteMany = async () => {
    if (modalState.type !== 'delete-many') return;
    const success = await softDeleteDepartments(modalState.ids as number[]);
    if (success) {
      // Let the hook handle refetching
      handleCancel();
    }
  }

  const handleConfirmRestoreMany = async () => {
    if (modalState.type !== 'restore-many') return;
    const success = await restoreDepartments(modalState.ids);
    if (success) {
      handleCancel();
    }
  }

  const handlePermanentDeleteMany = (ids: (string | number)[]) => {
    setModalState({ type: 'delete-many', ids, permanent: true });
  };
  
  const handleConfirmPermanentDeleteMany = async () => {
    if (modalState.type !== 'delete-many' || !modalState.permanent) return;
    const success = await permanentDeleteDepartments(modalState.ids as number[]);
    if (success) {
      // Let the hook handle refetching instead of optimistic update
      handleCancel();
    }
  }

  return (
    <PageHeader
      title="Quản lý Đơn vị"
      description="Quản lý các đơn vị trong hệ thống"
      breadcrumbs={[
        { label: "Trang chủ", href: "/" },
        { label: "Đơn vị", href: "/departments" },
      ]}
      actions={
        <div className="flex gap-2">
          <Button onClick={handleCreate} disabled={isCreating}>
            + Thêm đơn vị
          </Button>
          <Button variant={showDeleted ? 'default' : 'outline'} onClick={() => setShowDeleted((v) => !v)}>
            {showDeleted ? 'Danh sách hoạt động' : 'Xem thùng rác'}
          </Button>
        </div>
      }
    >
      {showDeleted ? (
        <DepartmentDeletedList
          departments={deletedDepartments}
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
        <DepartmentList
          departments={activeDepartments}
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
      <DepartmentForm
        isOpen={modalState.type === 'create' || modalState.type === 'edit'}
        title={modalState.type === 'create' ? 'Tạo đơn vị mới' : 'Chỉnh sửa đơn vị'}
        department={modalState.type === 'edit' ? modalState.department : undefined}
        allDepartments={allDepartmentsForForm}
        onSubmit={modalState.type === 'create' ? handleCreateSubmit : handleEditSubmit}
        onCancel={handleCancel}
        isLoading={isCreating || isUpdating}
        mode={modalState.type === 'create' ? 'create' : 'edit'}
      />

      {/* Details Modal */}
      <DepartmentDetails
        isOpen={modalState.type === 'view'}
        onClose={handleCancel}
        department={modalState.type === 'view' ? modalState.department : null}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Delete Confirmation Dialog */}
      <Modal
        isOpen={modalState.type === 'delete'}
        onOpenChange={(open) => !open && handleCancel()}
        title="Xác nhận xóa"
      >
        <div>
          <p className="text-sm text-muted-foreground">
            Bạn có chắc chắn muốn xóa đơn vị &quot;{modalState.type === 'delete' ? modalState.department.name : ''}&quot;? 
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
              ? `Bạn có chắc chắn muốn xóa vĩnh viễn ${modalState.ids.length} mục đã chọn? Hành động này không thể hoàn tác.`
              : `Bạn có chắc chắn muốn xóa ${modalState.type === 'delete-many' ? modalState.ids.length : 0} mục đã chọn? Hành động này sẽ chuyển các mục vào thùng rác.`}
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
              disabled={isRestoring}
            >
              {isRestoring ? 'Đang khôi phục...' : 'Khôi phục'}
            </Button>
          </div>
        </div>
      </Modal>
    </PageHeader>
  )
}
