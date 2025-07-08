/**
 * Lecturer Details Component
 * Display detailed information about a lecturer
 */
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Lecturer } from '../types'

interface LecturerDetailsProps {
  lecturer: Lecturer
}

export function LecturerDetails({ lecturer }: LecturerDetailsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={lecturer.avatarUrl} alt={lecturer.name} />
              <AvatarFallback>{lecturer.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                {lecturer.name}
                <Badge variant={lecturer.isActive ? 'default' : 'secondary'}>
                  {lecturer.isActive ? 'Hoạt động' : 'Không hoạt động'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{lecturer.email}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Thông tin cơ bản</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-start gap-2">
                  <span className="text-muted-foreground">ID:</span>
                  <span>{lecturer.id}</span>
                </div>
                <div className="flex justify-start gap-2">
                  <span className="text-muted-foreground">Email:</span> 
                  <span>{lecturer.email}</span>
                </div>
                <div className="flex justify-start gap-2">
                  <span className="text-muted-foreground">Số điện thoại:</span>
                  <span>{lecturer.phoneNumber || 'Chưa có'}</span>
                </div>
                <div className="flex justify-start gap-2">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <Badge variant={lecturer.isActive ? 'default' : 'secondary'}>
                    {lecturer.isActive ? 'Hoạt động' : 'Không hoạt động'}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Thông tin học thuật</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-start gap-2">
                  <span className="text-muted-foreground">Khoa/Bộ môn:</span>
                  <span>{lecturer.departmentName || 'Chưa có'}</span>
                </div>
                <div className="flex justify-start gap-2">
                  <span className="text-muted-foreground">Học hàm:</span>
                  <span>{lecturer.academicRank || 'Chưa có'}</span>
                </div>
                <div className="flex justify-start gap-2">
                  <span className="text-muted-foreground">Học vị:</span>
                  <span>{lecturer.degree || 'Chưa có'}</span>
                </div>
                <div className="flex justify-start gap-2">
                  <span className="text-muted-foreground">Chuyên ngành:</span>
                  <span>{lecturer.specialization || 'Chưa có'}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-4" />
          
          <div>
            <h4 className="font-medium mb-2">Thời gian</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-start gap-2">
                  <span className="text-muted-foreground">Tạo lúc:</span>
                  <span>{new Date(lecturer.createdAt).toLocaleString('vi-VN')}</span>
                </div>
                <div className="flex justify-start gap-2">
                  <span className="text-muted-foreground">Cập nhật:</span>
                  <span>{new Date(lecturer.updatedAt).toLocaleString('vi-VN')}</span>
                </div>
              </div>
            </div>
          </div>

          {lecturer.avatarUrl && (
            <>
              <Separator className="my-4" />
              <div>
                <h4 className="font-medium mb-2">Ảnh đại diện</h4>
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={lecturer.avatarUrl} alt={lecturer.name} />
                    <AvatarFallback>{lecturer.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm text-muted-foreground">
                    <p>URL: {lecturer.avatarUrl}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 