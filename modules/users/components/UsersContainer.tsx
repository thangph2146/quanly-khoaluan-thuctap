"use-client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { UserList, UserForm, UserDetails } from "./";
import { useUsers, useUserActions } from "../hooks";
import { PageHeader, Modal } from "@/components/common";
import { Button } from "@/components/ui/button";
import { CreateButton } from "@/components/common/ProtectedButton";
import type { User, CreateUserData, UpdateUserData, UserFilters } from "../types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

type ModalState =
  | { type: "idle" }
  | { type: "create" }
  | { type: "edit"; user: User }
  | { type: "view"; user: User }
  | { type: "delete"; user: User };

export function UsersContainer() {
  const [modalState, setModalState] = useState<ModalState>({ type: "idle" });
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

  const handleSuccess = () => {
    refetchUsers();
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



  const handleFormSubmit = async (data: CreateUserData | UpdateUserData) => {
    if (modalState.type === "create") {
      await createUser(data as CreateUserData);
    } else if (modalState.type === "edit") {
      await updateUser(modalState.user.id, data as UpdateUserData);
    }
    setModalState({ type: "idle" });
  };

  const handleDeleteConfirm = async () => {
    if (modalState.type === "delete") {
      await softDeleteUser(modalState.user.id);
      setModalState({ type: "idle" });
    }
  };



  const safeUserTotalPages = Math.max(1, userTotalPages);

  const handlePageChange = (page: number) => {
    setFilters(f => ({ ...f, page }));
  }

  const handleLimitChange = (limit: number) => {
    setFilters(f => ({ ...f, limit, page: 1}));
  }

  const confirmationModalOpen = modalState.type === "delete";

  const isFormLoading = isCreating || isUpdating;

  const modalContent = useMemo(() => {
    if (modalState.type === "delete") {
      return {
        title: "Xác nhận xóa",
        description: `Bạn có chắc chắn muốn xóa tạm thời người dùng "${modalState.user.name}"?`,
        confirmText: "Xóa",
        onConfirm: handleDeleteConfirm,
        isLoading: isDeleting,
      };
    }
    return null;
  }, [modalState, isDeleting]);

  const filterBar = (
    <div className="flex items-center space-x-4">
      <div className="flex-1 max-w-sm">
        <Label htmlFor="search">Tìm kiếm</Label>
        <Input
          id="search"
          placeholder="Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <PageHeader
      title="Quản lý người dùng"
      description="Thêm, sửa, xóa và quản lý người dùng trong hệ thống."
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Users" }]}
      actions={
        <div className="flex gap-2">
          <CreateButton module="User" onClick={handleCreate} disabled={isCreating}>
            + Thêm người dùng
          </CreateButton>
        </div>
      }
    >
      <div className="p-4">
        <UserList
          users={users}
          isLoading={isLoadingUsers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          page={userPage}
          totalPages={safeUserTotalPages}
          onPageChange={handlePageChange}
          limit={userLimit}
          onLimitChange={handleLimitChange}
          filterBar={filterBar}
        />
      </div>

      <UserForm
        isOpen={modalState.type === "create" || modalState.type === "edit"}
        onCancel={handleCancel}
        user={modalState.type === "edit" ? modalState.user : null}
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
              variant="default"
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
