/**
 * Internship Details Component
 * Display detailed information about an internship
 */
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Internship } from '../types'

interface InternshipDetailsProps {
  internship: Internship
}

export function InternshipDetails({ internship }: InternshipDetailsProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">Thông tin thực tập</CardTitle>
              <CardDescription className="mt-2">
                Mã số: {internship.id}
              </CardDescription>
            </div>
            <Badge variant="secondary">
              Thực tập
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Thông tin sinh viên</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Tên:</span> {internship.student?.name}</p>
                <p><span className="font-medium">Email:</span> {internship.student?.email}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Thông tin đối tác</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Tên:</span> {internship.partner?.name}</p>
                <p><span className="font-medium">Email:</span> {internship.partner?.email}</p>
                <p><span className="font-medium">Địa chỉ:</span> {internship.partner?.address}</p>
                <p><span className="font-medium">Số điện thoại:</span> {internship.partner?.phoneNumber}</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Thông tin học tập</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Năm học:</span> {internship.academicYear?.name}</p>
                <p><span className="font-medium">Học kỳ:</span> {internship.semester?.name}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Kết quả</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Điểm số:</span> {internship.grade || 'Chưa chấm điểm'}</p>
                <p><span className="font-medium">Báo cáo:</span> {internship.reportUrl ? (
                  <a href={internship.reportUrl} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    Xem báo cáo
                  </a>
                ) : 'Chưa có báo cáo'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
