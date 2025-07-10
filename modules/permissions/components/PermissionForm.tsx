/**
 * Permission Form Component
 */
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/common";
import type {
  PermissionMutationData,
  PermissionFormProps,
} from "../types";

const permissionFormSchema = z.object({
  name: z.string().min(1, {
    message: "Tên quyền không được để trống.",
  }),
  module: z.string().min(1, {
    message: "Tên module không được để trống.",
  }),
  description: z.string().optional(),
});

export const PermissionForm = React.memo(function PermissionForm({
  permission,
  onSubmit,
  onCancel,
  isLoading,
  mode,
  isOpen,
  title,
}: PermissionFormProps) {
  const form = useForm<z.infer<typeof permissionFormSchema>>({
    resolver: zodResolver(permissionFormSchema),
    defaultValues: {
      name: "",
      module: "",
      description: "",
    },
  });

  useEffect(() => {
    if (permission && mode === 'edit') {
      form.reset({
        name: permission.name || '',
        module: permission.module || '',
        description: permission.description || '',
      });
    } else {
      form.reset({
        name: '',
        module: '',
        description: '',
      });
    }
  }, [permission, mode, form.reset]);

  function handleFormSubmit(data: z.infer<typeof permissionFormSchema>) {
    onSubmit(data as PermissionMutationData);
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
          <Label htmlFor="name">Tên quyền *</Label>
          <Input
            id="name"
            {...form.register("name")}
            placeholder="Ví dụ: Read, Write,..."
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

        {/* Module Field */}
        <div className="space-y-2">
          <Label htmlFor="module">Module *</Label>
          <Input
            id="module"
            {...form.register("module")}
            placeholder="Ví dụ: Users, Roles,..."
            required
            disabled={isLoading}
            className={form.formState.errors.module ? "border-destructive" : ""}
          />
          {form.formState.errors.module && (
            <p className="text-sm text-destructive">
              {form.formState.errors.module.message}
            </p>
          )}
        </div>
        
        {/* Description Field */}
        <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Nhập mô tả cho quyền..."
                disabled={isLoading}
                className={form.formState.errors.description ? "border-destructive" : ""}
            />
            {form.formState.errors.description && (
                <p className="text-sm text-destructive">
                    {form.formState.errors.description.message}
                </p>
            )}
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