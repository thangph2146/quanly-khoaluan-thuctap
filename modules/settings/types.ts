/**
 * Settings Module Types
 */

export interface SystemSetting {
  id: number
  settingKey: string
  settingValue: string
  description?: string | null
  createdAt: string
  updatedAt?: string | null
  deletedAt?: string | null
}

export interface SystemSettingFilters {
  page?: number
  limit?: number
  search?: string
}

export interface SystemSettingMutationData {
  settingKey: string
  settingValue: string
  description?: string | null
}

export interface PaginatedSystemSettings {
  data: SystemSetting[]
  total: number
  page: number
  limit: number
} 