'use client'

import { notFound, useRouter } from 'next/navigation'
import { findGuidelineById } from '@/modules/guidelines/data'
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

export default function GuidelineEditPage({
	params,
}: {
	params: { id: string }
}) {
	const router = useRouter()
	const guideline = findGuidelineById(params.id)

	if (!guideline) {
		notFound()
	}

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Hướng dẫn & Quy định', href: '/documents/guidelines' },
		{ label: guideline.title, href: `/documents/guidelines/${guideline.id}` },
		{ label: 'Chỉnh sửa' },
	]

	return (
		<PageHeader
			title="Chỉnh sửa Tài liệu"
			description={`Cập nhật thông tin cho "${guideline.title}"`}
			breadcrumbs={breadcrumbs}
		>
			<Card>
				<CardHeader>
					<CardTitle>Thông tin Tài liệu</CardTitle>
					<CardDescription>
						Chỉnh sửa các thông tin dưới đây. Nhấn lưu để cập nhật.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-4">
						<div className="space-y-2">
							<Label>Tiêu đề</Label>
							<Input defaultValue={guideline.title} />
						</div>

						<div className="space-y-2">
							<Label>Mô tả</Label>
							<Textarea
								defaultValue={guideline.description}
								className="min-h-[120px]"
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="space-y-2">
								<Label>Phiên bản</Label>
								<Input defaultValue={guideline.version} />
							</div>
							<div className="space-y-2">
								<Label>Tác giả</Label>
								<Input defaultValue={guideline.author} />
							</div>
							<div className="space-y-2">
								<Label>Phân loại</Label>
								<Select defaultValue={guideline.category}>
									<SelectTrigger>
										<SelectValue />
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
							<Label>Tệp đính kèm (Để trống nếu không thay đổi)</Label>
							<div className="flex items-center space-x-2">
								<Input type="file" className="flex-1" />
								<Button variant="outline">
									<Upload className="mr-2 h-4 w-4" />
									Tải lên
								</Button>
							</div>
							<p className="text-sm text-muted-foreground">
								Tệp hiện tại: {guideline.contentUrl}
							</p>
						</div>

						<div className="space-y-2">
							<Label>Tags (cách nhau bởi dấu phẩy)</Label>
							<Input defaultValue={guideline.tags.join(', ')} />
						</div>

						<div className="space-y-2">
							<Label>Tài liệu liên quan (ID cách nhau bởi dấu phẩy)</Label>
							<Input defaultValue={guideline.relatedDocs.join(', ')} />
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