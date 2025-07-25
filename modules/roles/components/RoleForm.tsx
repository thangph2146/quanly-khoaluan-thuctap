/**
 * Role Form Component
 */
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/common";
import type { RoleMutationData, RoleFormProps, ComboboxOption } from "../types";
import { useQuery } from "@tanstack/react-query";
import { getPermissionOptions } from "@/lib/api/selections.api";
import { MultipleCombobox } from "@/components/common/multiple-combobox";
import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "@/hooks/use-debounce";

const roleFormSchema = z.object({
  name: z.string().min(1, {
    message: "Tên vai trò không được để trống.",
  }),
  description: z.string().optional(),
  permissionIds: z.array(z.number()).optional(),
});

export const RoleForm = React.memo(function RoleForm({
  role,
  onSubmit,
  onCancel,
  isLoading,
  mode,
  isOpen,
  title,
}: RoleFormProps) {
  const form = useForm<z.infer<typeof roleFormSchema>>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: "",
      permissionIds: [],
    },
  });

  const [permissionSearch, setPermissionSearch] = useState('');
  const debouncedPermissionSearch = useDebounce(permissionSearch, 300);
  const [allPermissionOptions, setAllPermissionOptions] = useState<ComboboxOption[]>([]);

  const { data: groupedPermissions, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['permissionOptions', debouncedPermissionSearch],
    queryFn: () => getPermissionOptions(debouncedPermissionSearch),
    initialData: [],
  });

  const dropdownOptions = useMemo(() => {
    if (!groupedPermissions) return [];
    return groupedPermissions.map(group => ({
        label: group.moduleName,
        options: group.permissions.map(p => ({ value: p.id, label: p.name }))
    }));
  }, [groupedPermissions]);

  // Effect to populate allPermissionOptions for label lookup
  useEffect(() => {
    if (groupedPermissions) {
        const flattened = groupedPermissions.flatMap(g => g.permissions).map(p => ({ value: p.id, label: p.name}));
        setAllPermissionOptions(prev => {
            const newOptions = flattened.filter(opt => !prev.some(p => p.value === opt.value));
            return [...prev, ...newOptions];
        });
    }
  }, [groupedPermissions]);


  useEffect(() => {
    if (role && mode === 'edit') {
      const initialOptions = role.rolePermissions?.map(rp => ({ value: rp.permission.id, label: rp.permission.name })) || [];
      const existingIds = allPermissionOptions.map(o => o.value);
      const newOptions = initialOptions.filter(opt => !existingIds.includes(opt.value));
      if (newOptions.length > 0) {
        setAllPermissionOptions(prev => [...prev, ...newOptions]);
      }
      
      form.reset({
        name: role.name || '',
        description: role.description || '',
        permissionIds: role.rolePermissions?.map(rp => rp.permission.id) || [],
      });
    } else {
      form.reset({
        name: '',
        description: '',
        permissionIds: [],
      });
    }
  }, [role, mode, form.reset]);

    const selectedIds = form.watch('permissionIds') || [];
    const selectedPermissionOptions = useMemo(
        () => allPermissionOptions.filter((opt) => selectedIds.includes(opt.value as number)),
        [allPermissionOptions, selectedIds]
    );

  function handleFormSubmit(data: z.infer<typeof roleFormSchema>) {
    const submissionData: RoleMutationData = {
      name: data.name,
      description: data.description || null,
      permissionIds: data.permissionIds || [],
    };
    onSubmit(submissionData);
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onCancel()}
      title={title}
      className="sm:max-w-lg"
    >
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4 p-2"
      >
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">Tên vai trò *</Label>
          <Input
            id="name"
            {...form.register("name")}
            placeholder="Ví dụ: Quản trị viên"
            required
            disabled={isLoading}
            className={form.formState.errors.name ? "border-destructive" : ""}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            {...form.register("description")}
            placeholder="Mô tả vai trò..."
            disabled={isLoading}
            className={form.formState.errors.description ? "border-destructive" : ""}
          />
          {form.formState.errors.description && (
            <p className="text-sm text-destructive">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        {/* Permissions Field */}
        <div className="space-y-2">
          <Label htmlFor="permissionIds">Quyền hạn</Label>
          <Controller
            name="permissionIds"
            control={form.control}
            render={({ field }) => (
              <MultipleCombobox
                options={dropdownOptions}
                selectedOptions={selectedPermissionOptions}
                value={field.value || []}
                onChange={field.onChange}
                inputValue={permissionSearch}
                onInputChange={setPermissionSearch}
                isLoading={isLoadingPermissions}
                placeholder="Chọn các quyền..."
              />
            )}
          />
        </div>

        {/* Buttons */}
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
              ? "Đang xử lý..."
              : mode === "create"
              ? "Tạo mới"
              : "Cập nhật"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}); 