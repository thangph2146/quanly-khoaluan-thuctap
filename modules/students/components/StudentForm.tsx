/**
 * Student Form Component
 */
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useForm, FormProvider } from 'react-hook-form'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import type { Student, CreateStudentData, UpdateStudentData, StudentFormProps } from '../types'

export function StudentForm({
  student,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: StudentFormProps) {
  const methods = useForm<CreateStudentData | UpdateStudentData>({
    defaultValues: {
      studentCode: '',
      fullName: '',
      dateOfBirth: '',
      email: '',
      phoneNumber: '',
    },
  })

  useEffect(() => {
    if (student && mode === 'edit') {
      methods.reset({
        studentCode: student.studentCode || '',
        fullName: student.fullName || '',
        dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
        email: student.email || '',
        phoneNumber: student.phoneNumber || '',
      })
    } else {
      methods.reset({
        studentCode: '',
        fullName: '',
        dateOfBirth: '',
        email: '',
        phoneNumber: '',
      })
    }
  }, [student, mode])

  const handleFormSubmit = methods.handleSubmit((data: CreateStudentData | UpdateStudentData) => {
    onSubmit(data)
  })

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-1 p-4">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <FormField
              name="studentCode"
              control={methods.control}
              rules={{ required: 'Mã sinh viên không được để trống' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã sinh viên *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ví dụ: 2021001"
                      required
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="fullName"
              control={methods.control}
              rules={{ required: 'Họ và tên không được để trống' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nhập họ và tên"
                      required
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="dateOfBirth"
              control={methods.control}
              rules={{ required: 'Ngày sinh không được để trống' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày sinh *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Nhập địa chỉ email"
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
              rules={{
                required: 'Số điện thoại không được để trống',
                pattern: {
                  value: /^[0-9]{10,11}$/,
                  message: 'Số điện thoại không hợp lệ',
                },
              }}
              render={({ field }) => (
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
