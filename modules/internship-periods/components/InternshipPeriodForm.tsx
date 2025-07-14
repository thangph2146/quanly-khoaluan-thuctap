import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/common';
import type { InternshipPeriodMutationData, InternshipPeriodFormProps } from '../types';

const createInternshipPeriodFormSchema = z.object({
  name: z.string().min(1, { message: 'Tên đợt thực tập không được để trống.' }),
  description: z.string().optional(),
  startDate: z.string().min(1, { message: 'Ngày bắt đầu không được để trống.' }),
  endDate: z.string().min(1, { message: 'Ngày kết thúc không được để trống.' }),
  academicYearId: z.coerce.number().min(1, { message: 'Năm học là bắt buộc.' }),
  semesterId: z.coerce.number().min(1, { message: 'Học kỳ là bắt buộc.' }),
});

export const InternshipPeriodForm = React.memo(function InternshipPeriodForm({
  internshipPeriod,
  onSubmit,
  onCancel,
  isLoading,
  mode,
  isOpen,
  title,
}: InternshipPeriodFormProps) {
  const form = useForm<z.infer<typeof createInternshipPeriodFormSchema>>({
    resolver: zodResolver(createInternshipPeriodFormSchema),
    defaultValues: {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      academicYearId: undefined,
      semesterId: undefined,
    },
  });

  useEffect(() => {
    if (internshipPeriod && mode === 'edit') {
      form.reset({
        name: internshipPeriod.name || '',
        description: internshipPeriod.description || '',
        startDate: internshipPeriod.startDate || '',
        endDate: internshipPeriod.endDate || '',
        academicYearId: internshipPeriod.academicYearId,
        semesterId: internshipPeriod.semesterId,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        academicYearId: undefined,
        semesterId: undefined,
      });
    }
  }, [internshipPeriod, mode, form.reset]);

  function handleFormSubmit(data: z.infer<typeof createInternshipPeriodFormSchema>) {
    onSubmit(data as InternshipPeriodMutationData);
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onCancel()}
      title={title}
      className="sm:max-w-lg"
    >
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 p-2">
        <div className="space-y-2">
          <Label htmlFor="name">Tên đợt thực tập *</Label>
          <Input id="name" {...form.register('name')} placeholder="Ví dụ: Đợt thực tập hè 2025" required disabled={isLoading} className={form.formState.errors.name ? 'border-destructive' : ''} />
          {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Input id="description" {...form.register('description')} placeholder="Mô tả ngắn..." disabled={isLoading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startDate">Ngày bắt đầu *</Label>
          <Input id="startDate" type="date" {...form.register('startDate')} required disabled={isLoading} className={form.formState.errors.startDate ? 'border-destructive' : ''} />
          {form.formState.errors.startDate && <p className="text-sm text-destructive">{form.formState.errors.startDate.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">Ngày kết thúc *</Label>
          <Input id="endDate" type="date" {...form.register('endDate')} required disabled={isLoading} className={form.formState.errors.endDate ? 'border-destructive' : ''} />
          {form.formState.errors.endDate && <p className="text-sm text-destructive">{form.formState.errors.endDate.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="academicYearId">Năm học *</Label>
          <Input id="academicYearId" type="number" {...form.register('academicYearId')} required disabled={isLoading} className={form.formState.errors.academicYearId ? 'border-destructive' : ''} />
          {form.formState.errors.academicYearId && <p className="text-sm text-destructive">{form.formState.errors.academicYearId.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="semesterId">Học kỳ *</Label>
          <Input id="semesterId" type="number" {...form.register('semesterId')} required disabled={isLoading} className={form.formState.errors.semesterId ? 'border-destructive' : ''} />
          {form.formState.errors.semesterId && <p className="text-sm text-destructive">{form.formState.errors.semesterId.message}</p>}
        </div>
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Hủy</Button>
          <Button type="submit" disabled={isLoading}>{isLoading ? 'Đang xử lý...' : mode === 'create' ? 'Tạo mới' : 'Cập nhật'}</Button>
        </div>
      </form>
    </Modal>
  );
}); 