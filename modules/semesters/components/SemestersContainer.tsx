'use-client'

import React, { useState, useCallback, useEffect } from 'react'
import { SemesterList } from './SemesterList'
import { SemesterForm } from './SemesterForm'
import { SemesterDetails } from './SemesterDetails'
import { SemesterDeletedList } from './SemesterDeletedList'
import { useSemesters, useSemesterActions, useDeletedSemesters } from '../hooks'
import { useAcademicYears } from '@/modules/academic-years/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader, Modal } from '@/components/common';
import type { Semester, SemesterMutationData, SemesterFilters } from '../types'
import { logger } from '@/lib/utils/logger'

type ModalState =
  | { type: 'create' }
  | { type: 'edit', semester: Semester }
  | { type: 'delete', semester: Semester }
  | { type: 'delete-many', ids: (string | number)[], onSuccess: () => void, permanent?: boolean }
  | { type: 'restore-many', ids: (string | number)[], onSuccess: () => void }
  | { type: 'view', semester: Semester }
  | { type: 'idle' };


export function SemestersContainer() {
  const [showDeleted, setShowDeleted] = useState(false);
  const [filters, setFilters] = useState<SemesterFilters>({ page: 1, limit: 10, search: "" });

  const handleRefetch = () => {
    refetchActive();
    refetchDeleted();
  }

  const {
    semesters: activeSemesters,
    total: activeTotal,
    isLoading: isLoadingActive,
    refetch: refetchActive,
  } = useSemesters(filters);

  const {
    deletedSemesters,
    total: deletedTotal,
    isLoading: isLoadingDeleted,
    refetch: refetchDeleted,
  } = useDeletedSemesters(filters);

  const { data: academicYears } = useAcademicYears({});

  useEffect(() => {
    setFilters(f => ({ ...f, page: 1 }));
  }, [showDeleted]);

  const {
    createSemester,
    updateSemester,
    deleteSemester,
    restoreSemesters,
    permanentDeleteSemesters,
    softDeleteSemesters,
    isCreating,
    isUpdating,
    isDeleting,
    isRestoring,
  } = useSemesterActions(handleRefetch)

  const [modalState, setModalState] = useState<ModalState>({ type: 'idle' });

  const totalPages = Math.ceil((showDeleted ? deletedTotal : activeTotal) / (filters.limit || 10));

  const handleCreate = () => setModalState({ type: 'create' });
  const handleEdit = (semester: Semester) => setModalState({ type: 'edit', semester });
  const handleDelete = (semester: Semester) => setModalState({ type: 'delete', semester });
  const handleView = (semester: Semester) => setModalState({ type: 'view', semester });
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

  const handleCreateSubmit = useCallback(async (data: SemesterMutationData) => {
    try {
      await createSemester(data)
      handleCancel()
    } catch (error) {
      logger.error('Failed to create semester', error)
    }
  }, [createSemester, handleCancel])

  const handleEditSubmit = useCallback(async (data: SemesterMutationData) => {
    if (modalState.type !== 'edit') return

    try {
      await updateSemester(modalState.semester.id, data)
      handleCancel()
    } catch (error) {
      logger.error('Failed to update semester', error)
    }
  }, [modalState, updateSemester, handleCancel])

  const handleConfirmDelete = async () => {
    if (modalState.type !== 'delete') return
    const success = await deleteSemester(modalState.semester.id)
    if (success) {
      handleCancel()
    }
  }

  const handleConfirmBulkAction = async () => {
    if (modalState.type !== 'delete-many' && modalState.type !== 'restore-many') return;

    let success = false;
    if (modalState.type === 'delete-many') {
        if(modalState.permanent) {
            success = await permanentDeleteSemesters(modalState.ids as number[]);
        } else {
            success = await softDeleteSemesters(modalState.ids as number[]);
        }
    } else if (modalState.type === 'restore-many') {
        success = await restoreSemesters(modalState.ids as number[]);
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
            placeholder="Tìm kiếm học kỳ..."
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
      title="Quản lý Học kỳ"
      description="Quản lý các học kỳ trong hệ thống"
      breadcrumbs={[
        { label: "Trang chủ", href: "/" },
        { label: "Học thuật", href: "/academic" },
        { label: "Học kỳ", href: "/academic/semesters" },
      ]}
      actions={
        <div className="flex gap-2">
          <Button onClick={handleCreate} disabled={isCreating}>
            + Thêm học kỳ
          </Button>
          <Button variant={showDeleted ? 'default' : 'outline'} onClick={() => setShowDeleted((v) => !v)}>
            {showDeleted ? 'Danh sách hoạt động' : 'Xem thùng rác'}
          </Button>
        </div>
      }
    >
      {showDeleted ? (
        <SemesterDeletedList
          semesters={deletedSemesters}
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
        <SemesterList
          semesters={activeSemesters}
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

      <SemesterForm
        isOpen={modalState.type === 'create' || modalState.type === 'edit'}
        title={modalState.type === 'create' ? 'Tạo học kỳ mới' : 'Chỉnh sửa học kỳ'}
        semester={modalState.type === 'edit' ? modalState.semester : undefined}
        academicYears={academicYears}
        onSubmit={modalState.type === 'create' ? handleCreateSubmit : handleEditSubmit}
        onCancel={handleCancel}
        isLoading={isCreating || isUpdating}
        mode={modalState.type === 'create' ? 'create' : 'edit'}
      />

      <SemesterDetails
        isOpen={modalState.type === 'view'}
        onClose={handleCancel}
        semester={modalState.type === 'view' ? modalState.semester : null}
      />

      <Modal
        isOpen={modalState.type === 'delete'}
        onOpenChange={(open) => !open && handleCancel()}
        title="Xác nhận xóa"
      >
        <div>
          <p className="text-sm text-muted-foreground">
            Bạn có chắc chắn muốn xóa học kỳ &quot;{modalState.type === 'delete' ? modalState.semester.name : ''}&quot;? 
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
