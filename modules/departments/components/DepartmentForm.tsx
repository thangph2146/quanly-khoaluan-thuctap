/**
 * Department Form Component
 */
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, FormProvider } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import type {
  CreateDepartmentData,
  UpdateDepartmentData,
  DepartmentFormProps,
} from "../types";

export function DepartmentForm({
  department,
  allDepartments,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: DepartmentFormProps) {
  const methods = useForm<CreateDepartmentData | UpdateDepartmentData>({
    defaultValues: {
      name: "",
      code: "",
      parentDepartmentId: null,
    },
  });

  useEffect(() => {
    if (department && mode === "edit") {
      methods.reset({
        name: department.name || "",
        code: department.code || "",
        parentDepartmentId: department.parentDepartmentId ?? null,
      });
    } else {
      methods.reset({
        name: "",
        code: "",
        parentDepartmentId: null,
      });
    }
  }, [department, mode]);

  const handleFormSubmit = methods.handleSubmit(
    (data: CreateDepartmentData | UpdateDepartmentData) => {
      // Prevent self-parenting
      const submissionData = {
        ...data,
        parentDepartmentId:
          data.parentDepartmentId && String(data.parentDepartmentId) !== "none"
            ? Number(data.parentDepartmentId)
            : null,
      };
      onSubmit(submissionData);
    }
  );

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-1 px-1">
          <form onSubmit={handleFormSubmit} className="space-y-4 p-4">
            <FormField
              name="name"
              control={methods.control}
              rules={{ required: "Tên đơn vị không được để trống" }}
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Tên đơn vị *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ví dụ: Khoa Công nghệ thông tin"
                      required
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="code"
              control={methods.control}
              rules={{
                required: "Mã đơn vị không được để trống",
                validate: (value: string) => {
                  const exists = allDepartments.find(
                    (d) =>
                      d.code.toLowerCase() === value.toLowerCase() &&
                      d.id !== department?.id
                  );
                  return exists ? "Mã đơn vị đã tồn tại" : true;
                },
              }}
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Mã đơn vị *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ví dụ: CNTT"
                      required
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="parentDepartmentId"
              control={methods.control}
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Đơn vị cha</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value !== null ? String(field.value) : "none"}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn đơn vị cha (nếu có)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Không có</SelectItem>
                        {allDepartments
                          .filter((d) => d.id !== department?.id)
                          .map((d) => (
                            <SelectItem key={d.id} value={d.id.toString()}>
                              {d.name} ({d.code})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </ScrollArea>
        <div className="flex justify-end space-x-2 p-4 border-t bg-background">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            onClick={handleFormSubmit}
          >
            {isLoading
              ? "Đang xử lý..."
              : mode === "create"
              ? "Tạo mới"
              : "Cập nhật"}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
