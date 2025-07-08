/**
 * Thesis Form Component
 * Form for creating and editing thesis
 */
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Thesis, CreateThesisData, UpdateThesisData } from '../types'

interface ThesisFormProps {
  thesis?: Thesis | null
  students: Array<{ id: string; name: string; studentId: string }>
  academicYears: Array<{ id: string; name: string }>
  semesters: Array<{ id: string; name: string }>
  onSubmit: (data: CreateThesisData | UpdateThesisData) => void
  onCancel: () => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export function ThesisForm({
  thesis,
  students,
  academicYears,
  semesters,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: ThesisFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    studentId: '',
    supervisor: '',
    academicYearId: '',
    semesterId: '',
    status: 'pending',
  })

  useEffect(() => {
    if (thesis && mode === 'edit') {
      setFormData({
        title: thesis.title || '',
        description: '',
        studentId: thesis.studentId?.toString() || '',
        supervisor: '',
        academicYearId: thesis.academicYearId?.toString() || '',
        semesterId: thesis.semesterId?.toString() || '',
        status: 'pending',
      })
    }
  }, [thesis, mode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submissionData = {
      ...formData,
      studentId: parseInt(formData.studentId),
      academicYearId: parseInt(formData.academicYearId),
      semesterId: parseInt(formData.semesterId),
      ...(mode === 'create' && { submissionDate: new Date().toISOString() })
    }
    onSubmit(submissionData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề khóa luận *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Nhập tiêu đề khóa luận"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Nhập mô tả khóa luận"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="student">Sinh viên *</Label>
            <Select value={formData.studentId} onValueChange={(value) => handleChange('studentId', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn sinh viên" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} - {student.studentId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supervisor">Giảng viên hướng dẫn *</Label>
            <Input
              id="supervisor"
              value={formData.supervisor}
              onChange={(e) => handleChange('supervisor', e.target.value)}
              placeholder="Nhập tên giảng viên hướng dẫn"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="academicYear">Năm học *</Label>
            <Select value={formData.academicYearId} onValueChange={(value) => handleChange('academicYearId', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn năm học" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((year) => (
                  <SelectItem key={year.id} value={year.id}>
                    {year.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="semester">Học kỳ *</Label>
            <Select value={formData.semesterId} onValueChange={(value) => handleChange('semesterId', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn học kỳ" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((semester) => (
                  <SelectItem key={semester.id} value={semester.id}>
                    {semester.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Chờ phê duyệt</SelectItem>
                <SelectItem value="approved">Đã phê duyệt</SelectItem>
                <SelectItem value="rejected">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
          type="button"
          onClick={(e) => {
            e.preventDefault()
            handleSubmit(e as any)
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Đang xử lý...' : mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
        </Button>
      </div>
    </div>
  )
}
