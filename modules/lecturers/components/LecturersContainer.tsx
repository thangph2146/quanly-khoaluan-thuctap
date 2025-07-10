'use-client'

import React, { useState, useCallback, useEffect } from 'react'
import { LecturerList } from './LecturerList'
import { LecturerForm } from './LecturerForm'
import { LecturerDetails } from './LecturerDetails'
import { LecturerDeletedList } from './LecturerDeletedList'
import { useLecturers, useLecturerActions, useDeletedLecturers, useDepartments } from '../hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader, Modal } from '@/components/common';
import type { Lecturer, LecturerMutationData, LecturerFilters } from '../types'
import { logger } from '@/lib/utils/logger'

type ModalState =
  | { type: 'create' }
  | { type: 'edit', lecturer: Lecturer }
  | { type: 'delete', lecturer: Lecturer }
  | { type: 'delete-many', ids: (string | number)[], onSuccess: () => void, permanent?: boolean }
  | { type: 'restore-many', ids: (string | number)[], onSuccess: () => void }
  | { type: 'view', lecturer: Lecturer }
  | { type: 'idle' };


export function LecturersContainer() {
  const [showDeleted, setShowDeleted] = useState(false);
  const [filters, setFilters] = useState<LecturerFilters>({ page: 1, limit: 10, search: "" });

  const handleRefetch = () => {
    refetchActive();
    refetchDeleted();
  }

  const {
    lecturers: activeLecturers,
    total: activeTotal,
    isLoading: isLoadingActive,
    refetch: refetchActive,
  } = useLecturers(filters);

  const {
    deletedLecturers,
    total: deletedTotal,
    isLoading: isLoadingDeleted,
    refetch: refetchDeleted,
  } = useDeletedLecturers(filters);

  const { departments } = useDepartments();

  useEffect(() => {
    setFilters(f => ({ ...f, page: 1 }));
  }, [showDeleted]);

  const {
    createLecturer,
    updateLecturer,
    deleteLecturer,
    restoreLecturers,
    permanentDeleteLecturers,
    softDeleteLecturers,
    isCreating,
    isUpdating,
    isDeleting,
    isRestoring,
  } = useLecturerActions(handleRefetch)

  const [modalState, setModalState] = useState<ModalState>({ type: 'idle' });

  const totalPages = Math.ceil((showDeleted ? deletedTotal : activeTotal) / (filters.limit || 10));

  const handleCreate = () => setModalState({ type: 'create' });
  const handleEdit = (lecturer: Lecturer) => setModalState({ type: 'edit', lecturer });
  const handleDelete = (lecturer: Lecturer) => setModalState({ type: 'delete', lecturer });
  const handleView = (lecturer: Lecturer) => setModalState({ type: 'view', lecturer });
  const handleCancel = useCallback(() => setModalState({ type: 'idle' }), []);

  const handleDeleteMany = (ids: (string | number)[], onSuccess: () => void) => {
    setModalState({ type: 'delete-many', ids, onSuccess });
  };

  const handleRestoreMany = (ids: (string | number)[], onSuccess: () => void) => {
    setModalState({ type: 'restore-many', ids, onSuccess });
  };

  const handlePermanentDeleteMany = (ids: (string | number)[], onSuccess: () => void) => {
    setModalState({ type: 'delete-many', ids, onSuccess, permanent: true });
  };

  const handleCreateSubmit = useCallback(async (data: LecturerMutationData) => {
    try {
      await createLecturer(data)
      handleCancel()
    } catch (error) {
      logger.error('Failed to create lecturer', error)
    }
  }, [createLecturer, handleCancel])

  const handleEditSubmit = useCallback(async (data: LecturerMutationData) => {
    if (modalState.type !== 'edit') return

    try {
      await updateLecturer(modalState.lecturer.id, data)
      handleCancel()
    } catch (error) {
      logger.error('Failed to update lecturer', error)
    }
  }, [modalState, updateLecturer, handleCancel])

  const handleConfirmDelete = async () => {
    if (modalState.type !== 'delete') return
    const success = await deleteLecturer(modalState.lecturer.id)
    if (success) {
      handleCancel()
    }
  }

  const handleConfirmBulkAction = async () => {
    if (modalState.type !== 'delete-many' && modalState.type !== 'restore-many') return;

    let success = false;
    if (modalState.type === 'delete-many') {
        if(modalState.permanent) {
            success = await permanentDeleteLecturers(modalState.ids as number[]);
        } else {
            success = await softDeleteLecturers(modalState.ids as number[]);
        }
    } else if (modalState.type === 'restore-many') {
        success = await restoreLecturers(modalState.ids as number[]);
    }

    if (success) {
      modalState.onSuccess();
      handleCancel();
    }
  }

  const filterBar = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div className="flex flex-col space-y-2 justify-between">
        <Label htmlFor="search">Tìm kiếm</Label>
        <div className="flex items-center gap-2">
          <Input
            id="search"
            placeholder="Tìm kiếm giảng viên..."
            value={filters.search || ''}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))
            }
            className="flex-grow"
          />
        </div>
      </div>
    </div>
  )

  return (
    <PageHeader
      title="Quản lý Giảng viên"
      description="Quản lý các giảng viên trong hệ thống"
      breadcrumbs={[
        { label: "Trang chủ", href: "/" },
        { label: "Học thuật", href: "/academic" },
        { label: "Giảng viên", href: "/academic/lecturers" },
      ]}
      actions={
        <div className="flex gap-2">
          <Button onClick={handleCreate} disabled={isCreating}>
            + Thêm giảng viên
          </Button>
          <Button variant={showDeleted ? 'default' : 'outline'} onClick={() => setShowDeleted((v) => !v)}>
            {showDeleted ? 'Danh sách hoạt động' : 'Xem thùng rác'}
          </Button>
        </div>
      }
    >
      {showDeleted ? (
        <LecturerDeletedList
          lecturers={deletedLecturers}
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
        <LecturerList
          lecturers={activeLecturers}
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

      <LecturerForm
        isOpen={modalState.type === 'create' || modalState.type === 'edit'}
        title={modalState.type === 'create' ? 'Tạo giảng viên mới' : 'Chỉnh sửa giảng viên'}
        lecturer={modalState.type === 'edit' ? modalState.lecturer : undefined}
        allDepartments={departments}
        onSubmit={modalState.type === 'create' ? handleCreateSubmit : handleEditSubmit}
        onCancel={handleCancel}
        isLoading={isCreating || isUpdating}
        mode={modalState.type === 'create' ? 'create' : 'edit'}
      />

      <LecturerDetails
        isOpen={modalState.type === 'view'}
        onClose={handleCancel}
        lecturer={modalState.type === 'view' ? modalState.lecturer : null}
      />

      <Modal
        isOpen={modalState.type === 'delete'}
        onOpenChange={(open) => !open && handleCancel()}
        title="Xác nhận xóa"
      >
        <div>
          <p className="text-sm text-muted-foreground">
            Bạn có chắc chắn muốn xóa giảng viên &quot;{modalState.type === 'delete' ? modalState.lecturer.name : ''}&quot;?
            Hành động này sẽ chuyển mục này vào thùng rác.
          </p>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleCancel}> Hủy </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </div>
        </div>
      </Modal>

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
                  modalState.type === 'restore-many' ? modalState.ids.length : 0
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