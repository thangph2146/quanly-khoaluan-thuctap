'use client'

import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Save } from 'lucide-react'

export default function ThesisNewPage() {
	const router = useRouter()

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Quản lý Khóa luận', href: '/thesis' },
		{ label: 'Thêm mới' },
	]

	return (
		<PageHeader
			title="Thêm Khóa luận mới"
			description="Nhập thông tin chi tiết để tạo một khóa luận mới."
			breadcrumbs={breadcrumbs}
		>
			<Card>
				<CardHeader>
					<CardTitle>Thông tin Khóa luận</CardTitle>
					<CardDescription>
						Điền vào các trường dưới đây và nhấn lưu.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium">Tên khóa luận</label>
							<Textarea
								placeholder="Ví dụ: Ứng dụng AI trong nhận dạng chữ viết tay"
								className="min-h-[100px]"
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="text-sm font-medium">Sinh viên</label>
								<Input placeholder="Nguyễn Văn A" />
							</div>
							<div>
								<label className="text-sm font-medium">Mã sinh viên</label>
								<Input placeholder="20210001" />
							</div>
							<div>
								<label className="text-sm font-medium">
									Giảng viên hướng dẫn
								</label>
								<Input placeholder="TS. Trần Thị B" />
							</div>
							<div>
								<label className="text-sm font-medium">Học kỳ</label>
								<Input placeholder="2024-2025" />
							</div>
							<div>
								<label className="text-sm font-medium">Ngày đăng ký</label>
								<Input type="date" />
							</div>
							<div>
								<label className="text-sm font-medium">Hạn nộp</label>
								<Input type="date" />
							</div>
							<div>
								<label className="text-sm font-medium">Trạng thái</label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Chọn trạng thái" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="IN_PROGRESS">
											Đang thực hiện
										</SelectItem>
										<SelectItem value="PENDING_DEFENSE">
											Chờ bảo vệ
										</SelectItem>
										<SelectItem value="COMPLETED">Hoàn thành</SelectItem>
										<SelectItem value="OVERDUE">Quá hạn</SelectItem>
										<SelectItem value="APPROVED">Đã duyệt</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<label className="text-sm font-medium">
									Tiến độ (%)
								</label>
								<Input type="number" defaultValue={0} min="0" max="100" />
							</div>
						</div>
					</div>
					<div className="flex justify-end pt-4">
						<Button onClick={() => router.push('/thesis')}>
							<Save className="mr-2 h-4 w-4" />
							Lưu khóa luận
						</Button>
					</div>
				</CardContent>
			</Card>
		</PageHeader>
	)
} 