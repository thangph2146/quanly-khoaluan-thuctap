/**
 * User Form Component
 * Form for creating and editing users
 */
import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Modal } from "@/components/common";
import { MultipleCombobox } from "@/components/common/multiple-combobox";
import { getRoleOptions } from "@/lib/api/selections.api";
import { useDebounce } from "@/hooks/use-debounce";
import type { User, CreateUserData, UpdateUserData } from "../types";
import { ComboboxOption } from "@/components/common/combobox";

interface UserFormProps {
  isOpen: boolean;
  user?: User | null;
  onSubmit: (data: CreateUserData | UpdateUserData) => void;
  onCancel: () => void;
  isLoading: boolean;
  mode: "create" | "edit";
}

const userFormSchema = z.object({
  name: z.string().min(1, "Họ và tên là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  avatarUrl: z
    .string()
    .url("URL ảnh đại diện không hợp lệ")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean(),
  keycloakUserId: z.string().min(1, "Keycloak User ID là bắt buộc"),
  roleIds: z.array(z.number()).min(1, "Vui lòng chọn ít nhất một vai trò"),
});

type UserFormData = z.infer<typeof userFormSchema>;

export function UserForm({
  isOpen,
  user,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: UserFormProps) {
  const [roleSearch, setRoleSearch] = useState("");
  const debouncedRoleSearch = useDebounce(roleSearch, 300);
  const [knownRoleOptions, setKnownRoleOptions] = useState<ComboboxOption[]>([]);


  const { data: roleOptions, isLoading: isLoadingRoles, refetch } = useQuery({
    queryKey: ["roleOptions", debouncedRoleSearch],
    queryFn: () => getRoleOptions(debouncedRoleSearch),
    initialData: [],
  });

  const handleRolesPopoverOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      refetch();
    } else {
      setRoleSearch('');
    }
  };

  const dropdownOptions = useMemo(() => {
    return (roleOptions || []).map((r) => ({
      value: r.id,
      label: r.name,
    }));
  }, [roleOptions]);

  useEffect(() => {
    const newOptions = dropdownOptions.filter(
      (opt) => !knownRoleOptions.some((known) => known.value === opt.value)
    );
    if (newOptions.length > 0) {
      setKnownRoleOptions((prev) => [...prev, ...newOptions]);
    }
  }, [dropdownOptions, knownRoleOptions]);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      avatarUrl: "",
      isActive: true,
      keycloakUserId: "",
      roleIds: [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (user && roleOptions.length > 0) {
        // Since we get role names, we need to map them to available options
        const initialRoleOptions = roleOptions
          .filter(opt => user.userRoles.includes(opt.name))
          .map(opt => ({ value: opt.id, label: opt.name }));

        setKnownRoleOptions(prev => {
          const newOpts = initialRoleOptions.filter(
            initOpt => !prev.some(p => p.value === initOpt.value)
          );
          return [...prev, ...newOpts];
        });
        
        const selectedRoleIds = initialRoleOptions.map(o => o.value);

        form.reset({
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl || "",
          isActive: user.isActive,
          keycloakUserId: user.keycloakUserId,
          roleIds: selectedRoleIds,
        });
      } else if (!user) {
        form.reset({
          name: "",
          email: "",
          avatarUrl: "",
          isActive: true,
          keycloakUserId: crypto.randomUUID(),
          roleIds: [],
        });
        setKnownRoleOptions([]);
      }
    } else {
      // Reset form when modal is closed to clear any validation errors
      form.reset();
      setKnownRoleOptions([]);
    }
  }, [user, isOpen, form, roleOptions]);

  const handleSubmit = (data: UserFormData) => {
    onSubmit(data);
  };

  const title =
    mode === "create" ? "Tạo người dùng mới" : "Cập nhật người dùng";

  const selectedIds = form.watch('roleIds') || [];
  const selectedRoleOptions = useMemo(
      () => knownRoleOptions.filter((opt) => selectedIds.includes(opt.value as number)),
      [knownRoleOptions, selectedIds]
  );

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onCancel()}
      title={title}
      className="sm:max-w-lg"
    >
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 p-2"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Họ và tên</Label>
          <Input
            id="name"
            {...form.register("name")}
            placeholder="Nhập họ và tên"
            disabled={isLoading}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...form.register("email")}
            placeholder="Nhập email"
            disabled={isLoading}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatarUrl">URL Ảnh đại diện</Label>
          <Input
            id="avatarUrl"
            {...form.register("avatarUrl")}
            placeholder="https://example.com/avatar.jpg"
            disabled={isLoading}
          />
          {form.formState.errors.avatarUrl && (
            <p className="text-sm text-destructive">
              {form.formState.errors.avatarUrl.message}
            </p>
          )}
        </div>

        <input type="hidden" {...form.register("keycloakUserId")} />

        <div className="space-y-2">
          <Label htmlFor="roleIds">Vai trò</Label>
          <Controller
            name="roleIds"
            control={form.control}
            render={({ field }) => (
              <MultipleCombobox
                options={dropdownOptions}
                selectedOptions={selectedRoleOptions}
                value={field.value}
                onChange={field.onChange}
                inputValue={roleSearch}
                onInputChange={setRoleSearch}
                isLoading={isLoadingRoles}
                disabled={isLoading || isLoadingRoles}
                placeholder={isLoadingRoles ? "Đang tải vai trò..." : "Chọn vai trò"}
                onOpenChange={handleRolesPopoverOpenChange}
              />
            )}
          />
          {form.formState.errors.roleIds && (
            <p className="text-sm text-destructive">
              {form.formState.errors.roleIds.message}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Controller
            name="isActive"
            control={form.control}
            render={({ field }) => (
              <Switch
                id="isActive"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isLoading}
              />
            )}
          />
          <Label htmlFor="isActive">Kích hoạt tài khoản</Label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
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
              ? "Tạo người dùng"
              : "Cập nhật"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
