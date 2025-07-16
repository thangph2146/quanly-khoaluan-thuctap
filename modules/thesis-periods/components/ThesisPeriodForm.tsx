import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/common";
import type {
  ThesisPeriodMutationData,
  ThesisPeriodFormProps,
} from "../types";
import { Combobox } from "@/components/common/combobox";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { getAcademicYearOptions, getSemesterOptions, type SelectionOption } from "@/lib/api/selections.api";
import { DatePicker } from "@/components/ui/date-picker";
import { Controller } from "react-hook-form";

const thesisPeriodFormSchema = z.object({
  name: z.string().min(1, { message: "Tên đợt không được để trống." }),
  description: z.string().optional(),
  startDate: z.string().min(1, { message: "Ngày bắt đầu không được để trống." }).refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Ngày bắt đầu không hợp lệ." }
  ),
  endDate: z.string().min(1, { message: "Ngày kết thúc không được để trống." }).refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Ngày kết thúc không hợp lệ." }
  ),
  academicYearId: z.preprocess(
    (val) => {
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number({ required_error: "Năm học là bắt buộc." }).min(1, { message: "Năm học là bắt buộc." })
  ),
  semesterId: z.preprocess(
    (val) => {
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number({ required_error: "Học kỳ là bắt buộc." }).min(1, { message: "Học kỳ là bắt buộc." })
  ),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) < new Date(data.endDate);
    }
    return true;
  },
  {
    message: "Ngày bắt đầu phải trước ngày kết thúc.",
    path: ["endDate"],
  }
);

// Định nghĩa type input cho form để khớp với schema preprocess
type ThesisPeriodFormInput = {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  academicYearId?: unknown;
  semesterId?: unknown;
};

export const ThesisPeriodForm = React.memo(function ThesisPeriodForm({
  thesisPeriod,
  onSubmit,
  onCancel,
  isLoading,
  mode,
  isOpen,
  title,
}: ThesisPeriodFormProps) {
  const form = useForm<ThesisPeriodFormInput>({
    resolver: zodResolver(thesisPeriodFormSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      academicYearId: 1,
      semesterId: 1,
    },
  });

  // Logic lấy options năm học giống DepartmentForm
  const [academicYearSearch, setAcademicYearSearch] = useState("");
  const debouncedAcademicYearSearch = useDebounce(academicYearSearch, 300);
  const { data: academicYearOptions = [], isLoading: isLoadingYears } = useQuery({
    queryKey: ["academicYearOptions", debouncedAcademicYearSearch],
    queryFn: () => getAcademicYearOptions(debouncedAcademicYearSearch),
    initialData: [],
  });
  // Logic lấy options học kỳ giống DepartmentForm
  const [semesterSearch, setSemesterSearch] = useState("");
  const debouncedSemesterSearch = useDebounce(semesterSearch, 300);
  const { data: semesterOptions = [], isLoading: isLoadingSemesters } = useQuery({
    queryKey: ["semesterOptions", debouncedSemesterSearch],
    queryFn: () => getSemesterOptions(debouncedSemesterSearch),
    initialData: [],
  });

  useEffect(() => {
    if (thesisPeriod && mode === "edit") {
      form.reset({
        name: thesisPeriod.name || "",
        description: thesisPeriod.description || "",
        startDate: thesisPeriod.startDate || "",
        endDate: thesisPeriod.endDate || "",
        academicYearId: thesisPeriod.academicYearId,
        semesterId: thesisPeriod.semesterId,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        academicYearId: 1,
        semesterId: 1,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thesisPeriod, mode, academicYearOptions, semesterOptions]);

  function handleFormSubmit(data: ThesisPeriodFormInput) {
    // Đảm bảo backend nhận đúng định dạng yyyy-MM-dd hoặc yyyy-MM-ddTHH:mm:ss nếu cần
    const submissionData = {
      ...data,
      academicYearId: Number(data.academicYearId),
      semesterId: Number(data.semesterId),
      startDate: data.startDate.length === 10 ? `${data.startDate}T00:00:00` : data.startDate,
      endDate: data.endDate.length === 10 ? `${data.endDate}T00:00:00` : data.endDate,
    };
    onSubmit(submissionData as ThesisPeriodMutationData);
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
          <Label htmlFor="name">Tên đợt *</Label>
          <Input
            id="name"
            {...form.register("name")}
            placeholder="Ví dụ: Đợt 1 năm 2024"
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
          <Input
            id="description"
            {...form.register("description")}
            placeholder="Mô tả ngắn về đợt"
            disabled={isLoading}
            className={form.formState.errors.description ? "border-destructive" : ""}
          />
          {form.formState.errors.description && (
            <p className="text-sm text-destructive">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        {/* Start Date Field */}
        <div className="space-y-2">
          <Controller
            name="startDate"
            control={form.control}
            render={({ field }) => (
              <DatePicker
                label="Ngày bắt đầu"
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
        {/* End Date Field */}
        <div className="space-y-2">
          <Controller
            name="endDate"
            control={form.control}
            render={({ field }) => (
              <DatePicker
              label="Ngày kết thúc"
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

        {/* Academic Year Field */}
        <div className="space-y-2">
          <Label htmlFor="academicYearId">Năm học *</Label>
          <Combobox
            options={academicYearOptions.map((y: SelectionOption) => ({ value: y.id, label: y.name }))}
            value={typeof form.watch("academicYearId") === "number" || typeof form.watch("academicYearId") === "string"
              ? (form.watch("academicYearId") as string | number)
              : null}
            onChange={val => form.setValue("academicYearId", Number(val))}
            onInputChange={setAcademicYearSearch}
            placeholder="Chọn năm học"
            disabled={isLoading || isLoadingYears}
            isLoading={isLoadingYears}
          />
          {form.formState.errors.academicYearId && (
            <p className="text-sm text-destructive">
              {form.formState.errors.academicYearId.message}
            </p>
          )}
        </div>
        {/* Semester Field */}
        <div className="space-y-2">
          <Label htmlFor="semesterId">Học kỳ *</Label>
          <Combobox
            options={semesterOptions.map((s: SelectionOption) => ({ value: s.id, label: s.name }))}
            value={typeof form.watch("semesterId") === "number" || typeof form.watch("semesterId") === "string"
              ? (form.watch("semesterId") as string | number)
              : null}
            onChange={val => form.setValue("semesterId", Number(val))}
            onInputChange={setSemesterSearch}
            placeholder={semesterOptions.length === 0 ? "Không có học kỳ" : "Chọn học kỳ"}
            disabled={isLoading || isLoadingSemesters || semesterOptions.length === 0}
            isLoading={isLoadingSemesters}
          />
          {form.formState.errors.semesterId && (
            <p className="text-sm text-destructive">
              {form.formState.errors.semesterId.message}
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
          <Button type="submit" disabled={isLoading || semesterOptions.length === 0}>
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