/**
 * Internship Form Component
 * Form for creating and editing internships
 */
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DatePicker } from '@/components/ui/date-picker';
import { Combobox } from '@/components/common/combobox';
import type { Internship, CreateInternshipData, UpdateInternshipData } from '../types';
import { useDebounce } from '@/hooks/use-debounce';
import { getStudentOptions, getAcademicYearOptions, getSemesterOptions, getPartnerOptions } from '@/lib/api/selections.api';

interface InternshipFormProps {
  internship?: Internship | null;
  onSubmit: (data: CreateInternshipData | UpdateInternshipData) => void;
  onCancel: () => void;
  isLoading: boolean;
  mode: 'create' | 'edit';
}

const statusOptions = [
    { value: "pending", label: "Chờ xử lý" },
    { value: "in_progress", label: "Đang thực hiện" },
    { value: "completed", label: "Hoàn thành" },
    { value: "cancelled", label: "Đã hủy" },
];

const internshipFormSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống.'),
  description: z.string().optional(),
  studentId: z.coerce.number().min(1, 'Sinh viên không được để trống.'),
  partnerId: z.coerce.number().min(1, 'Đối tác không được để trống.'),
  academicYearId: z.coerce.number().min(1, 'Năm học không được để trống.'),
  semesterId: z.coerce.number().min(1, 'Học kỳ không được để trống.'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.string().optional(),
});

type InternshipFormData = z.infer<typeof internshipFormSchema>;

