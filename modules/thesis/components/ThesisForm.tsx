import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Combobox } from '@/components/common/combobox';
import { Modal } from '@/components/common';
import type { ThesisFormProps, ThesisMutationData } from '../types';
import { getAcademicYearOptions, getLecturerOptions, getSemesterOptions, getStudentOptions } from '@/lib/api/selections.api';
import { useDebounce } from '@/hooks/use-debounce';
import { Label } from '@/components/ui/label';

const thesisStatusOptions = [
  { value: 'Draft', label: 'Bản nháp' },
  { value: 'Submitted', label: 'Đã nộp' },
  { value: 'In-Progress', label: 'Đang thực hiện' },
  { value: 'Approved', label: 'Đã duyệt' },
  { value: 'Rejected', label: 'Bị từ chối' },
  { value: 'Completed', label: 'Đã hoàn thành' },
];

const thesisFormSchema = z.object({
  title: z.string().min(1, 'Tên khóa luận không được để trống.'),
  description: z.string().optional(),
  studentId: z.coerce.number().min(1, 'Sinh viên không được để trống'),
  supervisorId: z.coerce.number().min(1, 'GVHD không được để trống'),
  examinerId: z.coerce.number().positive('ID không hợp lệ').nullable().optional(),
  academicYearId: z.coerce.number().min(1, 'Năm học không được để trống'),
  semesterId: z.coerce.number().min(1, 'Học kỳ không được để trống'),
  submissionDate: z.string().min(1, 'Ngày nộp không được để trống.'),
  status: z.string().optional(),
});

type ThesisFormData = z.infer<typeof thesisFormSchema>;

