/**
 * Semester Details Component
 */
import React from 'react'
import { Calendar, Clock } from 'lucide-react'
import type { Semester } from '../types'

interface SemesterDetailsProps {
  semester: Semester
}

export function SemesterDetails({ semester }: SemesterDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Semester Header */}
      <div className="text-center pb-4 border-b">
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {semester.name}
        </h3>
        <p className="text-sm text-gray-500">
          {semester.academicYear?.name}
        </p>
      </div>
      
      {/* Semester Information */}
      <div className="space-y-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-blue-600" />
            <label className="text-sm font-medium text-blue-800">Thông tin học kỳ</label>
          </div>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Tên học kỳ:</span> {semester.name}
            </p>
            <p className="text-sm">
              <span className="font-medium">Năm học:</span> {semester.academicYear?.name}
            </p>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-green-600" />
            <label className="text-sm font-medium text-green-800">Thông tin bổ sung</label>
          </div>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">ID học kỳ:</span> {semester.id}
            </p>
            <p className="text-sm">
              <span className="font-medium">ID năm học:</span> {semester.academicYearId}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
