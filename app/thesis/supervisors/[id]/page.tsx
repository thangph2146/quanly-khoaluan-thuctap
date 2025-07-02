'use client'

import { notFound, useRouter } from 'next/navigation'
import { findSupervisorById, thesisData } from '@/modules/thesis/data'
import { PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	Mail,
	Phone,
	Building,
	Briefcase,
	Lightbulb,
	ArrowLeft,
	GraduationCap,
} from 'lucide-react'
import { Thesis } from '@/modules/thesis/types'
import Link from 'next/link'

export default function SupervisorDetailsPage({
	params,
}: {
	params: { id: string }
}) {
	const router = useRouter()
	const supervisor = findSupervisorById(params.id)

	if (!supervisor) {
		notFound()
	}

	const supervisedTheses: Thesis[] = thesisData.filter(
		t => t.supervisor === supervisor.name
	)

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Quản lý Khóa luận', href: '/thesis' },
		{ label: 'Đăng ký Khóa luận', href: '/thesis/register' },
		{ label: supervisor.name },
	]

	return (
		<PageHeader
			title={supervisor.name}
			description={`Thông tin chi tiết về giảng viên hướng dẫn`}
			breadcrumbs={breadcrumbs}
			actions={
				<Button variant="outline" onClick={() => router.back()}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Quay lại
				</Button>
			}
		>
			<div className="grid md:grid-cols-3 gap-6">
				{/* Sidebar Info */}
				<div className="md:col-span-1 space-y-6">
					<Card>
						<CardContent className="pt-6 flex flex-col items-center space-y-4">
							<Avatar className="h-24 w-24">
								<AvatarImage
									src={supervisor.avatar}
									alt={supervisor.name}
								/>
								<AvatarFallback>{supervisor.name.charAt(0)}</AvatarFallback>
							</Avatar>
							<div className="text-center">
								<h2 className="text-2xl font-bold">{supervisor.name}</h2>
								<p className="text-muted-foreground">
									{supervisor.department}
								</p>
							</div>
							<Badge
								variant={
									supervisor.currentTheses < supervisor.maxTheses
										? 'default'
										: 'secondary'
								}
							>
								Đang hướng dẫn: {supervisor.currentTheses}/
								{supervisor.maxTheses}
							</Badge>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Thông tin liên hệ</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center">
								<Mail className="w-5 h-5 mr-3 text-muted-foreground" />
								<div>
									<p className="text-sm text-muted-foreground">Email</p>
									<p className="font-medium">email.gv@university.edu</p>
								</div>
							</div>
							<div className="flex items-center">
								<Phone className="w-5 h-5 mr-3 text-muted-foreground" />
								<div>
									<p className="text-sm text-muted-foreground">Điện thoại</p>
									<p className="font-medium">(+84) 123 456 789</p>
								</div>
							</div>
							<div className="flex items-center">
								<Building className="w-5 h-5 mr-3 text-muted-foreground" />
								<div>
									<p className="text-sm text-muted-foreground">Văn phòng</p>
									<p className="font-medium">
										Phòng A1-101, Tòa nhà trung tâm
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Main Content */}
				<div className="md:col-span-2 space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Briefcase className="mr-2 h-5 w-5" />
								Chuyên môn
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">
								{supervisor.specialization}
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Lightbulb className="mr-2 h-5 w-5" />
								Lĩnh vực nghiên cứu
							</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-wrap gap-2">
							{supervisor.researchAreas.map((area, index) => (
								<Badge key={index} variant="secondary">
									{area}
								</Badge>
							))}
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<GraduationCap className="mr-2 h-5 w-5" />
								Các khóa luận đang hướng dẫn ({supervisedTheses.length})
							</CardTitle>
						</CardHeader>
						<CardContent>
							{supervisedTheses.length > 0 ? (
								<ul className="space-y-2">
									{supervisedTheses.map(thesis => (
										<li
											key={thesis.id}
											className="flex items-center justify-between text-sm p-3 border rounded-md"
										>
											<div>
												<Link
													href={`/thesis/${thesis.id}`}
													className="font-medium hover:underline"
												>
													{thesis.title}
												</Link>
												<p className="text-muted-foreground">
													SV: {thesis.student} ({thesis.studentId})
												</p>
											</div>
											<Badge variant="outline">{thesis.semester}</Badge>
										</li>
									))}
								</ul>
							) : (
								<p className="text-muted-foreground text-center py-4">
									Chưa có khóa luận nào.
								</p>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</PageHeader>
	)
} 