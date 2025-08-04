import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { signIn } from "@/auth"
import { LayoutProvider } from "@/components/layouts/layout-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function HomePage() {
  const session = await auth()

  // Nếu đã đăng nhập, hiển thị trang chủ với menu
  if (session) {
    return (
      <LayoutProvider>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Trang chủ</h1>
                  <p className="text-gray-600">Chào mừng trở lại, {session.user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hệ thống Quản lý</CardTitle>
                  <CardDescription>
                    Hệ thống quản lý khóa luận và thực tập
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Chào mừng bạn đến với hệ thống quản lý! Sử dụng menu bên trái để điều hướng đến các chức năng theo quyền của bạn.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thông tin tài khoản</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Email:</strong> {session.user?.email}</p>
                    <p className="text-sm"><strong>Tên:</strong> {session.user?.name || 'Chưa cập nhật'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bắt đầu</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Khám phá các chức năng trong menu để bắt đầu sử dụng hệ thống.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </LayoutProvider>
    )
  }

  // Nếu chưa đăng nhập, hiển thị trang login
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Chào mừng đến với Hệ thống Quản lý
        </h1>
        <p className="text-gray-600 mb-8">
          Hệ thống quản lý khóa luận và thực tập dành cho trường học
        </p>
        
        <form action={async () => {
          "use server"
          await signIn("keycloak")
        }}>
          <Button type="submit" className="w-full" size="lg">
            Đăng nhập
          </Button>
        </form>
      </div>
    </div>
  )
}
