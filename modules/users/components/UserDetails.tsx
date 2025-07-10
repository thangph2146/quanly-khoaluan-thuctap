/**
 * User Details Component
 * Display detailed information about a user
 */
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { User } from '../types'
import { Modal } from '@/components/common'

interface UserDetailsProps {
  isOpen: boolean
  onClose: () => void
  user: User
}

export function UserDetails({ isOpen, onClose, user }: UserDetailsProps) {
  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Chi tiết người dùng"
      className="sm:max-w-2xl"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  {user.name}
                  <Badge variant={user.isActive ? 'default' : 'secondary'}>
                    {user.isActive ? 'Kích hoạt' : 'Vô hiệu hóa'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
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
                    <span>{user.id}</span>
                  </div>
                  <div className="flex justify-start gap-2">
                    <span className="text-muted-foreground">Email:</span> 
                    <span>{user.email}</span>
                  </div>
                  <div className="flex justify-start gap-2">
                    <span className="text-muted-foreground">Keycloak ID:</span>
                    <span className="font-mono text-xs">{user.keycloakUserId}</span>
                  </div>
                  <div className="flex justify-start gap-2">
                    <span className="text-muted-foreground">Trạng thái:</span>
                    <Badge variant={user.isActive ? 'default' : 'secondary'}>
                      {user.isActive ? 'Kích hoạt' : 'Vô hiệu hóa'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Thời gian</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-start gap-2">
                    <span className="text-muted-foreground">Tạo lúc:</span>
                    <span>{new Date(user.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-start gap-2">
                    <span className="text-muted-foreground">Cập nhật:</span>
                    <span>{new Date(user.updatedAt).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {user.userRoles && user.userRoles.length > 0 && (
              <>
                <Separator className="my-4" />
                <div>
                  <h4 className="font-medium mb-2">Vai trò</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.userRoles.map((role, index) => (
                      <Badge key={index} variant="secondary">
                        {role}
                      </Badge>
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
