/**
 * Department Form Component
 */
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Department, CreateDepartmentData, UpdateDepartmentData, DepartmentFormProps } from '../types'

export function DepartmentForm({
  department,
  allDepartments,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: DepartmentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    parentDepartmentId: null as number | null,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (department && mode === 'edit') {
      setFormData({
        name: department.name || '',
        code: department.code || '',
        parentDepartmentId: department.parentDepartmentId || null,
      })
    } else {
      setFormData({
        name: '',
        code: '',
        parentDepartmentId: null,
      })
    }
    setErrors({})
  }, [department, mode])

  const handleChange = (field: string, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Tên đơn vị không được để trống'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Mã đơn vị không được để trống'
    }

    // Check for duplicate code (excluding current department if editing)
    const existingDept = allDepartments.find(d => 
      d.code.toLowerCase() === formData.code.toLowerCase() && 
      d.id !== department?.id
    )
    if (existingDept) {
      newErrors.code = 'Mã đơn vị đã tồn tại'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      const submissionData: CreateDepartmentData | UpdateDepartmentData = {
        name: formData.name,
        code: formData.code,
        parentDepartmentId: formData.parentDepartmentId,
      }
      onSubmit(submissionData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Tên đơn vị *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Ví dụ: Khoa Công nghệ thông tin"
          required
          disabled={isLoading}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">Mã đơn vị *</Label>
        <Input
          id="code"
          value={formData.code}
          onChange={(e) => handleChange('code', e.target.value)}
          placeholder="Ví dụ: CNTT"
          required
          disabled={isLoading}
          className={errors.code ? 'border-red-500' : ''}
        />
        {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="parentDepartmentId">Đơn vị cha</Label>
        <Select
          value={formData.parentDepartmentId?.toString() || 'none'}
          onValueChange={(value) => handleChange('parentDepartmentId', value === 'none' ? null : parseInt(value))}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn đơn vị cha (nếu có)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Không có</SelectItem>
            {allDepartments
              .filter(d => d.id !== department?.id) // Prevent self-parenting
              .map(d => (
                <SelectItem key={d.id} value={d.id.toString()}>
                  {d.name} ({d.code})
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Hủy
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
        </Button>
      </div>
    </form>
  )
}
