/**
 * Department Access Setting Component
 */
'use client'

import React, { useState, useEffect } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Users, Shield } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useSetting, useSettingActions } from '../hooks/use-settings'
import { logger } from '@/lib/utils/logger'

const SETTING_KEY = 'ALLOW_CROSS_DEPARTMENT_DATA_ACCESS'

export function DepartmentAccessSetting() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  
  const { setting, isLoading, error, refetch } = useSetting(SETTING_KEY)
  const { updateSetting, isUpdating, error: updateError } = useSettingActions(() => {
    logger.info('Department access setting updated successfully')
    setHasChanges(false)
    refetch()
  })

  // Sync với setting từ backend
  useEffect(() => {
    if (setting) {
      const enabled = setting.settingValue === 'true'
      setIsEnabled(enabled)
      setHasChanges(false)
    }
  }, [setting])

  const handleToggle = async (value: boolean) => {
    try {
      setIsEnabled(value)
      setHasChanges(true)
      await updateSetting(SETTING_KEY, value.toString())
    } catch (err) {
      // Revert trên error
      setIsEnabled(!value)
      setHasChanges(false)
      logger.error('Failed to update department access setting', err)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Phân quyền xem dữ liệu phòng ban
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Lỗi tải cài đặt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Phân quyền xem dữ liệu phòng ban
        </CardTitle>
        <CardDescription>
          Cấu hình xem các phòng ban có thể xem dữ liệu của phòng ban khác hay không
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="department-access-toggle" className="text-sm font-medium">
              Cho phép xem dữ liệu giữa các phòng ban
            </Label>
            <p className="text-sm text-muted-foreground">
              {isEnabled 
                ? 'Tất cả phòng ban có thể xem dữ liệu của nhau'
                : 'Chỉ được xem dữ liệu phòng ban mình và phòng ban con'
              }
            </p>
          </div>
          <Switch
            id="department-access-toggle"
            checked={isEnabled}
            onCheckedChange={handleToggle}
            disabled={isUpdating}
          />
        </div>

        {/* Thông tin chi tiết */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Khi BẬT:</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>• Các phòng ban xem dữ liệu tất cả phòng ban khác</li>
                <li>• Admin luôn xem tất cả dữ liệu</li>
                <li>• Thuận tiện cho báo cáo tổng hợp</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Khi TẮT:</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>• Chỉ xem dữ liệu phòng ban mình</li>
                <li>• Phòng ban cha xem thêm dữ liệu phòng ban con</li>
                <li>• Admin vẫn xem tất cả dữ liệu</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Show error nếu có */}
        {updateError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{updateError}</AlertDescription>
          </Alert>
        )}

        {/* Show loading state */}
        {isUpdating && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Đang cập nhật cài đặt...</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
} 