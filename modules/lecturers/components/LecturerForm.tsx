/**
 * Lecturer Form Component
 * Form for creating and editing lecturers
 */
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/common";
import type { LecturerFormProps } from "../types";
import { Switch } from "@/components/ui/switch";
import { ACADEMIC_RANKS, DEGREES } from "../constants";
import { useDepartments } from "../hooks";

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

export function LecturerForm({
  lecturer,
  onSubmit,
  onCancel,
  isLoading,
  mode,
  isOpen,
  title,
}: LecturerFormProps) {
  const { departments, isLoading: isLoadingDepartments } = useDepartments();

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
        departmentId: data.departmentId && data.departmentId !== 'none' ? Number(data.departmentId) : null,
        academicRank: data.academicRank && data.academicRank !== 'none' ? data.academicRank : null,
        degree: data.degree && data.degree !== 'none' ? data.degree : null,
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
                    <Select
                        value={field.value !== null && field.value !== undefined ? String(field.value) : "none"}
                        onValueChange={field.onChange}
                        disabled={isLoadingDepartments || isLoading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={isLoadingDepartments ? 'Đang tải...' : 'Chọn khoa/đơn vị'} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Không chọn</SelectItem>
                            {departments.map(dept => (
                                <SelectItem key={dept.id} value={dept.id.toString()}>
                                    {dept.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
                        <Select value={field.value || "none"} onValueChange={field.onChange} disabled={isLoading}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Chọn học hàm" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Không chọn</SelectItem>
                                {ACADEMIC_RANKS.map(rank => <SelectItem key={rank} value={rank}>{rank}</SelectItem>)}
                            </SelectContent>
                        </Select>
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
                         <Select value={field.value || "none"} onValueChange={field.onChange} disabled={isLoading}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Chọn học vị" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Không chọn</SelectItem>
                                {DEGREES.map(degree => <SelectItem key={degree} value={degree}>{degree}</SelectItem>)}
                            </SelectContent>
                        </Select>
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