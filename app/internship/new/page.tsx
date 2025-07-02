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

export default function InternshipNewPage() {
	const router = useRouter()

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Quản lý Thực tập', href: '/internship' },
		{ label: 'Thêm mới' },
	]

	return (
		<PageHeader
			title="Đăng ký Thực tập mới"
			description="Nhập thông tin chi tiết để đăng ký một chương trình thực tập mới"
			breadcrumbs={breadcrumbs}
		>
			<Card>
				<CardHeader>
					<CardTitle>Thông tin Thực tập</CardTitle>
					<CardDescription>
						Điền vào các trường dưới đây và nhấn lưu.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium">Tên công việc</label>
							<Textarea
								placeholder="Ví dụ: Thực tập sinh Frontend Developer tại..."
								className="min-h-[100px]"
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<InputGroup>
								<Label>Sinh viên</Label>
								<Input placeholder="Nguyễn Văn A" />
							</InputGroup>
							<InputGroup>
								<Label>Mã sinh viên</Label>
								<Input placeholder="20210001" />
							</InputGroup>
							<InputGroup>
								<Label>Công ty</Label>
								<Input placeholder="FPT Software" />
							</InputGroup>
							<InputGroup>
								<Label>Vị trí</Label>
								<Input placeholder="Frontend Developer" />
							</InputGroup>
							<InputGroup>
								<Label>GV Hướng dẫn</Label>
								<Input placeholder="TS. Trần Văn B" />
							</InputGroup>
							<InputGroup>
								<Label>Người HD tại công ty</Label>
								<Input placeholder="Nguyễn Đức C" />
							</InputGroup>
							<InputGroup>
								<Label>Địa điểm</Label>
								<Input placeholder="Hà Nội" />
							</InputGroup>
							<InputGroup>
								<Label>Ngày bắt đầu</Label>
								<Input type="date" />
							</InputGroup>
							<InputGroup>
								<Label>Ngày kết thúc</Label>
								<Input type="date" />
							</InputGroup>
							<InputGroup>
								<Label>Mức lương</Label>
								<Input placeholder="5,000,000 VNĐ" />
							</InputGroup>
							<InputGroup>
								<Label>Đánh giá (0-5)</Label>
								<Input
									type="number"
									defaultValue={0}
									min="0"
									max="5"
									step="0.1"
								/>
							</InputGroup>
							<InputGroup>
								<Label>Trạng thái</Label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Chọn trạng thái" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="APPROVED">Đã phê duyệt</SelectItem>
										<SelectItem value="IN_PROGRESS">
											Đang thực tập
										</SelectItem>
										<SelectItem value="PENDING_EVALUATION">
											Chờ đánh giá
										</SelectItem>
										<SelectItem value="COMPLETED">Hoàn thành</SelectItem>
										<SelectItem value="CANCELLED">Đã hủy</SelectItem>
									</SelectContent>
								</Select>
							</InputGroup>
						</div>
					</div>
					<div className="flex justify-end pt-4">
						<Button onClick={() => router.push('/internship')}>
							<Save className="mr-2 h-4 w-4" />
							Lưu đăng ký
						</Button>
					</div>
				</CardContent>
			</Card>
		</PageHeader>
	)
}

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