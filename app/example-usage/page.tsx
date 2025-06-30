"use client"

import { useState } from "react"
import { 
  PageHeader,
  StatisticsCard,
  StatusBadge,
  EmptyState,
  LoadingSkeleton,
  TextField,
  SelectField,
  FormSection,
} from "@/components/common"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  Plus,
  FileText
} from "lucide-react"

export default function ExampleUsagePage() {
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('')

  const handleLoadingToggle = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <PageHeader
      title="Ví dụ sử dụng Components"
      description="Demo các common components được tạo"
      breadcrumbs={[
        { label: 'Hệ thống Quản lý', href: '/dashboard' },
        { label: 'Ví dụ Components' },
      ]}
      actions={
        <Button onClick={handleLoadingToggle}>
          <Plus className="mr-2 h-4 w-4" />
          Toggle Loading
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Statistics Cards Example */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Statistics Cards</h2>
          {loading ? (
            <LoadingSkeleton
              type="card"
              count={4}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatisticsCard
                title="Tổng sinh viên"
                value={245}
                description="so với tháng trước"
                icon={GraduationCap}
                trend={{ value: '12%', isPositive: true }}
              />
              <StatisticsCard
                title="Khóa luận"
                value={156}
                description="đang thực hiện"
                icon={BookOpen}
                trend={{ value: '5%', isPositive: false }}
              />
              <StatisticsCard
                title="Giảng viên"
                value={42}
                description="đang hoạt động"
                icon={Users}
                variant="success"
              />
              <StatisticsCard
                title="Cần xử lý"
                value={8}
                description="yêu cầu chờ duyệt"
                icon={FileText}
                variant="warning"
              />
            </div>
          )}
        </div>

        {/* Status Badges Example */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Status Badges</h2>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status="active" />
            <StatusBadge status="inactive" />
            <StatusBadge status="pending" />
            <StatusBadge status="approved" />
            <StatusBadge status="completed" />
            <StatusBadge status="overdue" />
            <StatusBadge status="cancelled" />
          </div>
        </div>

        {/* Form Fields Example */}
        <Card>
          <CardHeader>
            <CardTitle>Form Fields Example</CardTitle>
          </CardHeader>
          <CardContent>
            <FormSection
              title="Thông tin cơ bản"
              description="Nhập thông tin người dùng"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Tên tìm kiếm"
                  id="search"
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Nhập từ khóa tìm kiếm..."
                />
                <SelectField
                  label="Vai trò"
                  id="role"
                  value={selectedRole}
                  onChange={setSelectedRole}
                  options={[
                    { value: 'student', label: 'Sinh viên' },
                    { value: 'teacher', label: 'Giảng viên' },
                    { value: 'admin', label: 'Quản trị viên' },
                  ]}
                  placeholder="Chọn vai trò"
                />
              </div>
            </FormSection>
          </CardContent>
        </Card>

        {/* Data Table Example */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Data Table</h2>
          {loading ? (
            <LoadingSkeleton type="table" count={5} />
          ) : (
            <p className="text-muted-foreground">
              (DataTable is currently commented out to fix type errors)
            </p>
          )}
        </div>

        {/* Empty State Example */}
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              icon={Users}
              title="Không có dữ liệu"
              description="Chưa có người dùng nào trong hệ thống. Hãy thêm người dùng đầu tiên."
              action={{
                label: 'Thêm người dùng',
                onClick: () => console.log('Add user clicked'),
              }}
            />
          </CardContent>
        </Card>
      </div>
    </PageHeader>
  )
} 