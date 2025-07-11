/**
 * Internship Details Component
 */
import React from 'react'
import type { InternshipDetailsProps } from '../types'
import { Modal } from '@/components/common'
import { Badge } from '@/components/ui/badge'

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

export function InternshipDetails({
  internship,
  isOpen,
  onClose,
}: InternshipDetailsProps) {
  if (!internship) {
    return null
  }
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Chi tiết Kỳ thực tập"
      className="sm:max-w-2xl"
    >
      <div className="space-y-6">
        <div className="text-center pb-4 border-b">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            Thực tập tại {internship.partner?.name || 'N/A'}
          </h3>
          <p className="text-sm text-gray-500">
            Sinh viên: {internship.student?.name || 'N/A'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoBlock iconColor="blue" label="Thông tin Sinh viên">
            <p>
              <span className="font-medium">Họ tên:</span> {internship.student?.name}
            </p>
             <p>
              <span className="font-medium">Email:</span> {internship.student?.email}
            </p>
          </InfoBlock>

          <InfoBlock iconColor="purple" label="Thông tin Công ty">
            <p>
              <span className="font-medium">Tên công ty:</span> {internship.partner?.name}
            </p>
            <p>
              <span className="font-medium">Địa chỉ:</span> {internship.partner?.address}
            </p>
          </InfoBlock>

          <InfoBlock iconColor="green" label="Thời gian Thực tập">
            <p>
              <span className="font-medium">Năm học:</span> {internship.academicYear?.name}
            </p>
            <p>
              <span className="font-medium">Học kỳ:</span> {internship.semester?.name}
            </p>
          </InfoBlock>
          
          <InfoBlock iconColor="yellow" label="Kết quả">
             <p className="flex items-center gap-2">
              <span className="font-medium">Điểm:</span> 
              <Badge variant={internship.grade ? (internship.grade >= 5 ? 'default' : 'destructive') : 'outline'}>
                {internship.grade ?? 'Chưa có'}
              </Badge>
            </p>
            <p>
              <span className="font-medium">Báo cáo:</span> 
              {internship.reportUrl ? <a href={internship.reportUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Link</a> : 'Chưa có'}
            </p>
          </InfoBlock>
        </div>
      </div>
    </Modal>
  )
} 