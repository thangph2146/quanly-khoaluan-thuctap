'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  ProtectedButton, 
  CreateButton, 
  UpdateButton, 
  DeleteButton,
  CompoundProtectedButton
} from '@/components/common/ProtectedButton'
import { 
  ProtectedContent, 
  ReadOnlyContent, 
  AdminOnlyContent,
  useConditionalRender
} from '@/components/common/ProtectedContent'
import { usePermissions } from '@/contexts/PermissionContext'
import { 
  Users, 
  Settings, 
  BookOpen, 
  Shield, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  Download
} from 'lucide-react'

export function PermissionExamples() {
  const { permissions, canCreate, canRead, canUpdate, canDelete, hasAnyPermission } = usePermissions()
  const { renderIf, renderIfAny, renderIfAll } = useConditionalRender()
  const [selectedModule, setSelectedModule] = useState<string>('User')

  const availableModules = Object.keys(permissions)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Permission System Examples</h1>
        <p className="text-gray-600 mt-2">
          Demo các cách sử dụng hệ thống phân quyền mới
        </p>
      </div>

      <Tabs defaultValue="buttons" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="buttons">Protected Buttons</TabsTrigger>
          <TabsTrigger value="content">Protected Content</TabsTrigger>
          <TabsTrigger value="conditional">Conditional Rendering</TabsTrigger>
          <TabsTrigger value="hooks">Permission Hooks</TabsTrigger>
          <TabsTrigger value="realtime">Real-time Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="buttons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Protected Buttons</CardTitle>
              <CardDescription>
                Buttons tự động ẩn/hiện dựa trên permissions của user
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Chọn Module để test:</Label>
                <select 
                  value={selectedModule} 
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="ml-2 border rounded px-2 py-1"
                >
                  {availableModules.map(module => (
                    <option key={module} value={module}>{module}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Basic Protected Buttons */}
                <ProtectedButton module={selectedModule} action="create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </ProtectedButton>

                <ProtectedButton module={selectedModule} action="read">
                  <Eye className="h-4 w-4 mr-2" />
                  Read
                </ProtectedButton>

                <ProtectedButton module={selectedModule} action="update">
                  <Edit className="h-4 w-4 mr-2" />
                  Update
                </ProtectedButton>

                <ProtectedButton module={selectedModule} action="delete" variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </ProtectedButton>

                {/* Convenience Buttons */}
                <CreateButton module={selectedModule} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Quick Create
                </CreateButton>

                <UpdateButton module={selectedModule} variant="secondary">
                  <Edit className="h-4 w-4 mr-2" />
                  Quick Update
                </UpdateButton>

                <DeleteButton module={selectedModule} variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Quick Delete
                </DeleteButton>

                {/* Compound Button */}
                <CompoundProtectedButton 
                  module={selectedModule} 
                  actions={['update', 'delete']}
                  requireAll={false}
                  variant="outline"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Mode
                </CompoundProtectedButton>
              </div>

              <div className="text-sm text-gray-600">
                <strong>Lưu ý:</strong> Các button chỉ hiển thị khi user có quyền tương ứng. 
                Nếu không có quyền, button sẽ bị ẩn hoàn toàn.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Protected Content Examples */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Protected Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProtectedContent module="User" action="read">
                  <div className="p-4 bg-green-50 border border-green-200 rounded">
                    <h4 className="font-semibold text-green-800">User Read Access</h4>
                    <p className="text-green-700">Bạn có quyền đọc thông tin User!</p>
                  </div>
                </ProtectedContent>

                <ProtectedContent module="Settings" action="update">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                    <h4 className="font-semibold text-blue-800">Settings Update Access</h4>
                    <p className="text-blue-700">Bạn có quyền cập nhật Settings!</p>
                  </div>
                </ProtectedContent>

                <ProtectedContent 
                  module="Role" 
                  action="delete"
                  showPermissionDenied={true}
                  permissionDeniedMessage="Bạn không có quyền xóa Role!"
                >
                  <div className="p-4 bg-red-50 border border-red-200 rounded">
                    <h4 className="font-semibold text-red-800">Dangerous Action</h4>
                    <p className="text-red-700">Chỉ admin mới thấy nội dung này!</p>
                  </div>
                </ProtectedContent>
              </CardContent>
            </Card>

            {/* Convenience Components */}
            <Card>
              <CardHeader>
                <CardTitle>Convenience Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ReadOnlyContent module="Student">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                    <h4 className="font-semibold">Student Information</h4>
                    <p className="text-gray-700">
                      Thông tin sinh viên chỉ hiển thị cho user có quyền đọc.
                    </p>
                  </div>
                </ReadOnlyContent>

                <AdminOnlyContent module="User">
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded">
                    <h4 className="font-semibold text-purple-800">Admin Panel</h4>
                    <p className="text-purple-700">
                      Chỉ admin (có full CRUD permissions) mới thấy được!
                    </p>
                  </div>
                </AdminOnlyContent>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conditional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conditional Rendering Hook</CardTitle>
              <CardDescription>
                Sử dụng useConditionalRender hook để render điều kiện
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderIf('User', 'create', 
                <Badge className="bg-green-100 text-green-800">
                  ✅ Có thể tạo User
                </Badge>
              )}

              {renderIfAny('Student', ['update', 'delete'],
                <Badge className="bg-blue-100 text-blue-800">
                  ✅ Có thể chỉnh sửa Student
                </Badge>
              )}

              {renderIfAll('Role', ['create', 'update', 'delete'],
                <Badge className="bg-purple-100 text-purple-800">
                  ✅ Full quyền quản lý Role
                </Badge>
              )}

              <div className="text-sm text-gray-600 mt-4">
                <strong>useConditionalRender</strong> cung cấp:
                <ul className="list-disc list-inside mt-2">
                  <li><code>renderIf(module, action, content, fallback?)</code></li>
                  <li><code>renderIfAny(module, actions[], content, fallback?)</code></li>
                  <li><code>renderIfAll(module, actions[], content, fallback?)</code></li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission Hooks</CardTitle>
              <CardDescription>
                Thông tin chi tiết về permissions hiện tại của user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current User Permissions */}
                <div>
                  <h4 className="font-semibold mb-3">Permissions của bạn:</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {Object.entries(permissions).map(([module, perms]) => (
                      <div key={module} className="border rounded p-3">
                        <h5 className="font-medium mb-2">{module}</h5>
                        <div className="flex flex-wrap gap-1">
                          {perms.canCreate && <Badge variant="outline">Create</Badge>}
                          {perms.canRead && <Badge variant="outline">Read</Badge>}
                          {perms.canUpdate && <Badge variant="outline">Update</Badge>}
                          {perms.canDelete && <Badge variant="outline">Delete</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hook Examples */}
                <div>
                  <h4 className="font-semibold mb-3">Hook Usage Examples:</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        canCreate('User')
                      </code>
                      <span className="ml-2">
                        → {canCreate('User') ? '✅ true' : '❌ false'}
                      </span>
                    </div>

                    <div>
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        canUpdate('Settings')
                      </code>
                      <span className="ml-2">
                        → {canUpdate('Settings') ? '✅ true' : '❌ false'}
                      </span>
                    </div>

                    <div>
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        hasAnyPermission('Role')
                      </code>
                      <span className="ml-2">
                        → {hasAnyPermission('Role') ? '✅ true' : '❌ false'}
                      </span>
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded">
                      <strong>Available hooks:</strong>
                      <ul className="list-disc list-inside mt-2 text-xs">
                        <li>canCreate, canRead, canUpdate, canDelete</li>
                        <li>canExport, canApprove, canAssign</li>
                        <li>hasAnyPermission, getModulePermissions</li>
                        <li>refreshPermissions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Permission Updates</CardTitle>
              <CardDescription>
                System tự động cập nhật permissions khi admin thay đổi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <h4 className="font-semibold text-blue-800">✨ Real-time Features</h4>
                <ul className="list-disc list-inside mt-2 text-blue-700">
                  <li>Server-Sent Events (SSE) cho real-time updates</li>
                  <li>Tự động refresh permissions khi có thay đổi</li>
                  <li>Fallback polling nếu SSE không hỗ trợ</li>
                  <li>UI components tự động update không cần reload</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <h4 className="font-semibold text-green-800">🔄 Auto-refresh</h4>
                <p className="text-green-700 mt-1">
                  Permissions được tự động refresh mỗi 5 phút hoặc khi có thay đổi từ admin.
                  Không cần logout/login lại!
                </p>
              </div>

              <div className="text-sm text-gray-600">
                <strong>Cách hoạt động:</strong>
                <ol className="list-decimal list-inside mt-2">
                  <li>Admin cập nhật permissions trong admin panel</li>
                  <li>Backend gửi real-time notification qua SSE</li>
                  <li>Frontend tự động cập nhật permissions</li>
                  <li>UI components re-render với permissions mới</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 