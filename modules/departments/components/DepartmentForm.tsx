/**
 * Department Form Component
 */
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/common";
import type {
  Department,
  DepartmentMutationData,
  DepartmentFormProps,
} from "../types";
import { useQuery } from "@tanstack/react-query";
import { getDepartmentOptions } from "@/lib/api/selections.api";
import { useDebounce } from "@/hooks/use-debounce";
import { Combobox } from "@/components/common/combobox";

const createDepartmentFormSchema = (
  allDepartments: Department[],
  currentDepartmentId?: number
) =>
  z
    .object({
      name: z.string().min(1, {
        message: "Tên đơn vị không được để trống.",
      }),
      code: z.string().min(1, {
        message: "Mã đơn vị không được để trống.",
      }),
      parentDepartmentId: z.any().optional(),
    })
    .refine(
      (data) => {
        const exists = allDepartments.find(
          (d) =>
            d.code.toLowerCase() === data.code.toLowerCase() &&
            d.id !== currentDepartmentId
        );
        return !exists;
      },
      {
        message: "Mã đơn vị đã tồn tại.",
        path: ["code"],
      }
    );

export const DepartmentForm = React.memo(function DepartmentForm({
  department,
  allDepartments,
  onSubmit,
  onCancel,
  isLoading,
  mode,
  isOpen,
  title,
}: DepartmentFormProps) {
  const departmentSchema = useMemo(
    () => createDepartmentFormSchema(allDepartments, department?.id),
    [allDepartments, department?.id]
  );

  const form = useForm<z.infer<typeof departmentSchema>>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      code: "",
      parentDepartmentId: null,
    },
  });

  const [departmentSearch, setDepartmentSearch] = useState('');
  const debouncedDepartmentSearch = useDebounce(departmentSearch, 300);

  const { data: departmentOptions, isLoading: isLoadingDepartments } = useQuery({
    queryKey: ['departmentOptions', debouncedDepartmentSearch],
    queryFn: () => getDepartmentOptions(debouncedDepartmentSearch),
    initialData: [],
  });

  useEffect(() => {
    if (department && mode === 'edit') {
      form.reset({
        name: department.name || '',
        code: department.code || '',
        parentDepartmentId: department.parentDepartmentId ?? null,
      });
    } else {
      form.reset({
        name: '',
        code: '',
        parentDepartmentId: null,
      });
    }
  }, [department, mode, form.reset]);

  function handleFormSubmit(data: z.infer<typeof departmentSchema>) {
    const parentId = data.parentDepartmentId;
    const submissionData = {
      ...data,
      parentDepartmentId:
        parentId && parentId !== 'none' ? Number(parentId) : null,
    };
    onSubmit(submissionData as DepartmentMutationData);
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
          <Label htmlFor="name">Tên đơn vị *</Label>
          <Input
            id="name"
            {...form.register("name")}
            placeholder="Ví dụ: Khoa Công nghệ thông tin"
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

        {/* Code Field */}
        <div className="space-y-2">
          <Label htmlFor="code">Mã đơn vị *</Label>
          <Input
            id="code"
            {...form.register("code")}
            placeholder="Ví dụ: CNTT"
            required
            disabled={isLoading}
            className={form.formState.errors.code ? "border-destructive" : ""}
          />
          {form.formState.errors.code && (
            <p className="text-sm text-destructive">
              {form.formState.errors.code.message}
            </p>
          )}
        </div>

        {/* Parent Department Field */}
        <div className="space-y-2">
          <Label htmlFor="parentDepartmentId">Đơn vị cha</Label>
          <Controller
            name="parentDepartmentId"
            control={form.control}
            render={({ field }) => (
              <Combobox
                options={(departmentOptions || []).map(d => ({ value: d.id, label: d.name }))}
                value={field.value}
                onChange={(value) => {
                  field.onChange(value === 'none' ? null : value);
                }}
                onInputChange={setDepartmentSearch}
                isLoading={isLoadingDepartments}
                disabled={isLoading}
                placeholder="Tìm kiếm đơn vị cha..."
              />
            )}
          />
          {form.formState.errors.parentDepartmentId && (
            <p className="text-sm text-destructive">
              {String(form.formState.errors.parentDepartmentId.message)}
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
