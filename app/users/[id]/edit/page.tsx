'use client'

import { findUserById } from '@/modules/users/data'
import { notFound, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/common'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Save } from 'lucide-react'

export default function UserEditPage({ params }: { params: { id: string } }) {
	const router = useRouter()
	const user = findUserById(params.id)

	if (!user) {
		notFound()
	}

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Quản lý Người dùng', href: '/users' },
		{ label: user.name, href: `/users/${user.id}` },
		{ label: 'Chỉnh sửa' },
	]

	return (
		<PageHeader
			title="Chỉnh sửa Người dùng"
			description={`Cập nhật thông tin cho ${user.name}`}
			breadcrumbs={breadcrumbs}
		>
			<Card>
				<CardHeader>
					<CardTitle>Thông tin chi tiết</CardTitle>
					<CardDescription>
						Chỉnh sửa các thông tin dưới đây và nhấn lưu.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Column 1 */}
						<div className="space-y-4">
							<div>
								<label className="text-sm font-medium">Họ và tên</label>
								<Input defaultValue={user.name} />
							</div>
							<div>
								<label className="text-sm font-medium">Email</label>
								<Input type="email" defaultValue={user.email} />
							</div>
							<div>
								<label className="text-sm font-medium">Số điện thoại</label>
								<Input defaultValue={user.phone} />
							</div>
							<div>
								<label className="text-sm font-medium">Địa chỉ</label>
								<Input defaultValue={user.address} />
							</div>
							<div>
								<label className="text-sm font-medium">Ngày sinh</label>
								<Input type="date" defaultValue={user.dateOfBirth} />
							</div>
						</div>
						{/* Column 2 */}
						<div className="space-y-4">
							<div>
								<label className="text-sm font-medium">Vai trò</label>
								<Select defaultValue={user.role}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="STUDENT">Sinh viên</SelectItem>
										<SelectItem value="LECTURER">Giảng viên</SelectItem>
										<SelectItem value="ADMIN">Quản trị viên</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<label className="text-sm font-medium">Trạng thái</label>
								<Select defaultValue={user.status}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="ACTIVE">Hoạt động</SelectItem>
										<SelectItem value="INACTIVE">Vô hiệu hóa</SelectItem>
										<SelectItem value="PENDING">Chờ duyệt</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<label className="text-sm font-medium">Khoa/Phòng ban</label>
								<Input defaultValue={user.department} />
							</div>
							{user.role === 'STUDENT' && (
								<div>
									<label className="text-sm font-medium">Mã sinh viên</label>
									<Input defaultValue={user.studentId} />
								</div>
							)}
							{user.role === 'LECTURER' && (
								<div>
									<label className="text-sm font-medium">
										Mã giảng viên
									</label>
									<Input defaultValue={user.employeeId} />
								</div>
							)}
						</div>
					</div>
					<div className="flex justify-end pt-4">
						<Button onClick={() => router.back()}>
							<Save className="mr-2 h-4 w-4" />
							Lưu thay đổi
						</Button>
					</div>
				</CardContent>
			</Card>
		</PageHeader>
	)
} 