/**
 * Business Details Component
 */
import React from 'react';
import type { BusinessDetailsProps } from '../types';
import { Modal } from '@/components/common';

const InfoBlock: React.FC<{
  iconColor: string;
  label: string;
  children: React.ReactNode;
}> = ({ iconColor, label, children }) => (
  <div className={`bg-${iconColor}-50 rounded-lg p-4 border border-${iconColor}-200`}>
    <div className="flex items-center gap-2 mb-2">
      <div className={`w-2 h-2 bg-${iconColor}-500 rounded-full`}></div>
      <label className={`text-sm font-medium text-${iconColor}-800`}>{label}</label>
    </div>
    <div className="space-y-1 text-sm">{children}</div>
  </div>
);

export function BusinessDetails({ business, isOpen, onClose }: BusinessDetailsProps) {
  if (!business) return null;
  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()} title="Chi tiết business" className="sm:max-w-lg">
      <div className="space-y-6">
        <div className="text-center pb-4 border-b">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{business.name}</h3>
        </div>
        <div className="space-y-4">
          <InfoBlock iconColor="blue" label="Thông tin cơ bản">
            <p><span className="font-medium">Tên business:</span> {business.name}</p>
            <p><span className="font-medium">Thứ tự hiển thị:</span> {business.displayOrder}</p>
            {business.description && (
              <p><span className="font-medium">Mô tả:</span> {business.description}</p>
            )}
            <p><span className="font-medium">Ngày tạo:</span> {business.createdAt ? new Date(business.createdAt).toLocaleString() : ''}</p>
            {business.updatedAt && (
              <p><span className="font-medium">Ngày cập nhật:</span> {new Date(business.updatedAt).toLocaleString()}</p>
            )}
            {business.deletedAt && (
              <p><span className="font-medium">Ngày xóa:</span> {new Date(business.deletedAt).toLocaleString()}</p>
            )}
          </InfoBlock>
        </div>
      </div>
    </Modal>
  );
}
