/**
 * Role Details Component
 */
import React from 'react'
import type { RoleDetailsProps } from '../types'
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

export function RoleDetails({
  role,
  isOpen,
  onClose,
}: RoleDetailsProps) {
  if (!role) {
    return null
  }
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Chi tiết vai trò"
      className="sm:max-w-lg"
    >
      <div className="space-y-6">
        {/* Role Name */}
        <div className="text-center pb-4 border-b">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {role.name}
          </h3>
          <p className="text-sm text-gray-500">Vai trò hệ thống</p>
        </div>

        {/* Role Information */}
        <div className="space-y-4">
          <InfoBlock iconColor="blue" label="Thông tin cơ bản">
            <p>
              <span className="font-medium">Tên vai trò:</span> {role.name}
            </p>
            <p>
              <span className="font-medium">Mô tả:</span> {role.description || 'Không có mô tả'}
            </p>
          </InfoBlock>

          {role.rolePermissions && role.rolePermissions.length > 0 && (
            <InfoBlock iconColor="purple" label="Quyền hạn">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {role.rolePermissions.map(({ permission }) => (
                  <p key={permission.id} className="text-sm">
                    • {permission.module}: {permission.name}
                  </p>
                ))}
              </div>
            </InfoBlock>
          )}

        </div>
      </div>
    </Modal>
  )
} 