/**
 * Department Details Component
 */
import React from 'react'
import type { DepartmentDetailsProps } from '../types'
import { Modal } from '@/components/common'

// Sub-component for a single piece of information
const InfoBlock: React.FC<{
  iconColor: string
  label: string
  children: React.ReactNode
}> = ({ iconColor, label, children }) => (
  <div
    className={`bg-${iconColor}-50 rounded-lg p-4 border border-${iconColor}-200`}
  >
    <div className="flex items-center gap-2 mb-2">
      <div className={`w-2 h-2 bg-${iconColor}-500 rounded-full`}></div>
      <label className={`text-sm font-medium text-${iconColor}-800`}>
        {label}
      </label>
    </div>
    <div className="space-y-1 text-sm">{children}</div>
  </div>
)

export function DepartmentDetails({
  department,
  isOpen,
  onClose,
}: DepartmentDetailsProps) {
  if (!department) {
    return null
  }
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Chi tiết đơn vị"
      className="sm:max-w-lg"
    >
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
          <InfoBlock iconColor="blue" label="Thông tin cơ bản">
            <p>
              <span className="font-medium">Tên đơn vị:</span> {department.name}
            </p>
            <p>
              <span className="font-medium">Mã đơn vị:</span> {department.code}
            </p>
          </InfoBlock>

          {department.parentDepartment && (
            <InfoBlock iconColor="green" label="Đơn vị cha">
              <p>
                {department.parentDepartment.name} (
                {department.parentDepartment.code})
              </p>
            </InfoBlock>
          )}

          {department.childDepartments &&
            department.childDepartments.length > 0 && (
              <InfoBlock iconColor="purple" label="Đơn vị con">
                {department.childDepartments.map((child) => (
                  <p key={child.id}>
                    • {child.name} ({child.code})
                  </p>
                ))}
              </InfoBlock>
            )}
        </div>
      </div>
    </Modal>
  )
}
