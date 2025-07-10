/**
 * Permission Details Component
 */
import React from 'react'
import type { PermissionDetailsProps } from '../types'
import { Modal } from '@/components/common'

const InfoBlock: React.FC<{
  label: string
  children: React.ReactNode
}> = ({ label, children }) => (
  <div className="rounded-lg p-4 border bg-gray-50">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <div className="mt-1 text-base text-gray-900">{children}</div>
  </div>
)

export function PermissionDetails({
  permission,
  isOpen,
  onClose,
}: PermissionDetailsProps) {
  if (!permission) {
    return null
  }
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Chi tiết Quyền"
      className="sm:max-w-lg"
    >
      <div className="space-y-6 p-2">
        <div className="text-center pb-4 border-b">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {permission.name}
          </h3>
          <p className="text-sm text-gray-500">Module: {permission.module}</p>
        </div>

        <div className="space-y-4">
          <InfoBlock label="Tên quyền">
            <p>{permission.name}</p>
          </InfoBlock>
          <InfoBlock label="Module">
            <p>{permission.module}</p>
          </InfoBlock>
          {permission.description && (
            <InfoBlock label="Mô tả">
              <p>{permission.description}</p>
            </InfoBlock>
          )}
        </div>
      </div>
    </Modal>
  )
} 