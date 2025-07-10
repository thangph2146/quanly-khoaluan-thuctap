/**
 * Role Form Component
 * Form for creating and editing roles
 */
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/common";
import { MultipleCombobox } from "@/components/common/multiple-combobox";
import { getPermissionOptions, getMenuOptions } from "@/lib/api/selections.api";
import { useDebounce } from "@/hooks/use-debounce";
import type { Role, CreateRoleRequest, UpdateRoleRequest } from "../types";

interface RoleFormProps {
  isOpen: boolean;
  role?: Role | null;
  onSubmit: (data: CreateRoleRequest | UpdateRoleRequest) => void;
  onCancel: () => void;
  isLoading: boolean;
  mode: "create" | "edit";
}

const roleFormSchema = z.object({
  name: z.string().min(1, { message: "Tên vai trò không được để trống." }),
  description: z.string().optional(),
  permissionIds: z.array(z.number()).optional(),
  menuIds: z.array(z.number()).optional(),
});

type RoleFormData = z.infer<typeof roleFormSchema>;

export function RoleForm({
  isOpen,
  role,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: RoleFormProps) {
  const [permissionSearch, setPermissionSearch] = useState('');
  const debouncedPermissionSearch = useDebounce(permissionSearch, 300);

  const { data: permissions, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['permissionOptions', debouncedPermissionSearch],
    queryFn: () => getPermissionOptions(debouncedPermissionSearch),
    initialData: [],
  });

  const [menuSearch, setMenuSearch] = useState('');
  const debouncedMenuSearch = useDebounce(menuSearch, 300);

  const { data: menus, isLoading: isLoadingMenus } = useQuery({
    queryKey: ['menuOptions', debouncedMenuSearch],
    queryFn: () => getMenuOptions(debouncedMenuSearch),
    initialData: [],
  });

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: "",
      permissionIds: [],
      menuIds: [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: role?.name || "",
        description: role?.description || "",
        permissionIds: role?.permissions?.map(p => p.id) || [],
        menuIds: role?.roleMenus?.map(rm => rm.menuId) || [],
      });
    }
  }, [isOpen, role, form.reset]);


  const handleSubmit = (data: RoleFormData) => {
    onSubmit(data);
  };

  const title = mode === "create" ? "Tạo vai trò mới" : "Chỉnh sửa vai trò";

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onCancel}
      title={title}
      className="sm:max-w-lg"
    >
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Tên vai trò</Label>
          <Input
            id="name"
            {...form.register("name")}
            placeholder="Nhập tên vai trò"
            disabled={isLoading}
          />
          {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            {...form.register("description")}
            placeholder="Nhập mô tả vai trò"
            rows={3}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label>Quyền</Label>
          <Controller
            name="permissionIds"
            control={form.control}
            render={({ field }) => (
              <MultipleCombobox
                options={(permissions || []).map(p => ({ value: p.id, label: p.name }))}
                value={field.value}
                onChange={field.onChange}
                onInputChange={setPermissionSearch}
                isLoading={isLoadingPermissions}
                disabled={isLoading}
                placeholder="Chọn quyền"
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Menus</Label>
          <Controller
            name="menuIds"
            control={form.control}
            render={({ field }) => (
              <MultipleCombobox
                options={(menus || []).map(m => ({ value: m.id, label: m.name }))}
                value={field.value}
                onChange={field.onChange}
                onInputChange={setMenuSearch}
                isLoading={isLoadingMenus}
                disabled={isLoading}
                placeholder="Chọn menus"
              />
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Đang lưu..."
              : mode === "create"
              ? "Tạo vai trò"
              : "Cập nhật"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
