import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/common';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import type { Partner, PartnerMutationData } from '../types';

interface PartnerFormProps {
  partner?: Partner | null;
  onSubmit: (data: PartnerMutationData) => void;
  onCancel: () => void;
  isLoading: boolean;
  isOpen: boolean;
  mode: 'create' | 'edit';
}

const partnerFormSchema = z.object({
  name: z.string().min(1, 'Tên không được để trống'),
  email: z.string().email('Email không hợp lệ'),
  phoneNumber: z.string().min(1, 'Số điện thoại không được để trống'),
  address: z.string().min(1, 'Địa chỉ không được để trống'),
  website: z.string().url('URL website không hợp lệ').optional().or(z.literal('')),
  description: z.string().optional(),
  contactPerson: z.string().optional(),
  isActive: z.boolean(),
});

type PartnerFormData = z.infer<typeof partnerFormSchema>;

export const PartnerForm: React.FC<PartnerFormProps> = ({
  partner,
  onSubmit,
  onCancel,
  isLoading,
  isOpen,
  mode,
}) => {
  const isEditMode = mode === 'edit';
  const title = isEditMode ? 'Chỉnh sửa đối tác' : 'Tạo mới đối tác';

  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      address: '',
      website: '',
      description: '',
      contactPerson: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      const defaultValues = isEditMode && partner
        ? {
            name: partner.name,
            email: partner.email,
            phoneNumber: partner.phoneNumber,
            address: partner.address,
            website: partner.website || '',
            description: partner.description || '',
            contactPerson: partner.contactPerson || '',
            isActive: partner.isActive,
          }
        : {
            name: '',
            email: '',
            phoneNumber: '',
            address: '',
            website: '',
            description: '',
            contactPerson: '',
            isActive: true,
          };
      form.reset(defaultValues);
    }
  }, [isOpen, isEditMode, partner, form]);

  const handleFormSubmit = (data: PartnerFormData) => {
    onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onCancel()}
      title={title}
      className="sm:max-w-2xl"
    >
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Tên đối tác *</Label>
            <Input id="name" {...form.register('name')} placeholder="Ví dụ: Công ty ABC" disabled={isLoading} />
            {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" {...form.register('email')} placeholder="Ví dụ: contact@abc.com" disabled={isLoading} />
            {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Số điện thoại *</Label>
            <Input id="phoneNumber" {...form.register('phoneNumber')} placeholder="Ví dụ: 0123456789" disabled={isLoading} />
            {form.formState.errors.phoneNumber && <p className="text-sm text-destructive">{form.formState.errors.phoneNumber.message}</p>}
          </div>
          
          {/* Contact Person */}
          <div className="space-y-2">
            <Label htmlFor="contactPerson">Người liên hệ</Label>
            <Input id="contactPerson" {...form.register('contactPerson')} placeholder="Ví dụ: Nguyễn Văn A" disabled={isLoading} />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">Địa chỉ *</Label>
          <Input id="address" {...form.register('address')} placeholder="Ví dụ: 123 Đường ABC, Quận 1, TP. HCM" disabled={isLoading} />
          {form.formState.errors.address && <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>}
        </div>

        {/* Website */}
        <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" {...form.register('website')} placeholder="Ví dụ: https://abc.com" disabled={isLoading} />
            {form.formState.errors.website && <p className="text-sm text-destructive">{form.formState.errors.website.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea id="description" {...form.register('description')} placeholder="Mô tả ngắn về công ty..." disabled={isLoading} />
        </div>

        {/* IsActive */}
        <div className="flex items-center space-x-2">
            <Checkbox id="isActive" {...form.register('isActive')} checked={form.watch('isActive')} onCheckedChange={(checked) => form.setValue('isActive', !!checked)} disabled={isLoading} />
            <Label htmlFor="isActive" className="cursor-pointer">Còn hoạt động</Label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Hủy</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : (isEditMode ? 'Cập nhật' : 'Tạo mới')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}; 