export function ThesisForm({
  thesis,
  onSubmit,
  onCancel,
  isLoading,
  mode,
  isOpen,
  title,
}: ThesisFormProps) {
  const form = useForm<ThesisFormData>({
    resolver: zodResolver(thesisFormSchema),
    defaultValues: {
      title: '',
      description: '',
      studentId: undefined,
      supervisorId: undefined,
      examinerId: null,
      academicYearId: undefined,
      semesterId: undefined,
      submissionDate: '',
      status: 'Draft',
    },
  });

  const [academicYearSearch, setAcademicYearSearch] = useState('');
  const [semesterSearch, setSemesterSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [supervisorSearch, setSupervisorSearch] = useState('');
  const [examinerSearch, setExaminerSearch] = useState('');

  const debouncedAcademicYearSearch = useDebounce(academicYearSearch, 300);
  const debouncedSemesterSearch = useDebounce(semesterSearch, 300);
  const debouncedStudentSearch = useDebounce(studentSearch, 300);
  const debouncedSupervisorSearch = useDebounce(supervisorSearch, 300);
  const debouncedExaminerSearch = useDebounce(examinerSearch, 300);

  const { data: academicYears, isLoading: isLoadingAcademicYears } = useQuery({
    queryKey: ['academicYearOptions', debouncedAcademicYearSearch],
    queryFn: () => getAcademicYearOptions(debouncedAcademicYearSearch),
  });

  const { data: semesters, isLoading: isLoadingSemesters } = useQuery({
    queryKey: ['semesterOptions', debouncedSemesterSearch],
    queryFn: () => getSemesterOptions(debouncedSemesterSearch),
  });

  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['studentOptions', debouncedStudentSearch],
    queryFn: () => getStudentOptions(debouncedStudentSearch),
  });

  const { data: supervisors, isLoading: isLoadingSupervisors } = useQuery({
    queryKey: ['supervisorOptions', debouncedSupervisorSearch],
    queryFn: () => getLecturerOptions(debouncedSupervisorSearch),
  });

  const { data: examiners, isLoading: isLoadingExaminers } = useQuery({
    queryKey: ['examinerOptions', debouncedExaminerSearch],
    queryFn: () => getLecturerOptions(debouncedExaminerSearch),
  });


  useEffect(() => {
    if (thesis && mode === 'edit') {
      form.reset({
        ...thesis,
        description: thesis.description ?? '',
        examinerId: thesis.examinerId ?? null,
        status: thesis.status ?? 'Draft',
        submissionDate: new Date(thesis.submissionDate).toISOString().split('T')[0],
      });
    } else {
      form.reset({
        title: '',
        description: '',
        studentId: undefined,
        supervisorId: undefined,
        examinerId: null,
        academicYearId: undefined,
        semesterId: undefined,
        submissionDate: new Date().toISOString().split('T')[0],
        status: 'Draft',
      });
    }
  }, [thesis, mode, form.reset]);

  function handleFormSubmit(data: ThesisFormData) {
    const submissionData: ThesisMutationData = {
      ...data,
      studentId: Number(data.studentId),
      supervisorId: Number(data.supervisorId),
      academicYearId: Number(data.academicYearId),
      semesterId: Number(data.semesterId),
      examinerId: data.examinerId ? Number(data.examinerId) : null,
      submissionDate: new Date(data.submissionDate).toISOString(),
    };
    onSubmit(submissionData);
  }
  
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onCancel()}
      title={title}
      className="sm:max-w-2xl"
    >
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 p-2">
        <div className="space-y-2">
          <Label htmlFor="title">Tên khóa luận *</Label>
          <Controller
            name="title"
            control={form.control}
            render={({ field }) => (
              <Input {...field} id="title" disabled={isLoading} />
            )}
          />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Controller
            name="description"
            control={form.control}
            render={({ field }) => (
              <Textarea {...field} id="description" value={field.value ?? ''} disabled={isLoading} />
            )}
          />
          {form.formState.errors.description && (
            <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="Tìm kiếm sinh viên..."
                />
              )}
            />
            {form.formState.errors.studentId && (
              <p className="text-sm text-destructive">{form.formState.errors.studentId.message}</p>
            )}
          </div>
          {/* <div className="space-y-2">
            <Label>GV Hướng dẫn *</Label>
            <Controller
              name="supervisorId"
              control={form.control}
              render={({ field }) => (
                <Combobox
                  options={(supervisors || []).map(l => ({ value: l.id, label: l.name }))}
                  value={field.value}
                  onChange={field.onChange}
                  onInputChange={setSupervisorSearch}
                  isLoading={isLoadingSupervisors}
                  disabled={isLoading}
                  placeholder="Tìm kiếm GVHD..."
                />
              )}
            />
            {form.formState.errors.supervisorId && (
              <p className="text-sm text-destructive">{form.formState.errors.supervisorId.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>GV Phản biện</Label>
            <Controller
              name="examinerId"
              control={form.control}
              render={({ field }) => (
                <Combobox
                  options={(examiners || []).map(l => ({ value: l.id, label: l.name }))}
                  value={field.value}
                  onChange={field.onChange}
                  onInputChange={setExaminerSearch}
                  isLoading={isLoadingExaminers}
                  disabled={isLoading}
                  placeholder="Tìm kiếm GVPB..."
                />
              )}
            />
            {form.formState.errors.examinerId && (
              <p className="text-sm text-destructive">{form.formState.errors.examinerId.message}</p>
            )}
          </div> */}
          <div className="space-y-2">
            <Label>Năm học *</Label>
            <Controller
              name="academicYearId"
              control={form.control}
              render={({ field }) => (
                <Combobox
                  options={(academicYears || []).map(ay => ({ value: ay.id, label: ay.name }))}
                  value={field.value}
                  onChange={field.onChange}
                  onInputChange={setAcademicYearSearch}
                  isLoading={isLoadingAcademicYears}
                  disabled={isLoading}
                  placeholder="Tìm kiếm năm học..."
                />
              )}
            />
            {form.formState.errors.academicYearId && (
              <p className="text-sm text-destructive">{form.formState.errors.academicYearId.message}</p>
            )}
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
                  placeholder="Tìm kiếm học kỳ..."
                />
              )}
            />
            {form.formState.errors.semesterId && (
              <p className="text-sm text-destructive">{form.formState.errors.semesterId.message}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="submissionDate">Ngày nộp *</Label>
              <Controller
                name="submissionDate"
                control={form.control}
                render={({ field }) => (
                  <Input type="date" {...field} id="submissionDate" disabled={isLoading} />
                )}
              />
              {form.formState.errors.submissionDate && (
                <p className="text-sm text-destructive">{form.formState.errors.submissionDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Controller
                name="status"
                control={form.control}
                render={({ field }) => (
                  <Combobox
                    options={thesisStatusOptions}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isLoading}
                    placeholder="Chọn trạng thái"
                  />
                )}
              />
              {form.formState.errors.status && (
                <p className="text-sm text-destructive">{form.formState.errors.status.message}</p>
              )}
            </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Hủy</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
          </Button>
        </div>
      </form>
    </Modal>
  );
} 