/**
 * Semester Form Component
 * Form for creating and editing semesters
 */
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Semester, CreateSemesterData, UpdateSemesterData } from '../types'
import type { AcademicYear } from '@/modules/academic-years/types'

interface SemesterFormProps {
  semester?: Semester | null
  academicYears: AcademicYear[]
  onSubmit: (data: CreateSemesterData | UpdateSemesterData) => void
  onCancel: () => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export function SemesterForm({
  semester,
  academicYears,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: SemesterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    academicYearId: '',
  })

  useEffect(() => {
    if (semester && mode === 'edit') {
      setFormData({
        name: semester.name || '',
        academicYearId: semester.academicYearId?.toString() || '',
      })
    }
  }, [semester, mode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      academicYearId: parseInt(formData.academicYearId),
    }
    onSubmit(submitData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-1">
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên học kỳ *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Nhập tên học kỳ (vd: Học kỳ 1, Học kỳ 2)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="academicYear">Năm học *</Label>
            <Select value={formData.academicYearId} onValueChange={(value) => handleChange('academicYearId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn năm học" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((year) => (
                  <SelectItem key={year.id} value={year.id.toString()}>
                    {year.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>
      </ScrollArea>

      {/* Form Actions - Fixed at bottom */}
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
          disabled={isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? 'Đang xử lý...' : mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
        </Button>
      </div>
    </div>
  )
}
