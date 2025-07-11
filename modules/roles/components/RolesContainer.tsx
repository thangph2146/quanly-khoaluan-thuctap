/**
 * Roles Container Component
 * Manages state and actions for roles
 */
"use client";

import React, { useState, useCallback, useEffect } from "react";
import { RoleList, RoleDeletedList, RoleForm, RoleDetails } from "./";
import { useRoles, useRoleActions, useDeletedRoles, type SuccessPayload } from "../hooks";
import { PageHeader, Modal } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  RoleFilters,
} from "../types";
import { useDebounce } from "@/hooks/use-debounce";

type ModalState =
  | { type: "idle" }
  | { type: "create" }
  | { type: "edit"; role: Role }
  | { type: "delete"; role: Role }
  | { type: "view"; role: Role }
  | { type: "bulk-delete"; ids: number[]; onSuccess: () => void }
  | { type: "bulk-restore"; ids: number[]; onSuccess: () => void }
  | { type: "bulk-permanent-delete"; ids: number[]; onSuccess: () => void };

export function RolesContainer() {
  const [modalState, setModalState] = useState<ModalState>({ type: "idle" });
  const [showDeleted, setShowDeleted] = useState(false);
  const [filters, setFilters] = useState<RoleFilters>({
    page: 1,
    limit: 10,
    search: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    setFilters((f) => ({ ...f, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  const {
    roles,
    isLoading: isLoadingRoles,
    page: rolePage,
    totalPages: roleTotalPages,
    limit: roleLimit,
    refetch: refetchRoles,
    setActiveRoles,
  } = useRoles(filters);

  const {
    roles: deletedRoles,
    isLoading: isLoadingDeleted,
    page: deletedPage,
    totalPages: deletedTotalPages,
    limit: deletedLimit,
    refetch: refetchDeleted,
    setDeletedRoles,
  } = useDeletedRoles(filters);

  const handleActionSuccess = useCallback((actionType: string, data: SuccessPayload) => {
    switch (actionType) {
      case 'create':
        refetchRoles(); 
        break;
      case 'update': {
        const updatedRole = data as Role;
        setActiveRoles(roles.map(r => r.id === updatedRole.id ? updatedRole : r));
        break;
      }
      case 'softDelete': {
        const { id } = data as { id: number };
        const roleToMove = roles.find(r => r.id === id);
        if (roleToMove) {
          setActiveRoles(roles.filter(r => r.id !== id));
          setDeletedRoles([{ ...roleToMove, deletedAt: new Date().toISOString() }, ...deletedRoles]);
        }
        break;
      }
      case 'bulk': {
        const { ids, action } = data as { ids: number[], action: 'softDelete' | 'restore' | 'permanentDelete' };
        if (action === 'softDelete') {
          const rolesToMove = roles.filter(r => ids.includes(r.id));
          setActiveRoles(roles.filter(r => !ids.includes(r.id)));
          setDeletedRoles([...rolesToMove.map(r => ({...r, deletedAt: new Date().toISOString()})), ...deletedRoles]);
        } else if (action === 'restore') {
          const rolesToMove = deletedRoles.filter(r => ids.includes(r.id));
          setDeletedRoles(deletedRoles.filter(r => !ids.includes(r.id)));
          setActiveRoles([...rolesToMove.map(r => ({...r, deletedAt: undefined})), ...roles]);
        } else if (action === 'permanentDelete') {
          setDeletedRoles(deletedRoles.filter(r => !ids.includes(r.id)));
        }
        break;
      }
      default:
        refetchRoles();
        refetchDeleted();
        break;
    }
  }, [roles, deletedRoles, setActiveRoles, setDeletedRoles, refetchRoles, refetchDeleted]);


  const {
    createRole,
    updateRole,
    softDeleteRole,
    bulkAction,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkActionLoading,
  } = useRoleActions(handleActionSuccess);

  const handleCreate = () => setModalState({ type: "create" });
  const handleEdit = (role: Role) => setModalState({ type: "edit", role });
  const handleDelete = (role: Role) => setModalState({ type: "delete", role });
  const handleView = (role: Role) => setModalState({ type: "view", role });
  const handleCancel = () => setModalState({ type: "idle" });

  const handleDeleteMany = (
    ids: (string | number)[],
    onSuccess: () => void
  ) => {
    setModalState({ type: "bulk-delete", ids: ids as number[], onSuccess });
  };

  const handleRestoreMany = (
    ids: (string | number)[],
    onSuccess: () => void
  ) => {
    setModalState({ type: "bulk-restore", ids: ids as number[], onSuccess });
  };

  const handlePermanentDeleteMany = (
    ids: (string | number)[],
    onSuccess: () => void
  ) => {
    setModalState({
      type: "bulk-permanent-delete",
      ids: ids as number[],
      onSuccess,
    });
  };

  const handleFormSubmit = async (
    data: CreateRoleRequest | UpdateRoleRequest
  ) => {
    let success = false;
    if (modalState.type === "create") {
      success = await createRole(data as CreateRoleRequest);
    } else if (modalState.type === "edit") {
      success = await updateRole(modalState.role.id, data as UpdateRoleRequest);
    }
    if (success) handleCancel();
  };

  const handleDeleteConfirm = async () => {
    if (modalState.type === "delete") {
      await softDeleteRole(modalState.role.id);
      handleCancel();
    } else if (modalState.type === "bulk-delete") {
      await bulkAction(modalState.ids, "softDelete");
      const onSuccess = modalState.onSuccess;
      handleCancel();
      onSuccess?.();
    } else if (modalState.type === "bulk-permanent-delete") {
      await bulkAction(modalState.ids, "permanentDelete");
      const onSuccess = modalState.onSuccess;
      handleCancel();
      onSuccess?.();
    } else if (modalState.type === "bulk-restore") {
      await bulkAction(modalState.ids, "restore");
      const onSuccess = modalState.onSuccess;
      handleCancel();
      onSuccess?.();
    }
  };

  const handlePageChange = (page: number) => {
    setFilters((f) => ({ ...f, page }));
  };

  const handleLimitChange = (limit: number) => {
    setFilters((f) => ({ ...f, limit, page: 1 }));
  };

  const isFormLoading = isCreating || isUpdating;
  const confirmationModalOpen =
    modalState.type === "delete" ||
    modalState.type === "bulk-delete" ||
    modalState.type === "bulk-permanent-delete" ||
    modalState.type === "bulk-restore";

  const getConfirmationContent = () => {
    if (modalState.type === "delete") {
      return {
        title: "Xác nhận xóa",
        description: `Bạn có chắc muốn xóa tạm thời vai trò "${modalState.role.name}"?`,
      };
    }
    if (modalState.type === "bulk-delete") {
      return {
        title: "Xác nhận xóa hàng loạt",
        description: `Bạn có chắc muốn xóa tạm thời ${modalState.ids.length} vai trò đã chọn?`,
      };
    }
    if (modalState.type === "bulk-permanent-delete") {
      return {
        title: "Xác nhận xóa vĩnh viễn",
        description: `Bạn có chắc muốn xóa VĨNH VIỄN ${modalState.ids.length} vai trò đã chọn? Hành động này không thể hoàn tác.`,
      };
    }
    if (modalState.type === "bulk-restore") {
        return {
          title: "Xác nhận khôi phục",
          description: `Bạn có chắc muốn khôi phục ${modalState.ids.length} vai trò đã chọn?`,
        };
    }
    return { title: "", description: "" };
  };

  const confirmationContent = getConfirmationContent();

  const filterBar = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div className="flex flex-col space-y-2 justify-between">
        <Label htmlFor="search">Tìm kiếm</Label>
        <div className="flex items-center gap-2">
          <Input
            id="search"
            placeholder="Tìm kiếm vai trò..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          {searchTerm && (
            <Button onClick={() => setSearchTerm("")}>Xóa filter</Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <PageHeader
      title="Quản lý vai trò"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Roles" }]}
      actions={
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleCreate}>Thêm vai trò</Button>
          <Button
            variant={"outline"}
            onClick={() => setShowDeleted(!showDeleted)}
          >
            {showDeleted ? "Xem vai trò đang hoạt động" : "Xem vai trò đã xóa"}
          </Button>
        </div>
      }
    >
      <div className="p-4">
        {showDeleted ? (
          <RoleDeletedList
            roles={deletedRoles}
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
          <RoleList
            roles={roles}
            isLoading={isLoadingRoles}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onDeleteMany={handleDeleteMany}
            page={rolePage}
            totalPages={roleTotalPages}
            onPageChange={handlePageChange}
            limit={roleLimit}
            onLimitChange={handleLimitChange}
            filterBar={filterBar}
          />
        )}
      </div>

      <RoleForm
        isOpen={modalState.type === "create" || modalState.type === "edit"}
        onCancel={handleCancel}
        role={modalState.type === "edit" ? modalState.role : null}
        onSubmit={handleFormSubmit}
        isLoading={isFormLoading}
        mode={modalState.type === "create" ? "create" : "edit"}
      />

      {modalState.type === "view" && (
        <RoleDetails
          isOpen={modalState.type === "view"}
          onClose={handleCancel}
          role={modalState.role}
        />
      )}

      <Modal
        isOpen={confirmationModalOpen}
        onOpenChange={(open) => !open && handleCancel()}
        title={confirmationContent.title}
      >
        <div>
          <p>{confirmationContent.description}</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button
              variant={modalState.type === 'bulk-restore' ? 'default' : 'destructive'}
              onClick={handleDeleteConfirm}
              disabled={isDeleting || isBulkActionLoading}
            >
              {isDeleting || isBulkActionLoading ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </div>
        </div>
      </Modal>
    </PageHeader>
  );
}
