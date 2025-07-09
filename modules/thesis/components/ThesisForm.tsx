/**
 * Thesis Form Component
 * Form for creating and editing thesis
 */
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import type { Thesis, CreateThesisData, UpdateThesisData } from '../types'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { logger } from '@/lib/utils/logger'

interface ThesisFormProps {
  thesis?: Thesis | null
  students: Array<{ id: string; name: string; studentId: string }>
  academicYears: Array<{ id: string; name: string }>
  semesters: Array<{ id: string; name: string }>
  lecturers: Array<{ id: string; name: string; email?: string }>
  onSubmit: (data: CreateThesisData | UpdateThesisData) => void
  onCancel: () => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

type ThesisFormFields = {
  title: string;
  description: string;
  studentId: string;
  supervisorId: string;
  examinerId: string;
  academicYearId: string;
  semesterId: string;
  status: string;
  submissionDate?: string;
};

export function ThesisForm({
  thesis,
  students,
  academicYears,
  semesters,
  lecturers,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: ThesisFormProps) {
  // Add submissionDate to form fields
  const methods = useForm<ThesisFormFields & { submissionDate?: string }>({
    defaultValues: {
      title: '',
      description: '',
      studentId: '',
      supervisorId: '',
      examinerId: 'none',
      academicYearId: '',
      semesterId: '',
      status: 'Draft',
      submissionDate: undefined,
    },
  })

  useEffect(() => {
    if (thesis && mode === 'edit') {
      const resetValues = {
        title: thesis.title || '',
        description: thesis.description || '',
        studentId: thesis.studentId !== undefined && thesis.studentId !== null ? String(thesis.studentId) : '',
        supervisorId: thesis.supervisorId !== undefined && thesis.supervisorId !== null ? String(thesis.supervisorId) : '',
        examinerId: thesis.examinerId !== undefined && thesis.examinerId !== null ? String(thesis.examinerId) : 'none',
        academicYearId: thesis.academicYearId !== undefined && thesis.academicYearId !== null ? String(thesis.academicYearId) : '',
        semesterId: thesis.semesterId !== undefined && thesis.semesterId !== null ? String(thesis.semesterId) : '',
        status: thesis.status || 'pending',
        submissionDate: thesis.submissionDate || undefined,
      }
      logger.formDebug('ThesisForm', 'reset(edit)', resetValues)
      methods.reset(resetValues)
    } else if (mode === 'create') {
      const resetValues = {
        title: '',
        description: '',
        studentId: '',
        supervisorId: '',
        examinerId: 'none',
        academicYearId: '',
        semesterId: '',
        status: 'pending',
        submissionDate: undefined,
      }
      logger.formDebug('ThesisForm', 'reset(create)', resetValues)
      methods.reset(resetValues)
    }
  }, [thesis, mode, methods])

  const handleFormSubmit = methods.handleSubmit((data) => {
    // Convert string to number for select fields
    const submissionData = {
      ...data,
      studentId: data.studentId ? Number(data.studentId) : undefined,
      supervisorId: data.supervisorId ? Number(data.supervisorId) : undefined,
      examinerId: data.examinerId && String(data.examinerId) !== 'none' ? Number(data.examinerId) : undefined,
      academicYearId: data.academicYearId ? Number(data.academicYearId) : undefined,
      semesterId: data.semesterId ? Number(data.semesterId) : undefined,
      status: data.status,
      submissionDate:
        data.submissionDate && data.submissionDate !== ''
          ? data.submissionDate
          : mode === 'create'
          ? new Date().toISOString()
          : undefined,
    }
    logger.formDebug('ThesisForm', 'submit', submissionData)
    onSubmit(submissionData)
  })

  return (
    <FormProvider {...methods}>
        <div className="flex flex-col h-full">
          <ScrollArea className="flex-1">
            <form onSubmit={handleFormSubmit} className="space-y-4 p-4">
              <FormField name="title" control={methods.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề khóa luận *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nhập tiêu đề khóa luận" required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="description" control={methods.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Nhập mô tả khóa luận" rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="studentId" control={methods.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Sinh viên *</FormLabel>
                  <FormControl>
                    <Select value={field.value ? String(field.value) : ''} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn sinh viên" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={String(student.id)}>
                            {student.name} - {student.studentId}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="supervisorId" control={methods.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Giảng viên hướng dẫn *</FormLabel>
                  <FormControl>
                    <Select value={field.value ? String(field.value) : ''} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn giảng viên hướng dẫn" />
                      </SelectTrigger>
                      <SelectContent>
                        {lecturers.map(l => (
                          <SelectItem key={l.id} value={String(l.id)}>
                            {l.name} {l.email ? `(${l.email})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="examinerId" control={methods.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Giảng viên phản biện</FormLabel>
                  <FormControl>
                    <Select value={field.value && field.value !== '' ? String(field.value) : 'none'} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn giảng viên phản biện (nếu có)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">-- Không chọn --</SelectItem>
                        {lecturers.map(l => (
                          <SelectItem key={l.id} value={String(l.id)}>
                            {l.name} {l.email ? `(${l.email})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="academicYearId" control={methods.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Năm học *</FormLabel>
                  <FormControl>
                    <Select value={field.value ? String(field.value) : ''} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn năm học" />
                      </SelectTrigger>
                      <SelectContent>
                        {academicYears.map((year) => (
                          <SelectItem key={year.id} value={String(year.id)}>
                            {year.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="semesterId" control={methods.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Học kỳ *</FormLabel>
                  <FormControl>
                    <Select value={field.value ? String(field.value) : ''} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn học kỳ" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((semester) => (
                          <SelectItem key={semester.id} value={String(semester.id)}>
                            {semester.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="status" control={methods.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <FormControl>
                    <Select value={field.value || 'Draft'} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Chờ phê duyệt</SelectItem>
                        <SelectItem value="approved">Đã phê duyệt</SelectItem>
                        <SelectItem value="rejected">Từ chối</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField
                control={methods.control}
                name="submissionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày nộp</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Chọn ngày nộp"
                      />
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
              onClick={handleFormSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
            </Button>
          </div>
        </div>
    </FormProvider>
  )
}
