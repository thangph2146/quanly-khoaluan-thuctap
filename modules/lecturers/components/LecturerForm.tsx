import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/common";
import type { LecturerFormProps } from "../types";
import { Switch } from "@/components/ui/switch";
import { Combobox } from "@/components/common/combobox";
import { ACADEMIC_RANKS, DEGREES } from "../constants";
import { getDepartmentOptions } from "@/lib/api/selections.api";
import { useDebounce } from "@/hooks/use-debounce";

const lecturerFormSchema = z.object({
  name: z.string().min(1, { message: "Tên không được để trống." }),
  email: z.string().email({ message: "Email không hợp lệ." }),
  phoneNumber: z.string().optional().nullable(),
  departmentId: z.any().optional().nullable(),
  academicRank: z.string().optional().nullable(),
  degree: z.string().optional().nullable(),
  specialization: z.string().optional().nullable(),
  avatarUrl: z.string().url({ message: "URL ảnh đại diện không hợp lệ." }).optional().or(z.literal('')).nullable(),
  isActive: z.boolean(),
});

type LecturerFormData = z.infer<typeof lecturerFormSchema>;

const rankOptions = ACADEMIC_RANKS.map(rank => ({ value: rank, label: rank }));
const degreeOptions = DEGREES.map(degree => ({ value: degree, label: degree }));

export function LecturerForm({
  lecturer,
  onSubmit,
  onCancel,
  isLoading,
  mode,
  isOpen,
  title,
}: LecturerFormProps) {
  const [departmentSearch, setDepartmentSearch] = useState('');
  const debouncedDepartmentSearch = useDebounce(departmentSearch, 300);

  const { data: departments, isLoading: isLoadingDepartments } = useQuery({
    queryKey: ['departmentOptions', debouncedDepartmentSearch],
    queryFn: () => getDepartmentOptions(debouncedDepartmentSearch),
    initialData: [],
  });
  
  const form = useForm<LecturerFormData>({
    resolver: zodResolver(lecturerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      departmentId: null,
      academicRank: "",
      degree: "",
      specialization: "",
      avatarUrl: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (lecturer && mode === "edit") {
      form.reset({
        name: lecturer.name || "",
        email: lecturer.email || "",
        phoneNumber: lecturer.phoneNumber || "",
        departmentId: lecturer.departmentId ?? null,
        academicRank: lecturer.academicRank || "",
        degree: lecturer.degree || "",
        specialization: lecturer.specialization || "",
        avatarUrl: lecturer.avatarUrl || "",
        isActive: lecturer.isActive ?? true,
      });
    } else {
      form.reset({
        name: "",
        email: "",
        phoneNumber: "",
        departmentId: null,
        academicRank: "",
        degree: "",
        specialization: "",
        avatarUrl: "",
        isActive: true,
      });
    }
  }, [lecturer, mode, form.reset]);

  function handleFormSubmit(data: LecturerFormData) {
    const submissionData = {
        ...data,
        departmentId: data.departmentId ? Number(data.departmentId) : null,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
                <Label htmlFor="name">Họ và tên *</Label>
                <Input id="name" {...form.register("name")} disabled={isLoading} />
                {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
            </div>
            {/* Email */}
            <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" {...form.register("email")} type="email" disabled={isLoading} />
                {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
            </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
            <Label htmlFor="phoneNumber">Số điện thoại</Label>
            <Input id="phoneNumber" {...form.register("phoneNumber")} disabled={isLoading} />
        </div>
        
        {/* Department */}
        <div className="space-y-2">
            <Label>Khoa/Đơn vị</Label>
            <Controller
                name="departmentId"
                control={form.control}
                render={({ field }) => (
                    <Combobox
                      options={(departments || []).map(d => ({ value: d.id, label: d.name }))}
                      value={field.value}
                      onChange={field.onChange}
                      onInputChange={setDepartmentSearch}
                      isLoading={isLoadingDepartments}
                      disabled={isLoading}
                      placeholder="Chọn khoa/đơn vị"
                      allowClear
                    />
                )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Academic Rank */}
            <div className="space-y-2">
                <Label>Học hàm</Label>
                 <Controller
                    name="academicRank"
                    control={form.control}
                    render={({ field }) => (
                        <Combobox
                          options={rankOptions}
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isLoading}
                          placeholder="Chọn học hàm"
                          allowClear
                        />
                    )}
                />
            </div>
            {/* Degree */}
            <div className="space-y-2">
                <Label>Học vị</Label>
                <Controller
                    name="degree"
                    control={form.control}
                    render={({ field }) => (
                         <Combobox
                          options={degreeOptions}
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isLoading}
                          placeholder="Chọn học vị"
                          allowClear
                        />
                    )}
                />
            </div>
        </div>

        {/* Specialization */}
        <div className="space-y-2">
            <Label htmlFor="specialization">Chuyên ngành</Label>
            <Input id="specialization" {...form.register("specialization")} disabled={isLoading} />
        </div>

        {/* Avatar URL */}
        <div className="space-y-2">
            <Label htmlFor="avatarUrl">URL Ảnh đại diện</Label>
            <Input id="avatarUrl" {...form.register("avatarUrl")} disabled={isLoading} />
             {form.formState.errors.avatarUrl && <p className="text-sm text-destructive">{form.formState.errors.avatarUrl.message}</p>}
        </div>

        {/* IsActive Switch */}
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
            <Label htmlFor="isActive">Hoạt động</Label>
        </div>


        {/* Buttons */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : mode === "create" ? "Tạo mới" : "Cập nhật"}
          </Button>
        </div>
      </form>
    </Modal>
  );
} 