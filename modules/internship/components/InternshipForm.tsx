/**
 * Internship Form Component
 * Form for creating and editing internships
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
import type { Internship, CreateInternshipData, UpdateInternshipData } from '../types'

interface InternshipFormProps {
  internship?: Internship | null
  students: Array<{ id: string; name: string; studentId: string }>
  partners: Array<{ id: string; name: string }>
  academicYears: Array<{ id: string; name: string }>
  semesters: Array<{ id: string; name: string }>
  onSubmit: (data: CreateInternshipData | UpdateInternshipData) => void
  onCancel: () => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export function InternshipForm({
  internship,
  students,
  partners,
  academicYears,
  semesters,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: InternshipFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    studentId: '',
    partnerId: '',
    academicYearId: '',
    semesterId: '',
    startDate: '',
    endDate: '',
    status: 'pending',
  })

  useEffect(() => {
    if (internship && mode === 'edit') {
      setFormData({
        title: '',
        description: '',
        studentId: internship.studentId?.toString() || '',
        partnerId: internship.partnerId?.toString() || '',
        academicYearId: internship.academicYearId?.toString() || '',
        semesterId: internship.semesterId?.toString() || '',
        startDate: '',
        endDate: '',
        status: 'pending',
      })
    }
  }, [internship, mode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Convert string IDs to numbers before submitting
    const submissionData = {
      ...formData,
      studentId: parseInt(formData.studentId),
      partnerId: parseInt(formData.partnerId),
      academicYearId: parseInt(formData.academicYearId),
      semesterId: parseInt(formData.semesterId),
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
            <Label htmlFor="title">Tiêu đề thực tập *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Nhập tiêu đề thực tập"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Nhập mô tả thực tập"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="student">Sinh viên *</Label>
            <Select value={formData.studentId} onValueChange={(value) => handleChange('studentId', value)}>
              <SelectTrigger>
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
            <Label htmlFor="partner">Đối tác *</Label>
            <Select value={formData.partnerId} onValueChange={(value) => handleChange('partnerId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn đối tác" />
              </SelectTrigger>
              <SelectContent>
                {partners.map((partner) => (
                  <SelectItem key={partner.id} value={partner.id}>
                    {partner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="academicYear">Năm học *</Label>
            <Select value={formData.academicYearId} onValueChange={(value) => handleChange('academicYearId', value)}>
              <SelectTrigger>
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
              <SelectTrigger>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
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
