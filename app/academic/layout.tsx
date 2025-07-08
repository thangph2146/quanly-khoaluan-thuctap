import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quản lý Học vụ - Hệ thống Quản lý Khóa luận & Thực tập',
  description: 'Quản lý năm học, học kỳ, đơn vị và sinh viên',
}

export default function AcademicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
