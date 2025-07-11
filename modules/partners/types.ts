export interface Partner {
  id: number;
  name: string;
  description?: string;
  address: string;
  website?: string;
  phoneNumber: string;
  contactPerson?: string;
  email: string;
  isActive: boolean;
  deletedAt?: string;
}

export type PartnerMutationData = Omit<Partner, 'id' | 'deletedAt'>;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PartnerFilters {
  page?: number;
  limit?: number;
  search?: string;
} 