import { PageHeader } from "@/components/common/page-header"
import { StatisticsCard } from "@/components/common/statistics-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, GraduationCap, Building2 } from "lucide-react"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { CurrentStatus } from "@/components/dashboard/current-status"
import { 
  dashboardStats, 
  recentActivities, 
  thesisStatus, 
  internshipStatus 
} from "@/modules/dashboard/data"

export default function DashboardPage() {
  const breadcrumbs = [
    { label: "Hệ thống Quản lý", href: "/dashboard" },
    { label: "Tổng quan" }
  ]

  return (
    <PageHeader 
      title="Tổng quan Hệ thống"
      description="Quản lý khóa luận và thực tập sinh viên - Học kỳ 2024-2025"
      breadcrumbs={breadcrumbs}
    >
      <>
        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatisticsCard
            title="Tổng số Khóa luận"
            value={dashboardStats.totalTheses}
            icon={BookOpen}
            description="+12% so với kỳ trước"
            trend={{ value: "+12%", isPositive: true }}
          />
          <StatisticsCard
            title="Thực tập đăng ký"
            value={dashboardStats.totalInternships}
            icon={Building2}
            description="+8% so với kỳ trước"
            trend={{ value: "+8%", isPositive: true }}
          />
          <StatisticsCard
            title="Sinh viên tham gia"
            value={dashboardStats.totalStudents}
            icon={GraduationCap}
            description={`${dashboardStats.totalTheses} khóa luận + ${dashboardStats.totalInternships} thực tập`}
          />
          <StatisticsCard
            title="Giảng viên hướng dẫn"
            value={dashboardStats.totalSupervisors}
            icon={Users}
            description={`Trung bình ${(dashboardStats.totalStudents / dashboardStats.totalSupervisors).toFixed(1)} sinh viên/GV`}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <RecentActivities activities={recentActivities} />
          <CurrentStatus thesisStatus={thesisStatus} internshipStatus={internshipStatus} />
        </div>

        {/* Bottom Charts Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Tiến độ theo tháng</CardTitle>
              <CardDescription>
                Số lượng khóa luận và thực tập hoàn thành
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Biểu đồ tiến độ theo tháng</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phân bố theo chuyên ngành</CardTitle>
              <CardDescription>
                Thống kê khóa luận và thực tập theo từng chuyên ngành
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Biểu đồ phân bố chuyên ngành</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    </PageHeader>
  )
}
