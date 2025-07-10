import React from 'react';
import type { ThesisDetailsProps } from '../types';
import { Modal } from '@/components/common';

const InfoBlock: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <div className="rounded-lg p-4 border bg-gray-50 border-gray-200">
    <label className="text-sm font-medium text-gray-800">{label}</label>
    <div className="mt-2 space-y-1 text-sm text-gray-700">{children}</div>
  </div>
);

export function ThesisDetails({
  thesis,
  isOpen,
  onClose,
}: ThesisDetailsProps) {
  if (!thesis) {
    return null;
  }
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Chi tiết khóa luận"
      className="sm:max-w-2xl"
    >
      <div className="space-y-6">
        <div className="text-center pb-4 border-b">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {thesis.title}
          </h3>
          <p className="text-sm text-gray-500">
            Trạng thái: {thesis.status || 'Chưa cập nhật'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoBlock label="Sinh viên thực hiện">
            <p><span className="font-medium">Họ tên:</span> {thesis.studentName || 'N/A'}</p>
            <p><span className="font-medium">MSSV:</span> {thesis.studentCode || 'N/A'}</p>
          </InfoBlock>

          <InfoBlock label="Giảng viên hướng dẫn">
            <p><span className="font-medium">Họ tên:</span> {thesis.supervisorName || 'N/A'}</p>
            <p><span className="font-medium">Email:</span> {thesis.supervisorEmail || 'N/A'}</p>
          </InfoBlock>

          {thesis.examinerName && (
            <InfoBlock label="Giảng viên phản biện">
              <p><span className="font-medium">Họ tên:</span> {thesis.examinerName}</p>
              <p><span className="font-medium">Email:</span> {thesis.examinerEmail || 'N/A'}</p>
            </InfoBlock>
          )}

          <InfoBlock label="Thông tin học kỳ">
            <p><span className="font-medium">Năm học:</span> {thesis.academicYearName || 'N/A'}</p>
            <p><span className="font-medium">Học kỳ:</span> {thesis.semesterName || 'N/A'}</p>
          </InfoBlock>
        </div>

        <InfoBlock label="Mô tả">
          <p className="whitespace-pre-wrap">{thesis.description || 'Không có mô tả.'}</p>
        </InfoBlock>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-600">Ngày nộp</span>
                <span>{new Date(thesis.submissionDate).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-600">Ngày tạo</span>
                <span>{thesis.createdAt ? new Date(thesis.createdAt).toLocaleString('vi-VN') : 'N/A'}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-600">Cập nhật lần cuối</span>
                <span>{thesis.updatedAt ? new Date(thesis.updatedAt).toLocaleString('vi-VN') : 'N/A'}</span>
            </div>
        </div>

      </div>
    </Modal>
  );
} 