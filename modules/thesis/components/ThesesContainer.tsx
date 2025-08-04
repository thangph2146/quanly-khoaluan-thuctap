'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ThesisList } from './ThesisList';
import { ThesisForm } from './ThesisForm';
import { ThesisDetails } from './ThesisDetails';
import { ThesisDeletedList } from './ThesisDeletedList';
import { useTheses, useThesisActions, useDeletedTheses } from '../hooks';
import { Button } from '@/components/ui/button';
import { CreateButton } from '@/components/common/ProtectedButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader, Modal } from '@/components/common';
import type { Thesis, ThesisMutationData, ThesisFilters } from '../types';
import { logger } from '@/lib/utils/logger';

type ModalState =
  | { type: 'create' }
  | { type: 'edit'; thesis: Thesis }
  | { type: 'delete'; thesis: Thesis }
  | { type: 'delete-many'; ids: (string | number)[]; onSuccess: () => void; permanent?: boolean }
  | { type: 'restore-many'; ids: number[]; onSuccess: () => void }
  | { type: 'view'; thesis: Thesis }
  | { type: 'idle' };

export function ThesesContainer() {
  const [filters, setFilters] = useState<ThesisFilters>({ page: 1, limit: 10, search: '' });

  const {
    theses: activeTheses,
    setTheses: setActiveTheses,
    total: activeTotal,
    isLoading: isLoadingActive,
    refetch: refetchActive,
  } = useTheses(filters);

  const {
    createThesis,
    updateThesis,
    deleteThesis,
    isCreating,
    isUpdating,
    isDeleting,
  } = useThesisActions(() => {
    refetchActive();
  });

  const [modalState, setModalState] = useState<ModalState>({ type: 'idle' });

  const totalPages = Math.ceil(activeTotal / (filters.limit || 10));

  const filterBar = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div className="flex flex-col space-y-2 justify-between">
        <Label htmlFor="search">Tìm kiếm</Label>
        <div className="flex items-center gap-2">
          <Input
            id="search"
            placeholder="Tìm kiếm khóa luận..."
            value={filters.search || ''}
            onChange={(e) => setFilters((f: ThesisFilters) => ({ ...f, search: e.target.value, page: 1 }))}
            className="flex-grow"
          />
          {filters.search && (
            <Button onClick={() => setFilters((f: ThesisFilters) => ({ ...f, search: '', page: 1 }))}>
              Xóa filter
            </Button>
          )}
        </div>
      </div>
      {/* TODO: Add date filter */}
    </div>
  );

  const handleCreate = () => setModalState({ type: 'create' });
  const handleEdit = (thesis: Thesis) => setModalState({ type: 'edit', thesis });
  const handleDelete = (thesis: Thesis) => setModalState({ type: 'delete', thesis });
  const handleView = (thesis: Thesis) => setModalState({ type: 'view', thesis });
  const handleCancel = useCallback(() => setModalState({ type: 'idle' }), []);

  const handleDeleteMany = (ids: (string | number)[], onSuccess: () => void) => {
    setModalState({ type: 'delete-many', ids, onSuccess });
  };

  const handleRestoreMany = (ids: (string | number)[], onSuccess: () => void) => {
    setModalState({ type: 'restore-many', ids: ids as number[], onSuccess });
  };

  const handleCreateSubmit = useCallback(
    async (data: ThesisMutationData) => {
      try {
        await createThesis(data);
        handleCancel();
      } catch (error) {
        logger.error('Failed to create thesis', error);
      }
    },
    [createThesis, handleCancel]
  );

  const handleEditSubmit = useCallback(
    async (data: ThesisMutationData) => {
      if (modalState.type !== 'edit') return;
      try {
        await updateThesis(modalState.thesis.id, data);
        handleCancel();
      } catch (error) {
        logger.error('Failed to update thesis', error);
      }
    },
    [modalState, updateThesis, handleCancel]
  );

  const handleConfirmDelete = async () => {
    if (modalState.type !== 'delete') return;
    const success = await deleteThesis(modalState.thesis.id);
    if (success) {
      setActiveTheses((prev: Thesis[]) => prev.filter((t: Thesis) => t.id !== modalState.thesis.id));
      handleCancel();
      refetchActive();
    }
  };



  return (
    <PageHeader
      title="Quản lý khóa luận"
      description="Thêm, sửa, xóa và quản lý các khóa luận trong hệ thống"
      breadcrumbs={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Khóa luận', href: '/thesis' },
      ]}
      actions={
        <div className="flex gap-2">
          <CreateButton module="Thesis" onClick={handleCreate} disabled={isCreating}>
            + Thêm khóa luận
          </CreateButton>
        </div>
      }
    >
      <ThesisList
        theses={activeTheses}
        isLoading={isLoadingActive}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        filterBar={filterBar}
        page={filters.page}
        totalPages={totalPages}
        onPageChange={(p) => setFilters((f: ThesisFilters) => ({ ...f, page: p }))}
        limit={filters.limit}
        onLimitChange={(l) => setFilters((f: ThesisFilters) => ({ ...f, limit: l, page: 1 }))}
      />

      <ThesisForm
        isOpen={modalState.type === 'create' || modalState.type === 'edit'}
        title={modalState.type === 'create' ? 'Tạo khóa luận mới' : 'Chỉnh sửa khóa luận'}
        thesis={modalState.type === 'edit' ? modalState.thesis : undefined}
        onSubmit={modalState.type === 'create' ? handleCreateSubmit : handleEditSubmit}
        onCancel={handleCancel}
        isLoading={isCreating || isUpdating}
        mode={modalState.type === 'create' ? 'create' : 'edit'}
      />

      <ThesisDetails
        isOpen={modalState.type === 'view'}
        onClose={handleCancel}
        thesis={modalState.type === 'view' ? modalState.thesis : null}
      />

      <Modal
        isOpen={modalState.type === 'delete'}
        onOpenChange={(open) => !open && handleCancel()}
        title="Xác nhận xóa"
      >
        <div>
          <p className="text-sm text-muted-foreground">
            Bạn có chắc chắn muốn xóa khóa luận &quot;{modalState.type === 'delete' ? modalState.thesis.title : ''}
            &quot;? Hành động này sẽ chuyển mục này vào thùng rác.
          </p>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modalState.type === 'delete-many'}
        onOpenChange={(open) => !open && handleCancel()}
        title={
          modalState.type === 'delete-many' && modalState.permanent
            ? 'Xác nhận xóa vĩnh viễn'
            : 'Xác nhận xóa nhiều mục'
        }
      >
        <div>
          <p className="text-sm text-muted-foreground">
            {modalState.type === 'delete-many' && modalState.permanent
              ? `Bạn có chắc chắn muốn xóa vĩnh viễn ${modalState.ids.length} mục đã chọn? Hành động này không thể hoàn tác.`
              : `Bạn có chắc chắn muốn xóa ${
                  modalState.type === 'delete-many' ? modalState.ids.length : 0
                } mục đã chọn? Hành động này sẽ chuyển các mục vào thùng rác.`}
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
            Bạn có chắc chắn muốn khôi phục {modalState.type === 'restore-many' ? modalState.ids.length : 0} mục đã
            chọn?
          </p>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button onClick={() => {}} disabled={isDeleting}>
              {isDeleting ? 'Đang khôi phục...' : 'Khôi phục'}
            </Button>
          </div>
        </div>
      </Modal>
    </PageHeader>
  );
} 