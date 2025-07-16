import React from 'react';
import type { ThesisPeriodDetailsProps } from '../types';
import { Modal } from '@/components/common';

export function ThesisPeriodDetails({
  thesisPeriod,
  isOpen,
  onClose,
}: ThesisPeriodDetailsProps) {
  if (!thesisPeriod) {
    return null;
  }
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Chi tiết đợt khóa luận"
      className="sm:max-w-lg"
    >
      <div className="space-y-6">
        {/* Thesis Period Name */}
        <div className="text-center pb-4 border-b">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {thesisPeriod.name}
          </h3>
          <p className="text-sm text-gray-500">Mô tả: {thesisPeriod.description}</p>
        </div>

        {/* Thesis Period Information */}
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <label className="text-sm font-medium text-blue-800">
                Thông tin cơ bản
              </label>
            </div>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Tên đợt:</span> {thesisPeriod.name}
              </p>
              <p>
                <span className="font-medium">Mô tả:</span> {thesisPeriod.description}
              </p>
              <p>
                <span className="font-medium">Ngày bắt đầu:</span> {thesisPeriod.startDate}
              </p>
              <p>
                <span className="font-medium">Ngày kết thúc:</span> {thesisPeriod.endDate}
              </p>
              <p>
                <span className="font-medium">Năm học:</span> {thesisPeriod.academicYearName}
              </p>
              <p>
                <span className="font-medium">Học kỳ:</span> {thesisPeriod.semesterId}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
} 