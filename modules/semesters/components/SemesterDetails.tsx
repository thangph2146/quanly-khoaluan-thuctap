/**
 * Semester Details Component
 */
import React from 'react'
import type { SemesterDetailsProps } from '../types'
import { Modal } from '@/components/common'

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

export function SemesterDetails({
  semester,
  isOpen,
  onClose,
}: SemesterDetailsProps) {
  if (!semester) {
    return null
  }


  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Chi tiết học kỳ"
      className="sm:max-w-lg"
    >
      <div className="space-y-6">
        <div className="text-center pb-4 border-b">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {semester.name}
          </h3>
          <p className="text-sm text-gray-500">Năm học: {semester.academicYear.name}</p>
        </div>

        <div className="space-y-4">
          <InfoBlock iconColor="blue" label="Thông tin học kỳ">
            <p>
              <span className="font-medium">Tên học kỳ:</span> {semester.name}
            </p>
            <p>
              <span className="font-medium">Năm học:</span> {semester.academicYear.name}
            </p>
             <p>
              <span className="font-medium">Ngày bắt đầu năm học:</span> {new Date(semester.academicYear.startDate).toLocaleDateString()}
            </p>
             <p>
              <span className="font-medium">Ngày kết thúc năm học:</span> {new Date(semester.academicYear.endDate).toLocaleDateString()}
            </p>
          </InfoBlock>
        </div>
      </div>
    </Modal>
  )
} 