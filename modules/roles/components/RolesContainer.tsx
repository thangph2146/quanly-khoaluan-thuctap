/**
 * Roles Container Component
 * Manages state and actions for roles
 */
'use-client'

import React, { useState, useCallback, useEffect } from 'react'
import { RoleList } from './RoleList'
import { RoleForm } from './RoleForm'
import { RoleDetails } from './RoleDetails'
import { RoleDeletedList } from './RoleDeletedList'
import { useRoles, useRoleActions, useDeletedRoles } from '../hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader, Modal } from '@/components/common';
import type { Role, RoleMutationData, RoleFilters } from '../types'
import { logger } from '@/lib/utils/logger'

type ModalState = 
  | { type: 'create' }
  | { type: 'edit', role: Role }
  | { type: 'delete', role: Role }
  | { type: 'delete-many', ids: (string | number)[], onSuccess: () => void, permanent?: boolean }
  | { type: 'restore-many', ids: number[], onSuccess: () => void }
  | { type: 'view', role: Role }
  | { type: 'idle' };


export function RolesContainer() {
  const [showDeleted, setShowDeleted] = useState(false);
  const [filters, setFilters] = useState<RoleFilters>({ page: 1, limit: 10, search: "" });
  
  // Active roles state
  const { 
    roles: activeRoles, 
    setRoles: setActiveRoles, 
    total: activeTotal, 
    isLoading: isLoadingActive, 
    refetch: refetchActive,
  } = useRoles(filters);

  // Deleted roles state
  const { 
    deletedRoles, 
    total: deletedTotal, 
    isLoading: isLoadingDeleted,
    refetch: refetchDeleted,
  } = useDeletedRoles(filters);
  
  // Reset page to 1 when switching tabs
  useEffect(() => {
    setFilters(f => ({ ...f, page: 1 }));
  }, [showDeleted]);


  // Actions
  const { 
    createRole, 
    updateRole, 
    deleteRole, 
    restoreRoles,
    permanentDeleteRoles,
    softDeleteRoles,
    isCreating, 
    isUpdating, 
    isDeleting,
    isRestoring,
  } = useRoleActions(() => {
    refetchActive();
    refetchDeleted();
  })
  
  const [modalState, setModalState] = useState<ModalState>({ type: 'idle' });

  const totalPages = Math.ceil((showDeleted ? deletedTotal : activeTotal) / (filters.limit || 10));

  const filterBar = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div className="flex flex-col space-y-2 justify-between">
        <Label htmlFor="search">Tìm kiếm</Label>
        <div className="flex items-center gap-2">
          <Input
            id="search"
            placeholder="Tìm kiếm vai trò..."
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
  const handleEdit = (role: Role) => setModalState({ type: 'edit', role });
  const handleDelete = (role: Role) => setModalState({ type: 'delete', role });
  const handleView = (role: Role) => setModalState({ type: 'view', role });
  const handleCancel = useCallback(() => setModalState({ type: 'idle' }), []);

  const handleDeleteMany = (ids: (string | number)[], onSuccess: () => void) => {
    setModalState({ type: 'delete-many', ids, onSuccess });
  };
  
  const handleRestoreMany = (ids: (string | number)[], onSuccess: () => void) => {
    setModalState({ type: 'restore-many', ids: ids as number[], onSuccess });
  };

  const handleCreateSubmit = useCallback(async (data: RoleMutationData) => {
    try {
      await createRole(data)
      handleCancel()
    } catch (error) {
      logger.error('Failed to create role', error)
    }
  }, [createRole, handleCancel])

  const handleEditSubmit = useCallback(async (data: RoleMutationData) => {
    if (modalState.type !== 'edit') return
    
    try {
      await updateRole(modalState.role.id, data)
      handleCancel()
    } catch (error) {
      logger.error('Failed to update role', error)
    }
  }, [modalState, updateRole, handleCancel])

  const handleConfirmDelete = async () => {
    if (modalState.type !== 'delete') return
    
    const success = await deleteRole(modalState.role.id)
    if (success) {
      // Optimistic update
      setActiveRoles(prev => prev.filter(role => role.id !== modalState.role.id));
      handleCancel()
    }
  }

  const handleConfirmDeleteMany = async () => {
    if (modalState.type !== 'delete-many') return;
    const success = await softDeleteRoles(modalState.ids as number[]);
    if (success) {
      // Let the hook handle refetching
      modalState.onSuccess();
      handleCancel();
    }
  }

  const handleConfirmRestoreMany = async () => {
    if (modalState.type !== 'restore-many') return;
    const success = await restoreRoles(modalState.ids);
    if (success) {
      modalState.onSuccess();
      handleCancel();
    }
  }

  const handlePermanentDeleteMany = (ids: (string | number)[], onSuccess: () => void) => {
    setModalState({ type: 'delete-many', ids, onSuccess, permanent: true });
  };
  
  const handleConfirmPermanentDeleteMany = async () => {
    if (modalState.type !== 'delete-many' || !modalState.permanent) return;
    const success = await permanentDeleteRoles(modalState.ids as number[]);
    if (success) {
      // Let the hook handle refetching instead of optimistic update
      modalState.onSuccess();
      handleCancel();
    }
  }

  return (
    <PageHeader
      title="Quản lý Vai trò"
      description="Quản lý các vai trò trong hệ thống"
      breadcrumbs={[
        { label: "Trang chủ", href: "/" },
        { label: "Vai trò", href: "/roles" },
      ]}
      actions={
        <div className="flex gap-2">
          <Button onClick={handleCreate} disabled={isCreating}>
            + Thêm vai trò
          </Button>
          <Button variant={showDeleted ? 'default' : 'outline'} onClick={() => setShowDeleted((v) => !v)}>
            {showDeleted ? 'Danh sách hoạt động' : 'Xem thùng rác'}
          </Button>
        </div>
      }
    >
      {showDeleted ? (
        <RoleDeletedList
          roles={deletedRoles}
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
        <RoleList
          roles={activeRoles}
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
      <RoleForm
        isOpen={modalState.type === 'create' || modalState.type === 'edit'}
        title={modalState.type === 'create' ? 'Tạo vai trò mới' : 'Chỉnh sửa vai trò'}
        role={modalState.type === 'edit' ? modalState.role : undefined}
        onSubmit={modalState.type === 'create' ? handleCreateSubmit : handleEditSubmit}
        onCancel={handleCancel}
        isLoading={isCreating || isUpdating}
        mode={modalState.type === 'create' ? 'create' : 'edit'}
      />

      {/* Details Modal */}
      <RoleDetails
        isOpen={modalState.type === 'view'}
        onClose={handleCancel}
        role={modalState.type === 'view' ? modalState.role : null}
      />

      {/* Delete Confirmation Dialog */}
      <Modal
        isOpen={modalState.type === 'delete'}
        onOpenChange={(open) => !open && handleCancel()}
        title="Xác nhận xóa"
      >
        <div>
          <p className="text-sm text-muted-foreground">
            Bạn có chắc chắn muốn xóa vai trò &quot;{modalState.type === 'delete' ? modalState.role.name : ''}&quot;? 
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