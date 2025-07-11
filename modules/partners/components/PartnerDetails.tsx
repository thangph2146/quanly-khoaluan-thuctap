import React from 'react';
import type { Partner } from '../types';
import { Modal } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Globe, Mail, Phone, User, MapPin } from 'lucide-react';

interface PartnerDetailsProps {
  partner: Partner | null;
  isOpen: boolean;
  onClose: () => void;
}

const DetailItem: React.FC<{ icon: React.ElementType; label: string; value?: string | null }> = ({
  icon: Icon,
  label,
  value,
}) => {
  if (!value) return null;
  return (
    <div className="flex items-start text-sm">
      <Icon className="h-4 w-4 mr-3 mt-1 text-gray-500 flex-shrink-0" />
      <div className="flex-grow">
        <span className="font-medium text-gray-700">{label}:</span>{' '}
        {label === 'Website' ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {value}
          </a>
        ) : (
          <span className="text-gray-800">{value}</span>
        )}
      </div>
    </div>
  );
};

export const PartnerDetails: React.FC<PartnerDetailsProps> = ({ partner, isOpen, onClose }) => {
  if (!partner) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Chi tiết đối tác"
      className="sm:max-w-xl"
    >
      <div className="p-1">
        <div className="text-center pb-4 border-b mb-4">
            <h3 className="text-2xl font-bold text-gray-800">{partner.name}</h3>
            <p className="text-gray-500">{partner.description}</p>
            <Badge variant={partner.isActive ? 'default' : 'destructive'} className="mt-2">
                {partner.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
            </Badge>
        </div>

        <div className="space-y-4">
            <DetailItem icon={Mail} label="Email" value={partner.email} />
            <DetailItem icon={Phone} label="Số điện thoại" value={partner.phoneNumber} />
            <DetailItem icon={MapPin} label="Địa chỉ" value={partner.address} />
            <DetailItem icon={Globe} label="Website" value={partner.website} />
            <DetailItem icon={User} label="Người liên hệ" value={partner.contactPerson} />
        </div>
      </div>
    </Modal>
  );
}; 