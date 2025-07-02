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
import { Save, Upload } from 'lucide-react'

export default function NewFormTemplatePage() {
	const router = useRouter()

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Biểu mẫu & Đơn từ', href: '/documents/forms' },
		{ label: 'Tạo biểu mẫu mới' },
	]

	return (
		<PageHeader
			title="Tạo Biểu mẫu Mới"
			description="Điền thông tin để tạo một biểu mẫu mới"
			breadcrumbs={breadcrumbs}
		>
			<Card>
				<CardHeader>
					<CardTitle>Thông tin Biểu mẫu</CardTitle>
					<CardDescription>
						Cung cấp các chi tiết cần thiết cho biểu mẫu mới.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-4">
						<InputGroup>
							<Label>Tên biểu mẫu</Label>
							<Input placeholder="Ví dụ: Đơn xin gia hạn đề tài..." />
						</InputGroup>

						<InputGroup>
							<Label>Mô tả</Label>
							<Textarea
								placeholder="Mô tả ngắn gọn về mục đích và đối tượng sử dụng của biểu mẫu."
								className="min-h-[120px]"
							/>
						</InputGroup>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<InputGroup>
								<Label>Phiên bản</Label>
								<Input placeholder="Ví dụ: 2024.1" />
							</InputGroup>
							<InputGroup>
								<Label>Phân loại</Label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Chọn phân loại" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="THESIS">Khóa luận</SelectItem>
										<SelectItem value="INTERNSHIP">Thực tập</SelectItem>
									</SelectContent>
								</Select>
							</InputGroup>
							<InputGroup>
								<Label>Trạng thái</Label>
								<Select defaultValue="ACTIVE">
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
										<SelectItem value="ARCHIVED">Lưu trữ</SelectItem>
										<SelectItem value="DRAFT">Bản nháp</SelectItem>
									</SelectContent>
								</Select>
							</InputGroup>
						</div>

						<InputGroup>
							<Label>Tệp đính kèm</Label>
							<div className="flex items-center space-x-2">
								<Input type="file" className="flex-1" required />
								<Button variant="outline">
									<Upload className="mr-2 h-4 w-4" />
									Tải lên
								</Button>
							</div>
						</InputGroup>

						<InputGroup>
							<Label>Các trường bắt buộc (mỗi trường một dòng)</Label>
							<Textarea
								placeholder="Ví dụ:&#10;Họ và tên&#10;Mã số sinh viên&#10;Tên đề tài..."
								className="min-h-[150px]"
							/>
						</InputGroup>
					</div>

					<div className="flex justify-end pt-4">
						<Button onClick={() => router.push('/documents/forms')}>
							<Save className="mr-2 h-4 w-4" />
							Lưu và Tạo mới
						</Button>
					</div>
				</CardContent>
			</Card>
		</PageHeader>
	)
}

// Helper components for layout
const InputGroup = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => <div className={`space-y-2 ${className}`}>{children}</div>

const Label = ({ children }: { children: React.ReactNode }) => (
	<label className="text-sm font-medium">{children}</label>
) 