'use client'

import { notFound, useRouter } from 'next/navigation'
import { findFormTemplateById } from '@/modules/forms/data'
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

export default function FormTemplateEditPage({
	params,
}: {
	params: { id: string }
}) {
	const router = useRouter()
	const template = findFormTemplateById(params.id)

	if (!template) {
		notFound()
	}

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Biểu mẫu & Đơn từ', href: '/documents/forms' },
		{ label: template.name, href: `/documents/forms/${template.id}` },
		{ label: 'Chỉnh sửa' },
	]

	return (
		<PageHeader
			title="Chỉnh sửa Biểu mẫu"
			description={`Cập nhật thông tin cho "${template.name}"`}
			breadcrumbs={breadcrumbs}
		>
			<Card>
				<CardHeader>
					<CardTitle>Thông tin Biểu mẫu</CardTitle>
					<CardDescription>
						Chỉnh sửa các thông tin dưới đây. Nhấn lưu để cập nhật.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-4">
						<InputGroup>
							<Label>Tên biểu mẫu</Label>
							<Input defaultValue={template.name} />
						</InputGroup>

						<InputGroup>
							<Label>Mô tả</Label>
							<Textarea
								defaultValue={template.description}
								className="min-h-[120px]"
							/>
						</InputGroup>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<InputGroup>
								<Label>Phiên bản</Label>
								<Input defaultValue={template.version} />
							</InputGroup>
							<InputGroup>
								<Label>Phân loại</Label>
								<Select defaultValue={template.category}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="THESIS">Khóa luận</SelectItem>
										<SelectItem value="INTERNSHIP">Thực tập</SelectItem>
									</SelectContent>
								</Select>
							</InputGroup>
							<InputGroup>
								<Label>Trạng thái</Label>
								<Select defaultValue={template.status}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
										<SelectItem value="ARCHIVED">Lưu trữ</SelectItem>
									</SelectContent>
								</Select>
							</InputGroup>
						</div>

						<InputGroup>
							<Label>Tệp đính kèm (Để trống nếu không thay đổi)</Label>
							<div className="flex items-center space-x-2">
								<Input type="file" className="flex-1" />
								<Button variant="outline">
									<Upload className="mr-2 h-4 w-4" />
									Tải lên
								</Button>
							</div>
							<p className="text-sm text-muted-foreground">
								Tệp hiện tại: {template.format} ({template.fileSize})
							</p>
						</InputGroup>

						<InputGroup>
							<Label>Các trường bắt buộc (mỗi trường một dòng)</Label>
							<Textarea
								defaultValue={template.requiredFields.join('\n')}
								className="min-h-[150px]"
							/>
						</InputGroup>
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