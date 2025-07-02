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
import { Label } from '@/components/ui/label'

export default function NewGuidelinePage() {
	const router = useRouter()

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Hướng dẫn & Quy định', href: '/documents/guidelines' },
		{ label: 'Tạo tài liệu mới' },
	]

	return (
		<PageHeader
			title="Tạo Tài liệu Mới"
			description="Điền thông tin để tạo một tài liệu hướng dẫn hoặc quy định mới"
			breadcrumbs={breadcrumbs}
		>
			<Card>
				<CardHeader>
					<CardTitle>Thông tin Tài liệu</CardTitle>
					<CardDescription>
						Cung cấp các chi tiết cần thiết cho tài liệu mới.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-4">
						<div className="space-y-2">
							<Label>Tiêu đề</Label>
							<Input placeholder="Ví dụ: Quy định về đạo văn..." />
						</div>

						<div className="space-y-2">
							<Label>Mô tả</Label>
							<Textarea
								placeholder="Mô tả ngắn gọn về nội dung và phạm vi áp dụng của tài liệu."
								className="min-h-[120px]"
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="space-y-2">
								<Label>Phiên bản</Label>
								<Input placeholder="Ví dụ: 1.0" />
							</div>
							<div className="space-y-2">
								<Label>Tác giả</Label>
								<Input placeholder="Ví dụ: Phòng Đào tạo" />
							</div>
							<div className="space-y-2">
								<Label>Phân loại</Label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Chọn phân loại" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="THESIS_PROCESS">
											Quy trình Khóa luận
										</SelectItem>
										<SelectItem value="INTERNSHIP_PROCESS">
											Quy trình Thực tập
										</SelectItem>
										<SelectItem value="REPORTING_GUIDE">
											Hướng dẫn Báo cáo
										</SelectItem>
										<SelectItem value="SYSTEM_USAGE">
											Hướng dẫn Hệ thống
										</SelectItem>
										<SelectItem value="GENERAL_REGULATION">
											Quy định chung
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-2">
							<Label>Tệp đính kèm</Label>
							<div className="flex items-center space-x-2">
								<Input type="file" className="flex-1" required />
								<Button variant="outline">
									<Upload className="mr-2 h-4 w-4" />
									Tải lên
								</Button>
							</div>
						</div>

						<div className="space-y-2">
							<Label>Tags (cách nhau bởi dấu phẩy)</Label>
							<Input placeholder="khóa luận, báo cáo,..." />
						</div>

						<div className="space-y-2">
							<Label>Tài liệu liên quan (ID cách nhau bởi dấu phẩy)</Label>
							<Input placeholder="FORM001, GUIDE002,..." />
						</div>
					</div>

					<div className="flex justify-end pt-4">
						<Button onClick={() => router.push('/documents/guidelines')}>
							<Save className="mr-2 h-4 w-4" />
							Lưu và Tạo mới
						</Button>
					</div>
				</CardContent>
			</Card>
		</PageHeader>
	)
} 