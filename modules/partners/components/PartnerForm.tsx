/**
 * Partner Form Component
 * Form for creating and editing partners
 */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Partner, CreatePartnerData, UpdatePartnerData } from '../types';

interface PartnerFormProps {
  partner?: Partner | null;
  onSubmit: (data: CreatePartnerData | UpdatePartnerData) => void;
  onCancel: () => void;
  isLoading: boolean;
  mode: 'create' | 'edit';
}

const partnerFormSchema = z.object({
  name: z.string().min(1, 'Tên đối tác không được để trống'),
  email: z.string().email('Email không hợp lệ').min(1, 'Email không được để trống'),
  phoneNumber: z.string().min(1, 'Số điện thoại không được để trống'),
  address: z.string().min(1, 'Địa chỉ không được để trống'),
});

type PartnerFormData = z.infer<typeof partnerFormSchema>;

export function PartnerForm({
  partner,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: PartnerFormProps) {
  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      address: '',
    },
  });

  useEffect(() => {
    if (partner && mode === 'edit') {
      form.reset({
        name: partner.name || '',
        email: partner.email || '',
        phoneNumber: partner.phoneNumber || '',
        address: partner.address || '',
      });
    } else {
      form.reset({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
      });
    }
  }, [partner, mode, form.reset]);

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên đối tác *</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="Nhập tên đối tác"
              disabled={isLoading}
            />
            {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              placeholder="Nhập email đối tác"
              disabled={isLoading}
            />
            {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Số điện thoại *</Label>
            <Input
              id="phoneNumber"
              {...form.register('phoneNumber')}
              placeholder="Nhập số điện thoại"
              disabled={isLoading}
            />
            {form.formState.errors.phoneNumber && <p className="text-sm text-destructive">{form.formState.errors.phoneNumber.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ *</Label>
            <Textarea
              id="address"
              {...form.register('address')}
              placeholder="Nhập địa chỉ đối tác"
              rows={3}
              disabled={isLoading}
            />
            {form.formState.errors.address && <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>}
          </div>
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
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? 'Đang xử lý...' : mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
        </Button>
      </div>
    </div>
  );
}
