/**
 * Lecturer Form Component
 * Form for creating and editing lecturers
 */
import React, { useState } from 'react'
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

interface LecturerFormProps {
  lecturer?: Lecturer | null
  onSubmit: (data: CreateLecturerData | UpdateLecturerData) => void
  onCancel: () => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export function LecturerForm({ lecturer, onSubmit, onCancel, isLoading, mode }: LecturerFormProps) {
  const { departments, isLoading: isLoadingDepartments } = useDepartments()
  
  const [formData, setFormData] = useState({
    name: lecturer?.name || '',
    email: lecturer?.email || '',
    phoneNumber: lecturer?.phoneNumber || '',
    departmentId: lecturer?.departmentId || undefined,
    academicRank: lecturer?.academicRank || '',
    degree: lecturer?.degree || '',
    specialization: lecturer?.specialization || '',
    avatarUrl: lecturer?.avatarUrl || '',
    isActive: lecturer?.isActive ?? true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'departmentId') {
      setFormData(prev => ({ ...prev, [name]: value === 'none' ? undefined : parseInt(value) }))
    } else if (name === 'academicRank' || name === 'degree') {
      setFormData(prev => ({ ...prev, [name]: value === 'none' ? '' : value }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-1">
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="name">Họ và tên</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Số điện thoại</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="departmentId">Khoa/Đơn vị</Label>
            <Select
              value={formData.departmentId?.toString() || 'none'}
              onValueChange={(value) => handleSelectChange('departmentId', value)}
              disabled={isLoadingDepartments}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={isLoadingDepartments ? "Đang tải..." : "Chọn khoa/đơn vị"} />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="academicRank">Học hàm</Label>
            <Select
              value={formData.academicRank || 'none'}
              onValueChange={(value) => handleSelectChange('academicRank', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn học hàm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Không chọn</SelectItem>
                {ACADEMIC_RANKS.map(rank => (
                  <SelectItem key={rank} value={rank}>
                    {rank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="degree">Học vị</Label>
            <Select
              value={formData.degree || 'none'}
              onValueChange={(value) => handleSelectChange('degree', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn học vị" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Không chọn</SelectItem>
                {DEGREES.map(degree => (
                  <SelectItem key={degree} value={degree}>
                    {degree}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Chuyên ngành</Label>
            <Input
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="Nhập chuyên ngành"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatarUrl">URL Ảnh đại diện</Label>
            <Input
              id="avatarUrl"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="isActive">Hoạt động</Label>
          </div>
        </form>
      </ScrollArea>

      {/* Form Actions - Fixed at bottom */}
      <SheetFooter className="p-4 border-t bg-background">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Hủy
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? 'Đang lưu...' : mode === 'create' ? 'Tạo giảng viên' : 'Cập nhật'}
        </Button>
      </SheetFooter>
    </div>
  )
}