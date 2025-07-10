/**
 * Lecturer Details Component
 * Display detailed information about a lecturer
 */
import React from 'react';
import { Modal } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { LecturerDetailsProps } from '../types';

export function LecturerDetails({
  lecturer,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: LecturerDetailsProps) {
  if (!lecturer) {
    return null;
  }

  const handleEditClick = () => {
    onEdit(lecturer);
  };

  const handleDeleteClick = () => {
    onDelete(lecturer);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Chi tiết giảng viên"
      className="sm:max-w-2xl"
    >
      <div className="space-y-6 p-2">
        <div className="flex flex-col items-center space-y-4 pb-6 border-b">
          <Avatar className="h-24 w-24">
            <AvatarImage src={lecturer.avatarUrl ?? undefined} alt={lecturer.name} />
            <AvatarFallback>{lecturer.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-2xl font-bold">{lecturer.name}</h3>
            <p className="text-muted-foreground">{lecturer.email}</p>
            <Badge variant={lecturer.isActive ? 'default' : 'secondary'} className="mt-2">
              {lecturer.isActive ? 'Hoạt động' : 'Không hoạt động'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-lg border-b pb-2">Thông tin liên hệ</h4>
            <InfoItem label="Số điện thoại" value={lecturer.phoneNumber} />
            <InfoItem label="Email" value={lecturer.email} />
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-lg border-b pb-2">Thông tin học thuật</h4>
            <InfoItem label="Khoa/Bộ môn" value={lecturer.department?.name} />
            <InfoItem label="Học hàm" value={lecturer.academicRank} />
            <InfoItem label="Học vị" value={lecturer.degree} />
            <InfoItem label="Chuyên ngành" value={lecturer.specialization} />
          </div>
        </div>
        
        <div className="space-y-4 pt-4 border-t">
           <h4 className="font-semibold text-lg border-b pb-2">Thông tin hệ thống</h4>
            <InfoItem label="Ngày tạo" value={new Date(lecturer.createdAt).toLocaleString('vi-VN')} />
            {lecturer.updatedAt && <InfoItem label="Cập nhật lần cuối" value={new Date(lecturer.updatedAt).toLocaleString('vi-VN')} />}
        </div>

      </div>
      <div className="flex justify-end gap-2 pt-4 mt-6 border-t">
        <Button variant="outline" onClick={handleEditClick}>
          Chỉnh sửa
        </Button>
        <Button variant="destructive" onClick={handleDeleteClick}>
          Xóa
        </Button>
      </div>
    </Modal>
  );
}

const InfoItem = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}:</span>
    <span className="font-medium text-right">{value || 'Chưa có'}</span>
  </div>
); 