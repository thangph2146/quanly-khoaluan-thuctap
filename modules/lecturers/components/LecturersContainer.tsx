'use-client'

import React, { useState, useCallback, useEffect } from 'react'
import { LecturerList } from './LecturerList'
import { LecturerForm } from './LecturerForm'
import { LecturerDetails } from './LecturerDetails'
import { LecturerDeletedList } from './LecturerDeletedList'
import { useLecturers, useLecturerActions, useDeletedLecturers, useDepartments } from '../hooks'
import { Button } from '@/components/ui/button'
import { CreateButton } from '@/components/common/ProtectedButton';
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
  const [filters, setFilters] = useState<LecturerFilters>({ page: 1, limit: 10, search: '' });

  // Active lecturers state
  const {
    lecturers: activeLecturers,
    total: activeTotal,
    isLoading: isLoadingActive,
    refetch: refetchActive,
  } = useLecturers(filters);

  // Actions
  const {
    createLecturer,
    updateLecturer,
    deleteLecturer,
    isCreating,
    isUpdating,
    isDeleting,
  } = useLecturerActions(() => {
    refetchActive();
  });

  const [modalState, setModalState] = useState<ModalState>({ type: 'idle' });

  const totalPages = Math.ceil(activeTotal / (filters.limit || 10));

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
        // Bulk operations removed
        success = true;
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
      title="Quản lý giảng viên"
      description="Thêm, sửa, xóa và quản lý giảng viên trong hệ thống"
      breadcrumbs={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Giảng viên', href: '/lecturers' },
      ]}
      actions={
        <div className="flex gap-2">
          <CreateButton module="Lecturer" onClick={handleCreate} disabled={isCreating}>
            + Thêm giảng viên
          </CreateButton>
        </div>
      }
    >
      <LecturerList
        lecturers={activeLecturers}
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

      <LecturerForm
        isOpen={modalState.type === 'create' || modalState.type === 'edit'}
        title={modalState.type === 'create' ? 'Tạo giảng viên mới' : 'Chỉnh sửa giảng viên'}
        lecturer={modalState.type === 'edit' ? modalState.lecturer : undefined}
        allDepartments={[]}
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