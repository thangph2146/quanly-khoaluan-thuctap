/**
 * Academic Year Form Component
 * Form for creating and editing academic years
 */
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { logger } from '@/lib/utils/logger'
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
    startDate: '',
    endDate: '',
  })

  // Helper function to format date for input[type="date"]
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return ''
    return dateString.split('T')[0]
  }

  // Helper function to generate academic year name from dates
  const generateNameFromDates = (startDate: string, endDate: string): string => {
    if (!startDate || !endDate) return ''
    const startYear = new Date(startDate).getFullYear()
    const endYear = new Date(endDate).getFullYear()
    return `${startYear}-${endYear}`
  }

  useEffect(() => {
    logger.lifecycle('AcademicYearForm', 'useEffect triggered', { academicYear, mode })
    
    if (academicYear && mode === 'edit') {
      const editFormData = {
        name: academicYear.name || '',
        startDate: formatDateForInput(academicYear.startDate),
        endDate: formatDateForInput(academicYear.endDate),
      }
      
      logger.debug('Setting form data for edit mode', {
        academicYear,
        editFormData
      }, 'AcademicYearForm')
      
      setFormData(editFormData)
    } else {
      // Default values for create mode - current academic year pattern
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() + 1 // getMonth() returns 0-11
      
      // If we're past August, default to next academic year
      const academicStartYear = currentMonth >= 9 ? currentYear : currentYear - 1
      const academicEndYear = academicStartYear + 1
      
      const startDate = `${academicStartYear}-09-01`
      const endDate = `${academicEndYear}-08-31`
      
      const createFormData = {
        name: `${academicStartYear}-${academicEndYear}`,
        startDate,
        endDate,
      }
      
      logger.debug('Setting default form data for create mode', {
        now,
        currentYear,
        currentMonth,
        academicStartYear,
        academicEndYear,
        createFormData
      }, 'AcademicYearForm')
      
      setFormData(createFormData)
    }
  }, [academicYear, mode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    logger.groupStart('Academic Year Form Submission')
    logger.formDebug('AcademicYearForm', 'Submit started', {
      mode,
      formData,
      academicYear
    })
    
    // Validate form data
    if (!formData.name.trim()) {
      logger.warn('Form validation failed: Name is required', { formData }, 'AcademicYearForm')
      return // Name is required
    }
    
    if (!formData.startDate || !formData.endDate) {
      logger.warn('Form validation failed: Dates are required', { formData }, 'AcademicYearForm')
      return // Dates are required
    }

    // Validate date order
    const startDate = new Date(formData.startDate)
    const endDate = new Date(formData.endDate)
    
    if (startDate >= endDate) {
      logger.warn('Form validation failed: Invalid date order', {
        startDate: formData.startDate,
        endDate: formData.endDate,
        startDateObj: startDate,
        endDateObj: endDate
      }, 'AcademicYearForm')
      return // Start date must be before end date
    }

    // Convert dates to ISO format for API
    const submitData = {
      name: formData.name.trim(),
      startDate: `${formData.startDate}T00:00:00`,
      endDate: `${formData.endDate}T00:00:00`,
    }
    
    logger.formDebug('AcademicYearForm', 'Validation passed, submitting data', {
      originalFormData: formData,
      transformedSubmitData: submitData,
      mode,
      academicYearForEdit: academicYear // Add this to track edit context
    })
    
    onSubmit(submitData)
    logger.groupEnd()
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      
      // Auto-generate name when dates change
      if (field === 'startDate' || field === 'endDate') {
        const startDate = field === 'startDate' ? value : prev.startDate
        const endDate = field === 'endDate' ? value : prev.endDate
        updated.name = generateNameFromDates(startDate, endDate)
      }
      
      return updated
    })
  }

  const handleStartDateChange = (date: string) => {
    logger.debug('Start date change triggered', { date }, 'AcademicYearForm')
    
    if (date) {
      const startYear = new Date(date).getFullYear()
      
      // Validate that we got a valid year
      if (!isNaN(startYear) && startYear > 1900) {
        const endDate = `${startYear + 1}-08-31`
        
        const updatedFormData = {
          startDate: date,
          endDate,
          name: `${startYear}-${startYear + 1}`,
        }
        
        logger.debug('Updating form data with calculated values', {
          date,
          startYear,
          updatedFormData
        }, 'AcademicYearForm')
        
        setFormData(prev => ({
          ...prev,
          ...updatedFormData
        }))
      } else {
        logger.warn('Invalid date detected, updating only startDate field', {
          date,
          startYear,
          isNaN: isNaN(startYear),
          tooOld: startYear <= 1900
        }, 'AcademicYearForm')
        
        // If invalid date, just update the startDate field
        setFormData(prev => ({
          ...prev,
          startDate: date,
        }))
      }
    } else {
      logger.debug('Empty date, calling handleChange', { date }, 'AcademicYearForm')
      handleChange('startDate', date)
    }
  }

  return (
    <div className="flex flex-col h-full p-4">
      <form onSubmit={handleSubmit} className="space-y-4 flex-1">
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

        <div className="space-y-2">
          <Label htmlFor="startDate">Ngày bắt đầu *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Ngày kết thúc *</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            required
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-2 pt-6">
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
          >
            {isLoading ? 'Đang xử lý...' : mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
          </Button>
        </div>
      </form>
    </div>
  )
}
