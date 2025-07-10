"use-client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { UserList, UserDeletedList, UserForm, UserDetails } from "./";
import { useUsers, useRoles, useUserActions, useDeletedUsers } from "../hooks";
import { PageHeader, Modal } from "@/components/common";
import { Button } from "@/components/ui/button";
import type { User, CreateUserData, UpdateUserData, UserFilters } from "../types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

type ModalState =
  | { type: "idle" }
  | { type: "create" }
  | { type: "edit"; user: User }
  | { type: "view"; user: User }
  | { type: "delete"; user: User }
  | {
      type: "bulk-delete";
      ids: (string | number)[];
      onSuccess: () => void;
      permanent?: boolean;
    }
  | {
      type: "bulk-restore";
      ids: (string | number)[];
      onSuccess: () => void;
    };

export function UsersContainer() {
  const [modalState, setModalState] = useState<ModalState>({ type: "idle" });
  const [showDeleted, setShowDeleted] = useState(false);
  const [filters, setFilters] = useState<UserFilters>({ page: 1, limit: 10, search: "" });
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    setFilters(f => ({ ...f, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);


  const {
    users,
    isLoading: isLoadingUsers,
    page: userPage,
    totalPages: userTotalPages,
    limit: userLimit,
    refetch: refetchUsers,
  } = useUsers(filters);

  const {
    users: deletedUsers,
    isLoading: isLoadingDeleted,
    page: deletedPage,
    totalPages: deletedTotalPages,
    limit: deletedLimit,
    refetch: refetchDeleted,
  } = useDeletedUsers(filters);

  const { roles } = useRoles();

  const handleSuccess = () => {
    refetchUsers();
    refetchDeleted();
  };

  const {
    createUser,
    updateUser,
    softDeleteUser,
    bulkAction,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkActionLoading,
  } = useUserActions(handleSuccess);

  const handleCreate = () => setModalState({ type: "create" });
  const handleEdit = (user: User) => setModalState({ type: "edit", user });
  const handleView = (user: User) => setModalState({ type: "view", user });
  const handleDelete = (user: User) => setModalState({ type: "delete", user });
  const handleCancel = useCallback(() => setModalState({ type: "idle" }), []);

  const handleDeleteMany = (ids: (string | number)[], onSuccess: () => void) =>
    setModalState({ type: "bulk-delete", ids, onSuccess, permanent: false });

  const handlePermanentDeleteMany = (
    ids: (string | number)[],
    onSuccess: () => void
  ) => setModalState({ type: "bulk-delete", ids, onSuccess, permanent: true });

  const handleRestoreMany = (ids: (string | number)[], onSuccess: () => void) =>
    setModalState({ type: "bulk-restore", ids, onSuccess });

  const handleFormSubmit = async (data: CreateUserData | UpdateUserData) => {
    if (modalState.type === "create") {
      await createUser(data as CreateUserData);
    } else if (modalState.type === "edit") {
      await updateUser(modalState.user.id, data as UpdateUserData);
    }
    handleCancel();
  };

  const handleConfirmDelete = async () => {
    if (modalState.type === "delete") {
      await softDeleteUser(modalState.user.id);
      handleCancel();
    }
  };

  const handleConfirmBulkAction = async () => {
    if (modalState.type === "bulk-delete") {
      const idsToProcess = modalState.ids.map((id) => Number(id));
      const action = modalState.permanent ? "permanentDelete" : "softDelete";
      await bulkAction(idsToProcess, action);
      modalState.onSuccess();
    } else if (modalState.type === "bulk-restore") {
      const idsToProcess = modalState.ids.map((id) => Number(id));
      await bulkAction(idsToProcess, "restore");
      modalState.onSuccess();
    }
    handleCancel();
  };

  const handlePageChange = (page: number) => {
    setFilters(f => ({ ...f, page }));
  }

  const handleLimitChange = (limit: number) => {
    setFilters(f => ({ ...f, limit, page: 1}));
  }

  const confirmationModalOpen =
    modalState.type === "delete" ||
    modalState.type === "bulk-delete" ||
    modalState.type === "bulk-restore";

  const isFormLoading = isCreating || isUpdating;

  const modalContent = useMemo(() => {
    if (modalState.type === "delete") {
      return {
        title: "Xác nhận xóa",
        description: `Bạn có chắc chắn muốn xóa tạm thời người dùng "${modalState.user.name}"?`,
        confirmText: "Xóa",
        onConfirm: handleConfirmDelete,
        isLoading: isDeleting,
      };
    }
    if (modalState.type === "bulk-delete" && modalState.permanent) {
      return {
        title: `Xác nhận xóa vĩnh viễn`,
        description: `Bạn có chắc chắn muốn xóa vĩnh viễn ${modalState.ids.length} người dùng đã chọn? Hành động này không thể hoàn tác.`,
        confirmText: "Xóa vĩnh viễn",
        onConfirm: handleConfirmBulkAction,
        isLoading: isBulkActionLoading,
      };
    }
    if (modalState.type === "bulk-delete") {
      return {
        title: `Xác nhận xóa`,
        description: `Bạn có chắc chắn muốn xóa tạm thời ${modalState.ids.length} người dùng đã chọn?`,
        confirmText: "Xóa",
        onConfirm: handleConfirmBulkAction,
        isLoading: isBulkActionLoading,
      };
    }
    if (modalState.type === "bulk-restore") {
      return {
        title: `Xác nhận khôi phục`,
        description: `Bạn có chắc chắn muốn khôi phục ${modalState.ids.length} người dùng đã chọn?`,
        confirmText: "Khôi phục",
        onConfirm: handleConfirmBulkAction,
        isLoading: isBulkActionLoading,
      };
    }
    return null;
  }, [modalState, isDeleting, isBulkActionLoading]);

  const filterBar = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div className="flex flex-col space-y-2 justify-between">
        <Label htmlFor="search">Tìm kiếm</Label>
        <div className="flex items-center gap-2">
          <Input
            id="search"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          {searchTerm && (
            <Button
              onClick={() =>
                setSearchTerm('')
              }
            >
              Xóa filter
            </Button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <PageHeader
      title="Quản lý người dùng"
      description="Thêm, sửa, xóa và quản lý người dùng trong hệ thống."
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Users" }]}
      actions={
        <div className="flex gap-2">
          <Button onClick={handleCreate} disabled={isCreating}>
            + Thêm người dùng
          </Button>
          <Button
            variant={showDeleted ? "default" : "outline"}
            onClick={() => setShowDeleted((v) => !v)}
          >
            {showDeleted ? "Danh sách hoạt động" : "Xem thùng rác"}
          </Button>
        </div>
      }
    >
      <div className="p-4">
        {showDeleted ? (
          <UserDeletedList
            users={deletedUsers}
            isLoading={isLoadingDeleted}
            onRestore={handleRestoreMany}
            onPermanentDelete={handlePermanentDeleteMany}
            page={deletedPage}
            totalPages={deletedTotalPages}
            onPageChange={handlePageChange}
            limit={deletedLimit}
            onLimitChange={handleLimitChange}
            filterBar={filterBar}
          />
        ) : (
          <UserList
            users={users}
            isLoading={isLoadingUsers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onDeleteMany={handleDeleteMany}
            page={userPage}
            totalPages={userTotalPages}
            onPageChange={handlePageChange}
            limit={userLimit}
            onLimitChange={handleLimitChange}
            filterBar={filterBar}
          />
        )}
      </div>

      <UserForm
        isOpen={modalState.type === "create" || modalState.type === "edit"}
        onCancel={handleCancel}
        user={modalState.type === "edit" ? modalState.user : null}
        roles={roles}
        onSubmit={handleFormSubmit}
        isLoading={isFormLoading}
        mode={modalState.type === "create" ? "create" : "edit"}
      />

      {modalState.type === "view" && (
        <UserDetails
          isOpen={modalState.type === "view"}
          onClose={handleCancel}
          user={modalState.user}
        />
      )}


      <Modal
        isOpen={confirmationModalOpen}
        onOpenChange={(open) => !open && handleCancel()}
        title={modalContent?.title || ""}
      >
        <div>
          <p className="text-sm text-muted-foreground">
            {modalContent?.description}
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button
              variant={
                modalState.type === "bulk-delete" && modalState.permanent
                  ? "destructive"
                  : "default"
              }
              onClick={modalContent?.onConfirm}
              disabled={modalContent?.isLoading}
            >
              {modalContent?.isLoading
                ? "Đang xử lý..."
                : modalContent?.confirmText}
            </Button>
          </div>
        </div>
      </Modal>
    </PageHeader>
  );
}
