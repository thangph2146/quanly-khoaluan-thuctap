/**
 * Student Details Component
 */
import React from 'react'
import { User, Mail, Phone, Calendar } from 'lucide-react'
import type { StudentDetailsProps } from '../types'

export function StudentDetails({ student }: StudentDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Student Header */}
      <div className="text-center pb-4 border-b">
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {student.fullName}
        </h3>
        <p className="text-sm text-gray-500">Mã sinh viên: {student.studentCode}</p>
      </div>
      
      {/* Student Information */}
      <div className="space-y-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-blue-600" />
            <label className="text-sm font-medium text-blue-800">Thông tin cá nhân</label>
          </div>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Họ và tên:</span> {student.fullName}
            </p>
            <p className="text-sm">
              <span className="font-medium">Mã sinh viên:</span> {student.studentCode}
            </p>
            <p className="text-sm flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span className="font-medium">Ngày sinh:</span> 
              {new Date(student.dateOfBirth).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="h-4 w-4 text-green-600" />
            <label className="text-sm font-medium text-green-800">Thông tin liên hệ</label>
          </div>
          <div className="space-y-2">
            <p className="text-sm flex items-center gap-2">
              <Mail className="h-3 w-3" />
              <span className="font-medium">Email:</span> {student.email}
            </p>
            <p className="text-sm flex items-center gap-2">
              <Phone className="h-3 w-3" />
              <span className="font-medium">Số điện thoại:</span> {student.phoneNumber}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
