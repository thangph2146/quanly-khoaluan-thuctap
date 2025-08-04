/**
 * Students Container Component
 * Manages state and actions for students
 */
'use-client'

import React, { useState, useCallback, useEffect } from 'react';
import { StudentList } from './StudentList';
import { StudentForm } from './StudentForm';
import { StudentDetails } from './StudentDetails';
import { StudentDeletedList } from './StudentDeletedList';
import { useStudents, useStudentActions, useDeletedStudents } from '../hooks';
import { Button } from '@/components/ui/button';
import { CreateButton } from '@/components/common/ProtectedButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader, Modal } from '@/components/common';
import type { Student, StudentMutationData, StudentFilters } from '../types';
import { logger } from '@/lib/utils/logger';

type ModalState = 
  | { type: 'create' }
  | { type: 'edit', student: Student }
  | { type: 'delete', student: Student }
  | { type: 'delete-many', ids: (string | number)[], onSuccess: () => void, permanent?: boolean }
  | { type: 'restore-many', ids: (string | number)[], onSuccess: () => void }
  | { type: 'view', student: Student }
  | { type: 'idle' };

export function StudentsContainer() {
  const [filters, setFilters] = useState<StudentFilters>({ page: 1, limit: 10, search: "" });

  const { 
    students: activeStudents, 
    total: activeTotal, 
    isLoading: isLoadingActive, 
    refetch: refetchActive,
  } = useStudents(filters);

  const { 
    createStudent, 
    updateStudent, 
    deleteStudent, 
    isCreating, 
    isUpdating, 
    isDeleting,
  } = useStudentActions(() => {
    refetchActive();
  });
  
  const [modalState, setModalState] = useState<ModalState>({ type: 'idle' });

  const totalPages = Math.ceil(activeTotal / (filters.limit || 10));

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(f => ({ ...f, search: e.target.value, page: 1 }));
  };

  const handleClearSearch = () => {
    setFilters(f => ({ ...f, search: '', page: 1 }));
  };
  
  const filterBar = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div className="flex flex-col space-y-2 justify-between">
        <Label htmlFor="search">Tìm kiếm</Label>
        <div className="flex items-center gap-2">
          <Input
            id="search"
            placeholder="Tìm theo tên, mã SV, email..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="flex-grow"
          />
          {filters.search && (
            <Button onClick={handleClearSearch}>Xóa filter</Button>
          )}
        </div>
      </div>
    </div>
  );

  const handleCreate = () => setModalState({ type: 'create' });
  const handleEdit = (student: Student) => setModalState({ type: 'edit', student });
  const handleDelete = (student: Student) => setModalState({ type: 'delete', student });
  const handleView = (student: Student) => setModalState({ type: 'view', student });
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

  const handleCreateSubmit = useCallback(async (data: StudentMutationData) => {
    try {
      await createStudent(data);
      handleCancel();
    } catch (error) {
      logger.error('Failed to create student', error);
    }
  }, [createStudent, handleCancel]);

  const handleEditSubmit = useCallback(async (data: StudentMutationData) => {
    if (modalState.type !== 'edit') return;
    try {
      await updateStudent(modalState.student.id, data);
      handleCancel();
    } catch (error) {
      logger.error('Failed to update student', error);
    }
  }, [modalState, updateStudent, handleCancel]);

  const handleConfirmDelete = async () => {
    if (modalState.type !== 'delete') return;
    const success = await deleteStudent(modalState.student.id);
    if (success) {
      handleCancel();
    }
  };



  return (
    <PageHeader
      title="Quản lý sinh viên"
      description="Thêm, sửa, xóa và quản lý sinh viên trong hệ thống"
      breadcrumbs={[
        { label: "Trang chủ", href: "/" },
        { label: "Sinh viên", href: "/students" },
      ]}
      actions={
        <div className="flex gap-2">
          <CreateButton module="Student" onClick={handleCreate} disabled={isCreating}>
            + Thêm sinh viên
          </CreateButton>
        </div>
      }
    >
      <StudentList
        students={activeStudents}
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

      <StudentForm
        isOpen={modalState.type === 'create' || modalState.type === 'edit'}
        title={modalState.type === 'create' ? 'Tạo sinh viên mới' : 'Chỉnh sửa sinh viên'}
        student={modalState.type === 'edit' ? modalState.student : undefined}
        onSubmit={modalState.type === 'create' ? handleCreateSubmit : handleEditSubmit}
        onCancel={handleCancel}
        isLoading={isCreating || isUpdating}
        mode={modalState.type === 'create' ? 'create' : 'edit'}
      />

      <StudentDetails
        isOpen={modalState.type === 'view'}
        onClose={handleCancel}
        student={modalState.type === 'view' ? modalState.student : null}
      />

      <Modal
        isOpen={modalState.type === 'delete'}
        onOpenChange={(open) => !open && handleCancel()}
        title="Xác nhận xóa"
      >
        <div>
          <p className="text-sm text-muted-foreground">
            Bạn có chắc chắn muốn xóa sinh viên &quot;{modalState.type === 'delete' ? modalState.student.fullName : ''}&quot;? 
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
              onClick={() => {}}
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
              onClick={() => {}}
              disabled={isDeleting}
            >
              {isDeleting ? 'Đang khôi phục...' : 'Khôi phục'}
            </Button>
          </div>
        </div>
      </Modal>
    </PageHeader>
  );
}
