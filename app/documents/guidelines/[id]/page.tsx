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
import { Badge } from '@/components/ui/badge'
import { getCategoryColor, getCategoryText } from '@/modules/guidelines/utils'
import {
	Edit,
	Download,
	Calendar,
	User,
	Hash,
	Info,
	BookOpen,
} from 'lucide-react'

export default function GuidelineDetailsPage({
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
		{ label: guideline.title },
	]

	return (
		<PageHeader
			title={guideline.title}
			description="Thông tin chi tiết về tài liệu hướng dẫn"
			breadcrumbs={breadcrumbs}
			actions={
				<div className="flex space-x-2">
					<Button
						variant="outline"
						onClick={() =>
							router.push(`/documents/guidelines/${guideline.id}/edit`)
						}
					>
						<Edit className="mr-2 h-4 w-4" />
						Chỉnh sửa
					</Button>
					<Button>
						<Download className="mr-2 h-4 w-4" />
						Tải về
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
							<p className="text-muted-foreground">{guideline.description}</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Tài liệu liên quan</CardTitle>
							<CardDescription>
								Các biểu mẫu hoặc tài liệu khác được đề cập.
							</CardDescription>
						</CardHeader>
						<CardContent>
							{guideline.relatedDocs.length > 0 ? (
								<ul className="list-disc list-inside space-y-2">
									{guideline.relatedDocs.map((docId, index) => (
										<li key={index} className="text-blue-600 hover:underline">
											<a href={`/documents/forms/${docId}`}>{docId}</a>
										</li>
									))}
								</ul>
							) : (
								<p className="text-muted-foreground">
									Không có tài liệu liên quan.
								</p>
							)}
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
									<p className="text-sm text-muted-foreground">Mã tài liệu</p>
									<p className="font-medium">{guideline.id}</p>
								</div>
							</div>
							<div className="flex items-center">
								<Info className="w-5 h-5 mr-3 text-muted-foreground" />
								<div>
									<p className="text-sm text-muted-foreground">Phiên bản</p>
									<p className="font-medium">{guideline.version}</p>
								</div>
							</div>
							<div className="flex items-center">
								<Calendar className="w-5 h-5 mr-3 text-muted-foreground" />
								<div>
									<p className="text-sm text-muted-foreground">
										Cập nhật lần cuối
									</p>
									<p className="font-medium">{guideline.lastUpdated}</p>
								</div>
							</div>
							<div className="flex items-center">
								<User className="w-5 h-5 mr-3 text-muted-foreground" />
								<div>
									<p className="text-sm text-muted-foreground">Tác giả</p>
									<p className="font-medium">{guideline.author}</p>
								</div>
							</div>
							<div className="flex items-center">
								<BookOpen className="w-5 h-5 mr-3 text-muted-foreground" />
								<div>
									<p className="text-sm text-muted-foreground">Phân loại</p>
									<Badge className={getCategoryColor(guideline.category)}>
										{getCategoryText(guideline.category)}
									</Badge>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Tags</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-wrap gap-2">
							{guideline.tags.map((tag, index) => (
								<Badge key={index} variant="secondary">
									{tag}
								</Badge>
							))}
						</CardContent>
					</Card>
				</div>
			</div>
		</PageHeader>
	)
} 