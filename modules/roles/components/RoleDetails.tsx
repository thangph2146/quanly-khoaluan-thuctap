/**
 * Role Details Component
 * Display detailed information about a role
 */
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Role } from '../types'
import { getRoleDisplayName } from '../utils'
import { Modal } from '@/components/common'

interface RoleDetailsProps {
  isOpen: boolean
  onClose: () => void
  role: Role
}

export function RoleDetails({ isOpen, onClose, role }: RoleDetailsProps) {
  if (!isOpen) return null
  
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Chi tiết vai trò"
      className="sm:max-w-2xl"
    >
        <div className="space-y-6">
        <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                {getRoleDisplayName(role.name)}
                <Badge variant="outline">{role.name}</Badge>
            </CardTitle>
            <CardDescription>
                {role.description || 'Không có mô tả'}
            </CardDescription>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <h4 className="font-medium mb-2">Thông tin cơ bản</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <span>{role.id}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Tên vai trò:</span>
                    <span>{role.name}</span>
                    </div>
                </div>
                </div>

                <div>
                <h4 className="font-medium mb-2">Quyền hạn</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Số lượng quyền:</span>
                    <span>{role.rolePermissions?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Số người dùng:</span>
                    <span>{role.userRoles?.length || 0}</span>
                    </div>
                </div>
                </div>
            </div>

            {role.rolePermissions && role.rolePermissions.length > 0 && (
                <>
                <Separator className="my-4" />
                <div>
                    <h4 className="font-medium mb-2">Danh sách quyền</h4>
                    <div className="flex flex-wrap gap-2">
                    {role.rolePermissions.map((rp) => (
                        <Badge key={rp.permissionId} variant="secondary">
                        {rp.permission?.name || `Permission ${rp.permissionId}`}
                        </Badge>
                    ))}
                    </div>
                </div>
                </>
            )}

            {role.userRoles && role.userRoles.length > 0 && (
                <>
                <Separator className="my-4" />
                <div>
                    <h4 className="font-medium mb-2">Người dùng có vai trò này</h4>
                    <div className="space-y-2">
                    {role.userRoles.map((ur) => (
                        <div key={ur.userId} className="flex items-center gap-2">
                        <Badge variant="outline">{ur.user?.name || `User ${ur.userId}`}</Badge>
                        </div>
                    ))}
                    </div>
                </div>
                </>
            )}
            </CardContent>
        </Card>
        </div>
    </Modal>
  )
}
