/**
 * Academic Year Form Component
 * Form for creating and editing academic years
 */
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Modal } from "@/components/common";
import type { AcademicYear, CreateAcademicYearData, UpdateAcademicYearData } from '../types';

interface AcademicYearFormProps {
  academicYear?: AcademicYear | null;
  onSubmit: (data: CreateAcademicYearData | UpdateAcademicYearData) => void;
  onCancel: () => void;
  isLoading: boolean;
  mode: 'create' | 'edit';
  isOpen: boolean;
  title: string;
}

const academicYearFormSchema = z.object({
  name: z.string().min(1, { message: "Tên năm học không được để trống." }),
  startDate: z.string().min(1, { message: "Ngày bắt đầu không được để trống." }),
  endDate: z.string().min(1, { message: "Ngày kết thúc không được để trống." }),
}).refine(data => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) < new Date(data.endDate);
  }
  return true;
}, {
  message: "Ngày bắt đầu phải trước ngày kết thúc.",
  path: ["endDate"],
});

export function AcademicYearForm({
  academicYear,
  onSubmit,
  onCancel,
  isLoading,
  mode,
  isOpen,
  title,
}: AcademicYearFormProps) {

  const form = useForm<z.infer<typeof academicYearFormSchema>>({
    resolver: zodResolver(academicYearFormSchema),
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
    },
  });

  const formatDateForInput = (dateString?: string): string => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  useEffect(() => {
    if (academicYear && mode === 'edit') {
      form.reset({
        name: academicYear.name || '',
        startDate: formatDateForInput(academicYear.startDate),
        endDate: formatDateForInput(academicYear.endDate),
      });
    } else {
      form.reset({
        name: '',
        startDate: '',
        endDate: '',
      });
    }
  }, [academicYear, mode, form.reset]);

  function handleFormSubmit(data: z.infer<typeof academicYearFormSchema>) {
    const submissionData = {
      ...data,
      startDate: `${data.startDate}T00:00:00`,
      endDate: `${data.endDate}T00:00:00`,
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
        <div className="space-y-2">
          <Label htmlFor="name">Tên năm học *</Label>
          <Input
            id="name"
            {...form.register("name")}
            placeholder="Ví dụ: 2024-2025"
            disabled={isLoading}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Ngày bắt đầu *</Label>
          <Controller
            name="startDate"
            control={form.control}
            render={({ field }) => (
              <DatePicker
                id="startDate"
                value={field.value}
                onChange={field.onChange}
                placeholder="Chọn ngày bắt đầu"
                disabled={isLoading}
              />
            )}
          />
          {form.formState.errors.startDate && (
            <p className="text-sm text-destructive">{form.formState.errors.startDate.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">Ngày kết thúc *</Label>
          <Controller
            name="endDate"
            control={form.control}
            render={({ field }) => (
              <DatePicker
                id="endDate"
                value={field.value}
                onChange={field.onChange}
                placeholder="Chọn ngày kết thúc"
                disabled={isLoading}
              />
            )}
          />
          {form.formState.errors.endDate && (
            <p className="text-sm text-destructive">{form.formState.errors.endDate.message}</p>
          )}
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
            {isLoading ? "Đang xử lý..." : mode === "create" ? "Tạo mới" : "Cập nhật"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
