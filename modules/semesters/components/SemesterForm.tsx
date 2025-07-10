/**
 * Semester Form Component
 * Form for creating and editing semesters
 */
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/common";
import type {
  SemesterMutationData,
  SemesterFormProps,
} from "../types";
import { cn } from "@/lib/utils";

const semesterFormSchema = z.object({
  name: z.string().min(1, {
    message: "Tên học kỳ không được để trống.",
  }),
  academicYearId: z.string().min(1, {
      message: "Vui lòng chọn năm học."
  }),
});


export const SemesterForm = React.memo(function SemesterForm({
  semester,
  academicYears,
  onSubmit,
  onCancel,
  isLoading,
  mode,
  isOpen,
  title,
}: SemesterFormProps) {

  const form = useForm<z.infer<typeof semesterFormSchema>>({
    resolver: zodResolver(semesterFormSchema),
    defaultValues: {
      name: "",
      academicYearId: "",
    },
  });

  useEffect(() => {
    if (semester && mode === 'edit') {
      form.reset({
        name: semester.name || '',
        academicYearId: semester.academicYearId?.toString() || '',
      });
    } else {
      form.reset({
        name: '',
        academicYearId: '',
      });
    }
  }, [semester, mode, form.reset]);

  function handleFormSubmit(data: z.infer<typeof semesterFormSchema>) {
    const submissionData = {
      ...data,
      academicYearId: Number(data.academicYearId)
    };
    onSubmit(submissionData as SemesterMutationData);
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
          <Label htmlFor="name">Tên học kỳ *</Label>
          <Input
            id="name"
            {...form.register("name")}
            placeholder="Ví dụ: Học kỳ 1"
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

        <div className="space-y-2">
          <Label htmlFor="academicYearId">Năm học *</Label>
          <Controller
            name="academicYearId"
            control={form.control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isLoading}
              >
                <SelectTrigger
                  id="academicYearId"
                  className={cn(
                    form.formState.errors.academicYearId ? "border-destructive" : "",
                    "w-full"
                  )}
                >
                  <SelectValue placeholder="Chọn năm học" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((d) => (
                      <SelectItem key={d.id} value={d.id.toString()}>
                        {d.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.academicYearId && (
            <p className="text-sm text-destructive">
              {String(form.formState.errors.academicYearId.message)}
            </p>
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
