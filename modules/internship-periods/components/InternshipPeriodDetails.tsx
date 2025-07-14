import React from 'react';
import type { InternshipPeriodDetailsProps } from '../types';
import { Modal } from '@/components/common';

export function InternshipPeriodDetails({ internshipPeriod, isOpen, onClose }: InternshipPeriodDetailsProps) {
  if (!internshipPeriod) return null;
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Chi tiết đợt thực tập"
      className="sm:max-w-lg"
    >
      <div className="space-y-6">
        <div className="text-center pb-4 border-b">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{internshipPeriod.name}</h3>
          <p className="text-sm text-gray-500">Từ {internshipPeriod.startDate} đến {internshipPeriod.endDate}</p>
        </div>
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <label className="text-sm font-medium text-blue-800">Thông tin cơ bản</label>
            </div>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Tên đợt:</span> {internshipPeriod.name}</p>
              <p><span className="font-medium">Mô tả:</span> {internshipPeriod.description || 'Không có'}</p>
              <p><span className="font-medium">Năm học:</span> {internshipPeriod.academicYearId}</p>
              <p><span className="font-medium">Học kỳ:</span> {internshipPeriod.semesterId}</p>
              <p><span className="font-medium">Ngày bắt đầu:</span> {internshipPeriod.startDate}</p>
              <p><span className="font-medium">Ngày kết thúc:</span> {internshipPeriod.endDate}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
} 