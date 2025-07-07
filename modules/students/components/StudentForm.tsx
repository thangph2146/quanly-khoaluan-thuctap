/**
 * Student Form Component
 */
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Student, CreateStudentData, UpdateStudentData, StudentFormProps } from '../types'

export function StudentForm({
  student,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: StudentFormProps) {
  const [formData, setFormData] = useState({
    studentCode: '',
    fullName: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (student && mode === 'edit') {
      setFormData({
        studentCode: student.studentCode || '',
        fullName: student.fullName || '',
        dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
        email: student.email || '',
        phoneNumber: student.phoneNumber || '',
      })
    } else {
      setFormData({
        studentCode: '',
        fullName: '',
        dateOfBirth: '',
        email: '',
        phoneNumber: '',
      })
    }
    setErrors({})
  }, [student, mode])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.studentCode.trim()) {
      newErrors.studentCode = 'Mã sinh viên không được để trống'
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên không được để trống'
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Ngày sinh không được để trống'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại không được để trống'
    } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      const submissionData: CreateStudentData | UpdateStudentData = {
        studentCode: formData.studentCode,
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
      }
      onSubmit(submissionData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="studentCode">Mã sinh viên *</Label>
        <Input
          id="studentCode"
          value={formData.studentCode}
          onChange={(e) => handleChange('studentCode', e.target.value)}
          placeholder="Ví dụ: 2021001"
          required
          disabled={isLoading}
          className={errors.studentCode ? 'border-red-500' : ''}
        />
        {errors.studentCode && <p className="text-sm text-red-500">{errors.studentCode}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Họ và tên *</Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="Nhập họ và tên"
          required
          disabled={isLoading}
          className={errors.fullName ? 'border-red-500' : ''}
        />
        {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Ngày sinh *</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleChange('dateOfBirth', e.target.value)}
          required
          disabled={isLoading}
          className={errors.dateOfBirth ? 'border-red-500' : ''}
        />
        {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="Nhập địa chỉ email"
          required
          disabled={isLoading}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Số điện thoại *</Label>
        <Input
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => handleChange('phoneNumber', e.target.value)}
          placeholder="Nhập số điện thoại"
          required
          disabled={isLoading}
          className={errors.phoneNumber ? 'border-red-500' : ''}
        />
        {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
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
