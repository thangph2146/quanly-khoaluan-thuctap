/**
 * Partner Form Component
 * Form for creating and editing partners
 */
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  useForm,
  FormProvider,
} from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import type { Partner, CreatePartnerData, UpdatePartnerData } from '../types'

interface PartnerFormProps {
  partner?: Partner | null
  onSubmit: (data: CreatePartnerData | UpdatePartnerData) => void
  onCancel: () => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export function PartnerForm({
  partner,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: PartnerFormProps) {
  const methods = useForm<CreatePartnerData | UpdatePartnerData>({
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      address: '',
    },
  })

  useEffect(() => {
    if (partner && mode === 'edit') {
      methods.reset({
        name: partner.name || '',
        email: partner.email || '',
        phoneNumber: partner.phoneNumber || '',
        address: partner.address || '',
      })
    } else {
      methods.reset({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
      })
    }
  }, [partner, mode])

  const handleFormSubmit = methods.handleSubmit(
    (data: CreatePartnerData | UpdatePartnerData) => {
      onSubmit(data)
    }
  )

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-1 p-4">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <FormField
              name="name"
              control={methods.control}
              rules={{ required: 'Tên đối tác không được để trống' }}
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Tên đối tác *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nhập tên đối tác"
                      required
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={methods.control}
              rules={{
                required: 'Email không được để trống',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Email không hợp lệ',
                },
              }}
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Nhập email đối tác"
                      required
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="phoneNumber"
              control={methods.control}
              rules={{ required: 'Số điện thoại không được để trống' }}
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Số điện thoại *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nhập số điện thoại"
                      required
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="address"
              control={methods.control}
              rules={{ required: 'Địa chỉ không được để trống' }}
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Địa chỉ *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Nhập địa chỉ đối tác"
                      rows={3}
                      required
                      disabled={isLoading}
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
            {isLoading
              ? 'Đang xử lý...'
              : mode === 'create'
              ? 'Tạo mới'
              : 'Cập nhật'}
          </Button>
        </div>
      </div>
    </FormProvider>
  )
}
