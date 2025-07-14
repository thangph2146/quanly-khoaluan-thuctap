/**
 * Business Form Component
 */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { BusinessFormProps } from '../types';
import { Modal } from '@/components/common';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const businessFormSchema = z.object({
  name: z.string().min(1, { message: 'Tên business không được để trống.' }),
  displayOrder: z.number().min(0, 'Thứ tự hiển thị phải là số không âm.'),
  description: z.string().optional(),
});

type FormType = z.infer<typeof businessFormSchema>;

export const BusinessForm = React.memo(function BusinessForm({
  business,
  onSubmit,
  onCancel,
  isLoading,
  mode,
  isOpen,
  title,
}: BusinessFormProps) {
  const form = useForm<FormType>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: '',
      displayOrder: 0,
      description: '',
    },
  });

  useEffect(() => {
    if (business && mode === 'edit') {
      form.reset({
        name: business.name || '',
        displayOrder: business.displayOrder,
        description: business.description || '',
      });
    } else {
      form.reset({ name: '', displayOrder: 0, description: '' });
    }
  }, [business, mode, form.reset]);

  function handleFormSubmit(data: FormType) {
    onSubmit(data);
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onCancel()} title={title} className="sm:max-w-lg">
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 p-2">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">Tên business *</Label>
          <Input
            id="name"
            {...form.register('name')}
            placeholder="Ví dụ: Business A"
            required
            disabled={isLoading}
            className={form.formState.errors.name ? 'border-destructive' : ''}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>
        {/* DisplayOrder Field */}
        <div className="space-y-2">
          <Label htmlFor="displayOrder">Thứ tự hiển thị *</Label>
          <Input
            id="displayOrder"
            type="number"
            min={0}
            step={1}
            {...form.register('displayOrder', { valueAsNumber: true })}
            placeholder="Ví dụ: 1"
            required
            disabled={isLoading}
            className={form.formState.errors.displayOrder ? 'border-destructive' : ''}
          />
          {form.formState.errors.displayOrder && (
            <p className="text-sm text-destructive">{form.formState.errors.displayOrder.message}</p>
          )}
        </div>
        {/* Description Field */}
        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <textarea
            id="description"
            {...form.register('description')}
            placeholder="Mô tả về business (không bắt buộc)"
            disabled={isLoading}
            className={form.formState.errors.description ? 'border-destructive w-full rounded border px-3 py-2' : 'w-full rounded border px-3 py-2'}
            rows={3}
          />
          {form.formState.errors.description && (
            <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
          )}
        </div>
        {/* Buttons */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
          </Button>
        </div>
      </form>
    </Modal>
  );
});