export function InternshipForm({
  internship,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: InternshipFormProps) {

  const form = useForm<InternshipFormData>({
    resolver: zodResolver(internshipFormSchema),
    defaultValues: {
      title: '',
      description: '',
      studentId: undefined,
      partnerId: undefined,
      academicYearId: undefined,
      semesterId: undefined,
      startDate: '',
      endDate: '',
      status: 'pending',
    },
  });

  // Search states
  const [studentSearch, setStudentSearch] = useState('');
  const [partnerSearch, setPartnerSearch] = useState('');
  const [academicYearSearch, setAcademicYearSearch] = useState('');
  const [semesterSearch, setSemesterSearch] = useState('');
  
  // Debounced search values
  const debouncedStudentSearch = useDebounce(studentSearch, 300);
  const debouncedPartnerSearch = useDebounce(partnerSearch, 300);
  const debouncedAcademicYearSearch = useDebounce(academicYearSearch, 300);
  const debouncedSemesterSearch = useDebounce(semesterSearch, 300);
  
  // Queries for options
  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['studentOptions', debouncedStudentSearch],
    queryFn: () => getStudentOptions(debouncedStudentSearch),
  });
  
  const { data: partners, isLoading: isLoadingPartners } = useQuery({
    queryKey: ['partnerOptions', debouncedPartnerSearch],
    queryFn: () => getPartnerOptions(debouncedPartnerSearch),
  });
  
  const { data: academicYears, isLoading: isLoadingAcademicYears } = useQuery({
    queryKey: ['academicYearOptions', debouncedAcademicYearSearch],
    queryFn: () => getAcademicYearOptions(debouncedAcademicYearSearch),
  });
  
  const { data: semesters, isLoading: isLoadingSemesters } = useQuery({
    queryKey: ['semesterOptions', debouncedSemesterSearch],
    queryFn: () => getSemesterOptions(debouncedSemesterSearch),
  });

  useEffect(() => {
    if (internship && mode === 'edit') {
      form.reset({
        title: internship.title || '',
        description: internship.description || '',
        studentId: internship.studentId,
        partnerId: internship.partnerId,
        academicYearId: internship.academicYearId,
        semesterId: internship.semesterId,
        startDate: internship.startDate ? new Date(internship.startDate).toISOString().split('T')[0] : '',
        endDate: internship.endDate ? new Date(internship.endDate).toISOString().split('T')[0] : '',
        status: internship.status || 'pending',
      });
    } else {
        form.reset({
            title: '',
            description: '',
            studentId: undefined,
            partnerId: undefined,
            academicYearId: undefined,
            semesterId: undefined,
            startDate: '',
            endDate: '',
            status: 'pending',
        });
    }
  }, [internship, mode, form.reset]);

  const handleFormSubmit = (data: InternshipFormData) => {
    onSubmit(data);
  };
  
  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề thực tập *</Label>
            <Controller
              name="title"
              control={form.control}
              render={({ field }) => <Input {...field} id="title" placeholder="Nhập tiêu đề thực tập" disabled={isLoading} />}
            />
            {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Controller
                name="description"
                control={form.control}
                render={({ field }) => (
                    <Textarea
                        {...field}
                        id="description"
                        value={field.value ?? ""}
                        placeholder="Nhập mô tả thực tập"
                        rows={4}
                        disabled={isLoading}
                    />
                )}
            />
          </div>

          <div className="space-y-2">
            <Label>Sinh viên *</Label>
            <Controller
                name="studentId"
                control={form.control}
                render={({ field }) => (
                    <Combobox
                        options={(students || []).map(s => ({ value: s.id, label: s.name }))}
                        value={field.value}
                        onChange={field.onChange}
                        onInputChange={setStudentSearch}
                        isLoading={isLoadingStudents}
                        disabled={isLoading}
                        placeholder="Chọn sinh viên"
                    />
                )}
            />
             {form.formState.errors.studentId && <p className="text-sm text-destructive">{form.formState.errors.studentId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Đối tác *</Label>
             <Controller
                name="partnerId"
                control={form.control}
                render={({ field }) => (
                    <Combobox
                        options={(partners || []).map(p => ({ value: p.id, label: p.name }))}
                        value={field.value}
                        onChange={field.onChange}
                        onInputChange={setPartnerSearch}
                        isLoading={isLoadingPartners}
                        disabled={isLoading}
                        placeholder="Chọn đối tác"
                    />
                )}
            />
             {form.formState.errors.partnerId && <p className="text-sm text-destructive">{form.formState.errors.partnerId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Năm học *</Label>
            <Controller
                name="academicYearId"
                control={form.control}
                render={({ field }) => (
                    <Combobox
                        options={(academicYears || []).map(y => ({ value: y.id, label: y.name }))}
                        value={field.value}
                        onChange={field.onChange}
                        onInputChange={setAcademicYearSearch}
                        isLoading={isLoadingAcademicYears}
                        disabled={isLoading}
                        placeholder="Chọn năm học"
                    />
                )}
            />
             {form.formState.errors.academicYearId && <p className="text-sm text-destructive">{form.formState.errors.academicYearId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Học kỳ *</Label>
            <Controller
                name="semesterId"
                control={form.control}
                render={({ field }) => (
                    <Combobox
                        options={(semesters || []).map(s => ({ value: s.id, label: s.name }))}
                        value={field.value}
                        onChange={field.onChange}
                        onInputChange={setSemesterSearch}
                        isLoading={isLoadingSemesters}
                        disabled={isLoading}
                        placeholder="Chọn học kỳ"
                    />
                )}
            />
             {form.formState.errors.semesterId && <p className="text-sm text-destructive">{form.formState.errors.semesterId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Ngày bắt đầu</Label>
                <Controller
                    name="startDate"
                    control={form.control}
                    render={({ field }) => (
                        <DatePicker
                            value={field.value}
                            onChange={(date) => field.onChange(date ? new Date(date).toISOString().split('T')[0] : '')}
                            placeholder="Chọn ngày bắt đầu"
                            disabled={isLoading}
                        />
                    )}
                />
            </div>
            <div className="space-y-2">
                 <Label>Ngày kết thúc</Label>
                <Controller
                    name="endDate"
                    control={form.control}
                    render={({ field }) => (
                        <DatePicker
                            value={field.value}
                            onChange={(date) => field.onChange(date ? new Date(date).toISOString().split('T')[0] : '')}
                            placeholder="Chọn ngày kết thúc"
                            disabled={isLoading}
                        />
                    )}
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Trạng thái</Label>
            <Controller
                name="status"
                control={form.control}
                render={({ field }) => (
                    <Combobox
                        options={statusOptions}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                        placeholder="Chọn trạng thái"
                    />
                )}
            />
          </div>
        </form>
      </ScrollArea>

      <div className="flex justify-end space-x-2 p-4 border-t bg-background">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Hủy
        </Button>
        <Button type="button" onClick={form.handleSubmit(handleFormSubmit)} disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
        </Button>
      </div>
    </div>
  );
}
