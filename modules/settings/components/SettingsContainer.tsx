/**
 * Settings Container Component
 */
'use client'

import React from 'react'
import { PageHeader } from '@/components/common'
import { DepartmentAccessSetting } from './DepartmentAccessSetting'

export function SettingsContainer() {
  return (
    <div className="w-full mx-auto py-6 space-y-6 p-4">
      {/* Page Header */}
      <PageHeader
        title="Cài đặt hệ thống"
        description="Quản lý các cài đặt và cấu hình hệ thống"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Cài đặt", href: "/admin/settings" },
        ]}
      >
        <div></div>
      </PageHeader>

      {/* Settings Content */}
      <div className="space-y-6">
        <DepartmentAccessSetting />
      </div>
    </div>
  )
} 