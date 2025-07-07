/**
 * Department Details Component
 */
import React from 'react'
import { Eye } from 'lucide-react'
import type { DepartmentDetailsProps } from '../types'

export function DepartmentDetails({ department }: DepartmentDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Department Name */}
      <div className="text-center pb-4 border-b">
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {department.name}
        </h3>
        <p className="text-sm text-gray-500">Mã: {department.code}</p>
      </div>
      
      {/* Department Information */}
      <div className="space-y-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <label className="text-sm font-medium text-blue-800">Thông tin cơ bản</label>
          </div>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Tên đơn vị:</span> {department.name}
            </p>
            <p className="text-sm">
              <span className="font-medium">Mã đơn vị:</span> {department.code}
            </p>
          </div>
        </div>
        
        {department.parentDepartment && (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <label className="text-sm font-medium text-green-800">Đơn vị cha</label>
            </div>
            <p className="text-sm">
              {department.parentDepartment.name} ({department.parentDepartment.code})
            </p>
          </div>
        )}
        
        {department.childDepartments && department.childDepartments.length > 0 && (
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <label className="text-sm font-medium text-purple-800">Đơn vị con</label>
            </div>
            <div className="space-y-1">
              {department.childDepartments.map(child => (
                <p key={child.id} className="text-sm">
                  • {child.name} ({child.code})
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
