/**
 * Academic Year Form Component
 * Form for creating and editing academic years
 */
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import type { AcademicYear, CreateAcademicYearData, UpdateAcademicYearData } from '../types'

interface AcademicYearFormProps {
  academicYear?: AcademicYear | null
  onSubmit: (data: CreateAcademicYearData | UpdateAcademicYearData) => void
  onCancel: () => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export function AcademicYearForm({
  academicYear,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: AcademicYearFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear() + 1,
    isCurrent: false,
  })

  useEffect(() => {
    if (academicYear && mode === 'edit') {
      // Extract start and end year from name or dates
      const currentYear = new Date().getFullYear()
      let startYear = currentYear
      let endYear = currentYear + 1
      
      if (academicYear.name) {
        const yearMatch = academicYear.name.match(/(\d{4})-(\d{4})/)
        if (yearMatch) {
          startYear = parseInt(yearMatch[1])
          endYear = parseInt(yearMatch[2])
        }
      }
      
      setFormData({
        name: academicYear.name || '',
        startYear,
        endYear,
        isCurrent: false, // Default value since not in original type
      })
    }
  }, [academicYear, mode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleStartYearChange = (year: number) => {
    setFormData(prev => ({
      ...prev,
      startYear: year,
      endYear: year + 1,
      name: `${year}-${year + 1}`,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="startYear">Năm bắt đầu *</Label>
        <Input
          id="startYear"
          type="number"
          value={formData.startYear}
          onChange={(e) => handleStartYearChange(parseInt(e.target.value) || new Date().getFullYear())}
          placeholder="Nhập năm bắt đầu"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endYear">Năm kết thúc *</Label>
        <Input
          id="endYear"
          type="number"
          value={formData.endYear}
          onChange={(e) => handleChange('endYear', parseInt(e.target.value) || new Date().getFullYear() + 1)}
          placeholder="Nhập năm kết thúc"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Tên năm học *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Tên năm học (vd: 2024-2025)"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isCurrent"
          checked={formData.isCurrent}
          onCheckedChange={(checked) => handleChange('isCurrent', checked)}
        />
        <Label htmlFor="isCurrent">Đặt làm năm học hiện tại</Label>
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
