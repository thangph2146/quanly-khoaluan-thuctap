/**
 * Permissions Container Component
 */
'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { PermissionList } from './PermissionList'
import { PermissionForm } from './PermissionForm'
import { PermissionDetails } from './PermissionDetails'
import { PermissionDeletedList } from './PermissionDeletedList'
import { usePermissions, usePermissionActions, useDeletedPermissions } from '../hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader, Modal } from '@/components/common';
import type { Permission, PermissionMutationData, PermissionFilters } from '../types'
import { logger } from '@/lib/utils/logger'
import { PermissionService } from '../services/permission.service'

type ModalState = 
  | { type: 'create' }
  | { type: 'edit', permission: Permission }
  | { type: 'delete', permission: Permission }
  | { type: 'delete-many', ids: (string | number)[], onSuccess: () => void, permanent?: boolean }
  | { type: 'restore-many', ids: (string | number)[], onSuccess: () => void }
  | { type: 'view', permission: Permission }
  | { type: 'idle' };


export function PermissionsContainer() {
  const [showDeleted, setShowDeleted] = useState(false);
  const [filters, setFilters] = useState<PermissionFilters>({ page: 1, limit: 10, search: "" });
  const [allModules, setAllModules] = useState<string[]>([]);
  
  const { 
    permissions: activePermissions, 
    setPermissions: setActivePermissions,
    total: activeTotal, 
    isLoading: isLoadingActive, 
    refetch: refetchActive,
  } = usePermissions(filters);

  const { 
    deletedPermissions, 
    setDeletedPermissions,
    total: deletedTotal, 
    isLoading: isLoadingDeleted,
    refetch: refetchDeleted,
  } = useDeletedPermissions(filters);
  
  useEffect(() => {
    setFilters(f => ({ ...f, page: 1 }));
  }, [showDeleted]);

  useEffect(() => {
    PermissionService.getModules().then(setAllModules).catch(e => logger.error("Failed to fetch modules", e));
  }, []);

  const { 
    createPermission, 
    updatePermission, 
    deletePermission, 
    restorePermissions,
    permanentDeletePermissions,
    softDeletePermissions,
    isCreating, 
    isUpdating, 
    isDeleting,
    isRestoring,
  } = usePermissionActions()
  
  const [modalState, setModalState] = useState<ModalState>({ type: 'idle' });

  const totalPages = Math.ceil((showDeleted ? deletedTotal : activeTotal) / (filters.limit || 10));

  const filterBar = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div className="flex flex-col space-y-2 justify-between">
        <Label htmlFor="search">Tìm kiếm</Label>
        <div className="flex items-center gap-2">
          <Input
            id="search"
            placeholder="Tìm kiếm quyền..."
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
  const handleEdit = (permission: Permission) => setModalState({ type: 'edit', permission });
  const handleDelete = (permission: Permission) => setModalState({ type: 'delete', permission });
  const handleView = (permission: Permission) => setModalState({ type: 'view', permission });
  const handleCancel = useCallback(() => setModalState({ type: 'idle' }), []);

  const handleDeleteMany = (ids: (string | number)[], onSuccess: () => void) => {
    setModalState({ type: 'delete-many', ids, onSuccess });
  };
  
  const handleRestoreMany = (ids: (string | number)[], onSuccess: () => void) => {
    setModalState({ type: 'restore-many', ids, onSuccess });
  };

  const handleCreateSubmit = useCallback(async (data: PermissionMutationData) => {
    try {
      await createPermission(data)
      refetchActive(); // Refetch after creating
      handleCancel()
    } catch (error) {
      logger.error('Failed to create permission', error)
    }
  }, [createPermission, handleCancel, refetchActive])

  const handleEditSubmit = useCallback(async (data: PermissionMutationData) => {
    if (modalState.type !== 'edit') return
    
    try {
      await updatePermission(modalState.permission.id, data)
      refetchActive(); // Refetch after editing
      handleCancel()
    } catch (error) {
      logger.error('Failed to update permission', error)
    }
  }, [modalState, updatePermission, handleCancel, refetchActive])

  const handleConfirmDelete = async () => {
    if (modalState.type !== 'delete') return
    
    const success = await deletePermission(modalState.permission.id)
    if (success) {
      // Optimistic update
      setActivePermissions(prev => prev.filter(p => p.id !== modalState.permission.id))
      refetchDeleted(); // Update trash
      handleCancel()
    }
  }

  const handleConfirmDeleteMany = async () => {
    if (modalState.type !== 'delete-many') return;
    const success = await softDeletePermissions(modalState.ids);
    if (success) {
      // Optimistic update
      setActivePermissions(prev => prev.filter(p => !modalState.ids.includes(p.id)));
      refetchDeleted(); // Update trash
      modalState.onSuccess();
      handleCancel();
    }
  }

  const handleConfirmRestoreMany = async () => {
    if (modalState.type !== 'restore-many') return;
    const success = await restorePermissions(modalState.ids);
    if (success) {
      // Optimistic update
      setDeletedPermissions(prev => prev.filter(p => !modalState.ids.includes(p.id)));
      refetchActive(); // Update active list
      modalState.onSuccess();
      handleCancel();
    }
  }

  const handlePermanentDeleteMany = (ids: (string | number)[], onSuccess: () => void) => {
    setModalState({ type: 'delete-many', ids, onSuccess, permanent: true });
  };
  
  const handleConfirmPermanentDeleteMany = async () => {
    if (modalState.type !== 'delete-many' || !modalState.permanent) return;
    const success = await permanentDeletePermissions(modalState.ids);
    if (success) {
      // Optimistic update on the deleted list
      setDeletedPermissions(prev => prev.filter(p => !modalState.ids.includes(p.id)));
      modalState.onSuccess();
      handleCancel();
    }
  }

  return (
    <PageHeader
      title="Quản lý Quyền"
      description="Quản lý các quyền trong hệ thống"
      breadcrumbs={[
        { label: "Trang chủ", href: "/" },
        { label: "Quyền", href: "/permissions" },
      ]}
      actions={
        <div className="flex gap-2">
          <Button onClick={handleCreate} disabled={isCreating}>
            + Thêm quyền
          </Button>
          <Button variant={'outline'} onClick={() => setShowDeleted((v) => !v)}>
            {showDeleted ? 'Danh sách hoạt động' : 'Xem thùng rác'}
          </Button>
        </div>
      }
    >
      {showDeleted ? (
        <PermissionDeletedList
          permissions={deletedPermissions}
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
        <PermissionList
          permissions={activePermissions}
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
          onLimitChange={(l) => setFilters(f => ({ ...f, limit: l, page:1 }))}
        />
      )}

      <PermissionForm
        isOpen={modalState.type === 'create' || modalState.type === 'edit'}
        title={modalState.type === 'create' ? 'Tạo quyền mới' : 'Chỉnh sửa quyền'}
        permission={modalState.type === 'edit' ? modalState.permission : undefined}
        allModules={allModules}
        onSubmit={modalState.type === 'create' ? handleCreateSubmit : handleEditSubmit}
        onCancel={handleCancel}
        isLoading={isCreating || isUpdating}
        mode={modalState.type === 'create' ? 'create' : 'edit'}
      />

      <PermissionDetails
        isOpen={modalState.type === 'view'}
        onClose={handleCancel}
        permission={modalState.type === 'view' ? modalState.permission : null}
      />

      <Modal
        isOpen={modalState.type === 'delete'}
        onOpenChange={(open) => !open && handleCancel()}
        title="Xác nhận xóa"
      >
        <div>
          <p className="text-sm text-muted-foreground">
            Bạn có chắc chắn muốn xóa quyền &quot;{modalState.type === 'delete' ? modalState.permission.name : ''}&quot;? 
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