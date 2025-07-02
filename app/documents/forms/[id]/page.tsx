'use client'

import { notFound, useRouter } from 'next/navigation'
import { findFormTemplateById } from '@/modules/forms/data'
import { PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCategoryColor, getStatusColor } from '@/modules/forms/utils'
import {
	Edit,
	Download,
	Calendar as CalendarIcon,
	Hash,
	FileText,
	ListChecks,
	Info,
	BarChart2,
} from 'lucide-react'

export default function FormTemplateDetailsPage({
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
		{ label: template.name },
	]

	return (
		<PageHeader
			title={template.name}
			description="Thông tin chi tiết về biểu mẫu"
			breadcrumbs={breadcrumbs}
			actions={
				<div className="flex space-x-2">
					<Button
						variant="outline"
						onClick={() =>
							router.push(`/documents/forms/${template.id}/edit`)
						}
					>
						<Edit className="mr-2 h-4 w-4" />
						Chỉnh sửa
					</Button>
					<Button>
						<Download className="mr-2 h-4 w-4" />
						Tải xuống ({template.format})
					</Button>
				</div>
			}
		>
			<div className="grid md:grid-cols-3 gap-6">
				{/* Main Content */}
				<div className="md:col-span-2 space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Mô tả chi tiết</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">{template.description}</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Các trường thông tin bắt buộc</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="list-disc list-inside space-y-2">
								{template.requiredFields.map((field, index) => (
									<li key={index}>{field}</li>
								))}
							</ul>
						</CardContent>
					</Card>
				</div>

				{/* Sidebar Info */}
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Thông tin chung</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center">
								<Hash className="w-5 h-5 mr-3 text-muted-foreground" />
								<div>
									<p className="text-sm text-muted-foreground">Mã biểu mẫu</p>
									<p className="font-medium">{template.id}</p>
								</div>
							</div>
							<div className="flex items-center">
								<Info className="w-5 h-5 mr-3 text-muted-foreground" />
								<div>
									<p className="text-sm text-muted-foreground">Phiên bản</p>
									<p className="font-medium">{template.version}</p>
								</div>
							</div>
							<div className="flex items-center">
								<CalendarIcon className="w-5 h-5 mr-3 text-muted-foreground" />
								<div>
									<p className="text-sm text-muted-foreground">
										Cập nhật lần cuối
									</p>
									<p className="font-medium">{template.lastUpdated}</p>
								</div>
							</div>
							<div className="flex items-center">
								<FileText className="w-5 h-5 mr-3 text-muted-foreground" />
								<div>
									<p className="text-sm text-muted-foreground">
										Định dạng & Kích thước
									</p>
									<p className="font-medium">
										{template.format} ({template.fileSize})
									</p>
								</div>
							</div>
							<div className="flex items-center">
								<ListChecks className="w-5 h-5 mr-3 text-muted-foreground" />
								<div>
									<p className="text-sm text-muted-foreground">Trạng thái</p>
									<Badge className={getStatusColor(template.status)}>
										{template.status === 'ACTIVE'
											? 'Đang hoạt động'
											: 'Lưu trữ'}
									</Badge>
								</div>
							</div>
							<div className="flex items-center">
								<ListChecks className="w-5 h-5 mr-3 text-muted-foreground" />
								<div>
									<p className="text-sm text-muted-foreground">Phân loại</p>
									<Badge className={getCategoryColor(template.category)}>
										{template.category === 'THESIS'
											? 'Khóa luận'
											: 'Thực tập'}
									</Badge>
								</div>
							</div>
							<div className="flex items-center">
								<BarChart2 className="w-5 h-5 mr-3 text-muted-foreground" />
								<div>
									<p className="text-sm text-muted-foreground">
										Lượt tải xuống
									</p>
									<p className="font-medium">{template.downloadCount}</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</PageHeader>
	)
} 