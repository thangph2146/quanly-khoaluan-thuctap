/**
 * Internships Container Component
 */
'use-client'

import React, { useState, useCallback, useEffect } from 'react'
import { InternshipList } from './InternshipList'
import { InternshipForm } from './InternshipForm'
import { InternshipDetails } from './InternshipDetails'
import { InternshipDeletedList } from './InternshipDeletedList'
import { useInternships } from '../hooks/use-internships'
import { useInternshipActions } from '../hooks/use-internship-actions'
import { useDeletedInternships } from '../hooks/use-deleted-internships'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader, Modal } from '@/components/common';
import type { Internship, CreateInternshipData, UpdateInternshipData, InternshipFilters } from '../types'
import { logger } from '@/lib/utils/logger'

type ModalState = 
  | { type: 'create' }
  | { type: 'edit', internship: Internship }
  | { type: 'delete', internship: Internship }
  | { type: 'delete-many', ids: (string | number)[], onSuccess: () => void, permanent?: boolean }
  | { type: 'restore-many', ids: number[], onSuccess: () => void }
  | { type: 'view', internship: Internship }
  | { type: 'idle' };


export function InternshipsContainer() {
  const [showDeleted, setShowDeleted] = useState(false);
  const [filters, setFilters] = useState<InternshipFilters>({ page: 1, limit: 10, search: "" });
  
  const { 
    internships: activeInternships, 
    setInternships: setActiveInternships, 
    total: activeTotal, 
    isLoading: isLoadingActive, 
    refetch: refetchActive,
  } = useInternships(filters);

  const { 
    deletedInternships, 
    total: deletedTotal, 
    isLoading: isLoadingDeleted,
    refetch: refetchDeleted,
  } = useDeletedInternships(filters);
  
  useEffect(() => {
    setFilters(f => ({ ...f, page: 1 }));
  }, [showDeleted]);

  const { 
    createInternship, 
    updateInternship, 
    deleteInternship, 
    restoreInternships,
    permanentDeleteInternships,
    softDeleteInternships,
    isCreating, 
    isUpdating, 
    isDeleting,
    isRestoring,
  } = useInternshipActions(() => {
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
            placeholder="Tìm theo tên sinh viên, công ty..."
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
  const handleEdit = (internship: Internship) => setModalState({ type: 'edit', internship });
  const handleDelete = (internship: Internship) => setModalState({ type: 'delete', internship });
  const handleView = (internship: Internship) => setModalState({ type: 'view', internship });
  const handleCancel = useCallback(() => setModalState({ type: 'idle' }), []);

  const handleDeleteMany = (ids: (string | number)[], onSuccess: () => void) => {
    setModalState({ type: 'delete-many', ids, onSuccess });
  };
  
  const handleRestoreMany = (ids: (string | number)[], onSuccess: () => void) => {
    setModalState({ type: 'restore-many', ids: ids as number[], onSuccess });
  };

  const handleCreateSubmit = useCallback(async (data: CreateInternshipData | UpdateInternshipData) => {
    try {
      await createInternship(data as CreateInternshipData)
      handleCancel()
    } catch (error) {
      logger.error('Failed to create internship', error)
    }
  }, [createInternship, handleCancel])

  const handleEditSubmit = useCallback(async (data: CreateInternshipData | UpdateInternshipData) => {
    if (modalState.type !== 'edit') return
    
    try {
      await updateInternship(modalState.internship.id, data)
      handleCancel()
    } catch (error) {
      logger.error('Failed to update internship', error)
    }
  }, [modalState, updateInternship, handleCancel])

  const handleConfirmDelete = async () => {
    if (modalState.type !== 'delete') return
    
    const success = await deleteInternship(modalState.internship.id)
    if (success) {
      setActiveInternships((prev: Internship[]) => prev.filter((i: Internship) => i.id !== modalState.internship.id));
      handleCancel()
    }
  }

  const handleConfirmDeleteMany = async () => {
    if (modalState.type !== 'delete-many') return;
    const success = await softDeleteInternships(modalState.ids as number[]);
    if (success) {
      modalState.onSuccess();
      handleCancel();
    }
  }

  const handleConfirmRestoreMany = async () => {
    if (modalState.type !== 'restore-many') return;
    const success = await restoreInternships(modalState.ids);
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
    const success = await permanentDeleteInternships(modalState.ids as number[]);
    if (success) {
      modalState.onSuccess();
      handleCancel();
    }
  }

  return (
    <PageHeader
      title="Quản lý Thực tập"
      description="Quản lý các kỳ thực tập của sinh viên"
      breadcrumbs={[
        { label: "Trang chủ", href: "/" },
        { label: "Thực tập", href: "/internship" },
      ]}
      actions={
        <div className="flex gap-2">
          <Button onClick={handleCreate} disabled={isCreating}>
            + Thêm kỳ thực tập
          </Button>
          <Button variant={showDeleted ? 'default' : 'outline'} onClick={() => setShowDeleted((v) => !v)}>
            {showDeleted ? 'Danh sách hoạt động' : 'Xem thùng rác'}
          </Button>
        </div>
      }
    >
      {showDeleted ? (
        <InternshipDeletedList
          internships={deletedInternships}
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
        <InternshipList
          internships={activeInternships}
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
      <InternshipForm
        isOpen={modalState.type === 'create' || modalState.type === 'edit'}
        title={modalState.type === 'create' ? 'Tạo kỳ thực tập mới' : 'Chỉnh sửa kỳ thực tập'}
        internship={modalState.type === 'edit' ? modalState.internship : undefined}
        onSubmit={modalState.type === 'create' ? handleCreateSubmit : handleEditSubmit}
        onCancel={handleCancel}
        isLoading={isCreating || isUpdating}
        mode={modalState.type === 'create' ? 'create' : 'edit'}
      />

      {/* Details Modal */}
      <InternshipDetails
        isOpen={modalState.type === 'view'}
        onClose={handleCancel}
        internship={modalState.type === 'view' ? modalState.internship : null}
      />

      {/* Delete Confirmation Dialog */}
      <Modal
        isOpen={modalState.type === 'delete'}
        onOpenChange={(open) => !open && handleCancel()}
        title="Xác nhận xóa"
      >
        <div>
          <p className="text-sm text-muted-foreground">
            Bạn có chắc chắn muốn xóa kỳ thực tập của sinh viên &quot;{modalState.type === 'delete' ? modalState.internship.student?.name : ''}&quot;? 
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