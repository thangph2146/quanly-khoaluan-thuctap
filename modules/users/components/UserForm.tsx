/**
 * User Form Component
 * Form for creating and editing users
 */
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Modal } from '@/components/common';
import { MultipleCombobox } from '@/components/common/multiple-combobox';
import { getRoleOptions } from '@/lib/api/selections.api';
import { useDebounce } from '@/hooks/use-debounce';
import type { User, CreateUserData, UpdateUserData } from '../types';

interface UserFormProps {
  isOpen: boolean;
  user?: User | null;
  onSubmit: (data: CreateUserData | UpdateUserData) => void;
  onCancel: () => void;
  isLoading: boolean;
  mode: 'create' | 'edit';
}

const userFormSchema = z.object({
  name: z.string().min(1, 'Họ và tên là bắt buộc'),
  email: z.string().email('Email không hợp lệ'),
  avatarUrl: z.string().url('URL ảnh đại diện không hợp lệ').optional().or(z.literal('')),
  isActive: z.boolean(),
  keycloakUserId: z.string(),
  roleIds: z.array(z.number()).min(1, 'Vui lòng chọn ít nhất một vai trò'),
});

type UserFormData = z.infer<typeof userFormSchema>;

export function UserForm({ isOpen, user, onSubmit, onCancel, isLoading, mode }: UserFormProps) {
  const [roleSearch, setRoleSearch] = useState('');
  const debouncedRoleSearch = useDebounce(roleSearch, 300);

  const { data: roleOptions, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roleOptions', debouncedRoleSearch],
    queryFn: () => getRoleOptions(debouncedRoleSearch),
    initialData: [],
  });

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      avatarUrl: '',
      isActive: true,
      keycloakUserId: '',
      roleIds: [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (user) {
        const selectedRoleIds = (roleOptions || [])
          .filter(option => user.userRoles?.includes(option.name))
          .map(option => option.id);
        
        form.reset({
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl || '',
          isActive: user.isActive,
          keycloakUserId: user.keycloakUserId,
          roleIds: selectedRoleIds,
        });
      } else {
        form.reset({
          name: '',
          email: '',
          avatarUrl: '',
          isActive: true,
          keycloakUserId: crypto.randomUUID(),
          roleIds: [],
        });
      }
    }
  }, [user, isOpen, form, roleOptions]);

  const handleSubmit = (data: UserFormData) => {
    onSubmit(data);
  };

  const title = mode === 'create' ? 'Tạo người dùng mới' : 'Cập nhật người dùng';

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onCancel()}
      title={title}
      className="sm:max-w-lg"
    >
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-2">
        <div className="space-y-2">
          <Label htmlFor="name">Họ và tên</Label>
          <Input
            id="name"
            {...form.register('name')}
            placeholder="Nhập họ và tên"
            disabled={isLoading}
          />
          {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...form.register('email')}
            placeholder="Nhập email"
            disabled={isLoading}
          />
          {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatarUrl">URL Ảnh đại diện</Label>
          <Input
            id="avatarUrl"
            {...form.register('avatarUrl')}
            placeholder="https://example.com/avatar.jpg"
            disabled={isLoading}
          />
          {form.formState.errors.avatarUrl && <p className="text-sm text-destructive">{form.formState.errors.avatarUrl.message}</p>}
        </div>

        <input type="hidden" {...form.register('keycloakUserId')} />

        <div className="space-y-2">
          <Label htmlFor="roleIds">Vai trò</Label>
          <Controller
            name="roleIds"
            control={form.control}
            render={({ field }) => (
              <MultipleCombobox
                options={(roleOptions || []).map(r => ({ value: r.id, label: r.name }))}
                value={field.value}
                onChange={field.onChange}
                onInputChange={setRoleSearch}
                isLoading={isLoadingRoles}
                disabled={isLoading}
                placeholder="Chọn vai trò"
              />
            )}
          />
          {form.formState.errors.roleIds && <p className="text-sm text-destructive">{form.formState.errors.roleIds.message}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <Controller
            name="isActive"
            control={form.control}
            render={({ field }) => (
              <Switch
                id="isActive"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isLoading}
              />
            )}
          />
          <Label htmlFor="isActive">Kích hoạt tài khoản</Label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Đang lưu...' : mode === 'create' ? 'Tạo người dùng' : 'Cập nhật'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
