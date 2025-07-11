import React, { useEffect, useState } from "react";
import { useForm, Controller, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/common";
import { Combobox } from "@/components/common/combobox";
import { useDebounce } from "@/hooks/use-debounce";
import type { InternshipFormProps, CreateInternshipData, UpdateInternshipData } from "../types";
import { getStudentOptions, getPartnerOptions, getAcademicYearOptions, getSemesterOptions } from "@/lib/api/selections.api";

const internshipFormSchema = z.object({
  studentId: z.number().min(1, "Vui lòng chọn sinh viên."),
  partnerId: z.number().min(1, "Vui lòng chọn công ty."),
  academicYearId: z.number().min(1, "Vui lòng chọn năm học."),
  semesterId: z.number().min(1, "Vui lòng chọn học kỳ."),
  grade: z.coerce.number().min(0).max(10).optional().nullable(),
  reportUrl: z.string().url("URL báo cáo không hợp lệ.").optional().or(z.literal('')),
});

type InternshipFormData = z.infer<typeof internshipFormSchema>;

export const InternshipForm = React.memo(function InternshipForm({
  internship,
  onSubmit,
  onCancel,
  isLoading,
  mode,
  isOpen,
  title,
}: InternshipFormProps) {
  const form = useForm<InternshipFormData>({
    resolver: zodResolver(internshipFormSchema),
    defaultValues: {
      studentId: undefined,
      partnerId: undefined,
      academicYearId: undefined,
      semesterId: undefined,
      grade: null,
      reportUrl: '',
    },
  });

  // Search states
  const [studentSearch, setStudentSearch] = useState('');
  const [partnerSearch, setPartnerSearch] = useState('');
  const [academicYearSearch, setAcademicYearSearch] = useState('');
  const [semesterSearch, setSemesterSearch] = useState('');

  // Debounced search terms
  const debouncedStudentSearch = useDebounce(studentSearch, 300);
  const debouncedPartnerSearch = useDebounce(partnerSearch, 300);
  const debouncedAcademicYearSearch = useDebounce(academicYearSearch, 300);
  const debouncedSemesterSearch = useDebounce(semesterSearch, 300);

  // Queries for dropdown options
  const { data: studentOptions, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['studentOptions', debouncedStudentSearch],
    queryFn: () => getStudentOptions(debouncedStudentSearch),
    initialData: [],
  });
  
  const { data: partnerOptions, isLoading: isLoadingPartners } = useQuery({
    queryKey: ['partnerOptions', debouncedPartnerSearch],
    queryFn: () => getPartnerOptions(debouncedPartnerSearch),
    initialData: [],
  });

  const { data: academicYearOptions, isLoading: isLoadingAcademicYears } = useQuery({
    queryKey: ['academicYearOptions', debouncedAcademicYearSearch],
    queryFn: () => getAcademicYearOptions(debouncedAcademicYearSearch),
    initialData: [],
  });

  const { data: semesterOptions, isLoading: isLoadingSemesters } = useQuery({
    queryKey: ['semesterOptions', debouncedSemesterSearch],
    queryFn: () => getSemesterOptions(debouncedSemesterSearch),
    initialData: [],
  });


  useEffect(() => {
    if (internship && mode === 'edit') {
      form.reset({
        studentId: internship.studentId,
        partnerId: internship.partnerId,
        academicYearId: internship.academicYearId,
        semesterId: internship.semesterId,
        grade: internship.grade,
        reportUrl: internship.reportUrl || '',
      });
    } else {
      form.reset({
        studentId: undefined,
        partnerId: undefined,
        academicYearId: undefined,
        semesterId: undefined,
        grade: null,
        reportUrl: '',
      });
    }
  }, [internship, mode, form.reset]);

  function handleFormSubmit(data: InternshipFormData) {
    onSubmit(data as CreateInternshipData | UpdateInternshipData);
  }

  const renderCombobox = (
    name: keyof InternshipFormData, 
    control: Control<InternshipFormData>, 
    options: { id: number; name: string }[], 
    isLoading: boolean, 
    onInputChange: React.Dispatch<React.SetStateAction<string>>, 
    placeholder: string
  ) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Combobox
          options={(options || []).map((opt) => ({ value: opt.id, label: opt.name }))}
          value={field.value}
          onChange={field.onChange}
          onInputChange={onInputChange}
          isLoading={isLoading}
          disabled={isLoading}
          placeholder={placeholder}
        />
      )}
    />
  );

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
        {renderCombobox("studentId", form.control, studentOptions, isLoadingStudents, setStudentSearch, "Tìm kiếm sinh viên...")}
        {form.formState.errors.studentId && <p className="text-sm text-destructive">{form.formState.errors.studentId.message}</p>}

        {renderCombobox("partnerId", form.control, partnerOptions, isLoadingPartners, setPartnerSearch, "Tìm kiếm công ty...")}
        {form.formState.errors.partnerId && <p className="text-sm text-destructive">{form.formState.errors.partnerId.message}</p>}

        {renderCombobox("academicYearId", form.control, academicYearOptions, isLoadingAcademicYears, setAcademicYearSearch, "Tìm kiếm năm học...")}
        {form.formState.errors.academicYearId && <p className="text-sm text-destructive">{form.formState.errors.academicYearId.message}</p>}

        {renderCombobox("semesterId", form.control, semesterOptions, isLoadingSemesters, setSemesterSearch, "Tìm kiếm học kỳ...")}
        {form.formState.errors.semesterId && <p className="text-sm text-destructive">{form.formState.errors.semesterId.message}</p>}

        <div className="space-y-2">
          <Label htmlFor="grade">Điểm</Label>
          <Input id="grade" {...form.register("grade")} type="number" step="0.1" placeholder="Ví dụ: 8.5" disabled={isLoading} />
          {form.formState.errors.grade && <p className="text-sm text-destructive">{form.formState.errors.grade.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reportUrl">URL Báo cáo</Label>
          <Input id="reportUrl" {...form.register("reportUrl")} placeholder="https://..." disabled={isLoading} />
          {form.formState.errors.reportUrl && <p className="text-sm text-destructive">{form.formState.errors.reportUrl.message}</p>}
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Hủy</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : mode === "create" ? "Tạo mới" : "Cập nhật"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}); 