/**
 * Lecturer Form Component
 * Form for creating and editing lecturers
 */
import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SheetFooter } from '@/components/ui/sheet'
import { ACADEMIC_RANKS, DEGREES } from '../constants'
import { useDepartments } from '../hooks'
import type { Lecturer } from '../types'
import type { CreateLecturerData, UpdateLecturerData } from '../services'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'

interface LecturerFormProps {
  lecturer?: Lecturer | null
  onSubmit: (data: CreateLecturerData | UpdateLecturerData) => void
  onCancel: () => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export function LecturerForm({ lecturer, onSubmit, onCancel, isLoading, mode }: LecturerFormProps) {
  const { departments, isLoading: isLoadingDepartments } = useDepartments()

  const methods = useForm<CreateLecturerData | UpdateLecturerData>({
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      departmentId: undefined,
      academicRank: '',
      degree: '',
      specialization: '',
      avatarUrl: '',
      isActive: true,
    },
  })

  React.useEffect(() => {
    if (lecturer && mode === 'edit') {
      methods.reset({
        name: lecturer.name || '',
        email: lecturer.email || '',
        phoneNumber: lecturer.phoneNumber || '',
        departmentId: lecturer.departmentId,
        academicRank: lecturer.academicRank || '',
        degree: lecturer.degree || '',
        specialization: lecturer.specialization || '',
        avatarUrl: lecturer.avatarUrl || '',
        isActive: lecturer.isActive ?? true,
      })
    } else {
      methods.reset({
        name: '',
        email: '',
        phoneNumber: '',
        departmentId: undefined,
        academicRank: '',
        degree: '',
        specialization: '',
        avatarUrl: '',
        isActive: true,
      })
    }
  }, [lecturer, mode])

  const handleFormSubmit = methods.handleSubmit((data: CreateLecturerData | UpdateLecturerData) => {
    // Convert departmentId to number or undefined
    const submissionData = {
      ...data,
      departmentId: data.departmentId && String(data.departmentId) !== 'none' ? Number(data.departmentId) : undefined,
      academicRank: data.academicRank === 'none' ? '' : data.academicRank,
      degree: data.degree === 'none' ? '' : data.degree,
    }
    onSubmit(submissionData)
  })

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-1 px-1">
          <form onSubmit={handleFormSubmit} className="space-y-4 p-4">
            <FormField name="name" control={methods.control} rules={{ required: 'Họ và tên không được để trống' }} render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nhập họ và tên" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="email" control={methods.control} rules={{ required: 'Email không được để trống', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email không hợp lệ' } }} render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="Nhập email" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="phoneNumber" control={methods.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nhập số điện thoại" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="departmentId" control={methods.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Khoa/Đơn vị</FormLabel>
                <FormControl>
                  <Select value={field.value ? String(field.value) : 'none'} onValueChange={field.onChange} disabled={isLoadingDepartments}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={isLoadingDepartments ? 'Đang tải...' : 'Chọn khoa/đơn vị'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Không chọn</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.name} ({dept.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="academicRank" control={methods.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Học hàm</FormLabel>
                <FormControl>
                  <Select value={field.value || 'none'} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn học hàm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Không chọn</SelectItem>
                      {ACADEMIC_RANKS.map(rank => (
                        <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="degree" control={methods.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Học vị</FormLabel>
                <FormControl>
                  <Select value={field.value || 'none'} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn học vị" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Không chọn</SelectItem>
                      {DEGREES.map(degree => (
                        <SelectItem key={degree} value={degree}>{degree}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="specialization" control={methods.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Chuyên ngành</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nhập chuyên ngành" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="avatarUrl" control={methods.control} render={({ field }) => (
              <FormItem>
                <FormLabel>URL Ảnh đại diện</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://example.com/avatar.jpg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="isActive" control={methods.control} render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} id="isActive" />
                  </FormControl>
                  <FormLabel htmlFor="isActive">Hoạt động</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )} />
          </form>
        </ScrollArea>
        <SheetFooter className="p-4 border-t bg-background">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading} onClick={handleFormSubmit}>
            {isLoading ? 'Đang lưu...' : mode === 'create' ? 'Tạo giảng viên' : 'Cập nhật'}
          </Button>
        </SheetFooter>
      </div>
    </FormProvider>
  )
}