'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  TrendingUp,
  MessageSquare,
  Upload,
  Eye,
  Edit
} from 'lucide-react'
import { PageHeader } from '@/components/common'
import { thesesProgress } from '@/modules/thesis/data'

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ON_TRACK': return 'bg-green-100 text-green-800'
    case 'DELAYED': return 'bg-red-100 text-red-800'
    case 'AT_RISK': return 'bg-yellow-100 text-yellow-800'
    case 'COMPLETED': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getMilestoneStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED': return 'text-green-600'
    case 'IN_PROGRESS': return 'text-blue-600'
    case 'PENDING': return 'text-gray-400'
    case 'OVERDUE': return 'text-red-600'
    default: return 'text-gray-400'
  }
}

const getMilestoneIcon = (status: string) => {
  switch (status) {
    case 'COMPLETED': return <CheckCircle2 className="h-5 w-5 text-green-600" />
    case 'IN_PROGRESS': return <Clock className="h-5 w-5 text-blue-600" />
    case 'OVERDUE': return <AlertTriangle className="h-5 w-5 text-red-600" />
    default:
      return <Clock className="h-5 w-5 text-gray-400" />
  }
}

/*
const getPhaseText = (phase: string) => {
	switch (phase) {
		case 'RESEARCH':
			return 'Nghiên cứu'
		case 'DESIGN':
			return 'Thiết kế'
		case 'IMPLEMENTATION':
			return 'Lập trình'
		case 'TESTING':
			return 'Kiểm thử'
		case 'DOCUMENTATION':
			return 'Báo cáo'
		case 'DEFENSE':
			return 'Bảo vệ'
		default:
			return phase
	}
}
*/

export default function ThesisProgressPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [selectedThesisId, setSelectedThesisId] = useState<string | null>(
    thesesProgress[0]?.id || null
  )

  const filteredTheses = thesesProgress.filter(thesis => {
    const matchesSearch = thesis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         thesis.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         thesis.student.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'ALL' || thesis.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const selectedThesisData = selectedThesisId
    ? thesesProgress.find(t => t.id === selectedThesisId)
    : null

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Khóa luận', href: '/thesis' },
		{ label: 'Tiến độ' },
	]

  return (
		<PageHeader
			title="Tiến độ Khóa luận"
			description="Theo dõi và quản lý tiến độ thực hiện khóa luận"
			breadcrumbs={breadcrumbs}
			actions={
				<div className="flex gap-2">
					<Button variant="outline">
						<Upload className="h-4 w-4 mr-2" />
						Import dữ liệu
					</Button>
					<Button>
						<FileText className="h-4 w-4 mr-2" />
						Báo cáo tiến độ
					</Button>
				</div>
			}
		>
			<div className="space-y-6">
				{/* Statistics Cards */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Tổng khóa luận</CardTitle>
							<FileText className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{thesesProgress.length}</div>
							<p className="text-xs text-muted-foreground">
								Đang theo dõi
							</p>
						</CardContent>
					</Card>
					
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Đúng tiến độ</CardTitle>
							<CheckCircle2 className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{thesesProgress.filter(t => t.status === 'ON_TRACK').length}
							</div>
							<p className="text-xs text-muted-foreground">
								{Math.round((thesesProgress.filter(t => t.status === 'ON_TRACK').length / thesesProgress.length) * 100)}% tổng số
							</p>
						</CardContent>
					</Card>
					
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Chậm tiến độ</CardTitle>
							<AlertTriangle className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{thesesProgress.filter(t => t.status === 'DELAYED').length}
							</div>
							<p className="text-xs text-muted-foreground">
								Cần can thiệp
							</p>
						</CardContent>
					</Card>
					
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Tiến độ trung bình</CardTitle>
							<TrendingUp className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{Math.round(thesesProgress.reduce((sum, t) => sum + t.overallProgress, 0) / thesesProgress.length)}%
							</div>
							<p className="text-xs text-muted-foreground">
								Tất cả khóa luận
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Main Content */}
				<div className="grid gap-6 lg:grid-cols-12">
					{/* Theses List */}
					<div className="lg:col-span-4 space-y-4">
						<div className="flex gap-2">
							<Input
								placeholder="Tìm khóa luận..."
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
								className="flex-1"
							/>
							<Select
								value={selectedStatus}
								onValueChange={setSelectedStatus}
							>
								<SelectTrigger className="w-[150px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ALL">Tất cả</SelectItem>
									<SelectItem value="ON_TRACK">Đúng tiến độ</SelectItem>
									<SelectItem value="DELAYED">Chậm tiến độ</SelectItem>
									<SelectItem value="AT_RISK">Rủi ro</SelectItem>
									<SelectItem value="COMPLETED">Hoàn thành</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
							{filteredTheses.map(thesis => (
								<Card
									key={thesis.id}
									className={`cursor-pointer transition-all ${
										selectedThesisId === thesis.id
											? 'border-primary ring-2 ring-primary'
											: 'hover:bg-accent'
									}`}
									onClick={() => setSelectedThesisId(thesis.id)}
								>
									<CardContent className="p-3">
										<div className="flex items-start">
											<div className="flex-1">
												<p className="font-semibold text-sm">
													{thesis.title}
												</p>
												<p className="text-xs text-muted-foreground">
													{thesis.student.name} - {thesis.student.code}
												</p>
											</div>
											<Badge
												className={`ml-2 text-xs ${getStatusColor(
													thesis.status
												)}`}
											>
												{thesis.status === 'ON_TRACK' && 'Đúng hạn'}
												{thesis.status === 'DELAYED' && 'Trễ hạn'}
												{thesis.status === 'AT_RISK' && 'Rủi ro'}
												{thesis.status === 'COMPLETED' && 'Hoàn thành'}
											</Badge>
										</div>
										<Progress
											value={thesis.overallProgress}
											className="mt-2 h-2"
										/>
									</CardContent>
								</Card>
							))}
						</div>
					</div>

					{/* Thesis Details */}
					<div className="lg:col-span-8">
						{selectedThesisData ? (
							<Card className="h-full">
								<CardHeader>
									<div className="flex justify-between items-start">
										<div>
											<CardTitle className="text-xl">
												{selectedThesisData.title}
											</CardTitle>
											<CardDescription>
												Sinh viên: {selectedThesisData.student.name} |
												GVHD: {selectedThesisData.supervisor}
											</CardDescription>
										</div>
										<Button variant="outline" size="sm">
											<Edit className="mr-2 h-4 w-4" />
											Cập nhật tiến độ
										</Button>
									</div>
								</CardHeader>
								<CardContent>
									<Tabs defaultValue="milestones">
										<TabsList>
											<TabsTrigger value="milestones">Cột mốc</TabsTrigger>
											<TabsTrigger value="meetings">Lịch họp</TabsTrigger>
											<TabsTrigger value="documents">Tài liệu</TabsTrigger>
										</TabsList>

										<TabsContent value="milestones" className="mt-4">
											<div className="space-y-4">
												{selectedThesisData.milestones.map(milestone => (
													<div
														key={milestone.id}
														className="flex items-center"
													>
														<div className="mr-4">
															{getMilestoneIcon(milestone.status)}
														</div>
														<div className="flex-1">
															<p
																className={`font-medium ${getMilestoneStatusColor(
																	milestone.status
																)}`}
															>
																{milestone.title}
															</p>
															<p className="text-xs text-muted-foreground">
																Hạn: {milestone.dueDate} | Hoàn
																thành:{' '}
																{milestone.completedDate || 'N/A'}
															</p>
														</div>
													</div>
												))}
											</div>
										</TabsContent>

										<TabsContent value="meetings" className="mt-4">
											<div className="space-y-3">
												{selectedThesisData.meetings.map((meeting, idx) => (
													<div key={idx} className="flex items-start">
														<MessageSquare className="h-4 w-4 mt-1 mr-3 text-muted-foreground" />
														<div className="flex-1">
															<p className="font-semibold text-sm">
																{meeting.topic}
															</p>
															<p className="text-xs text-muted-foreground">
																{meeting.date}
															</p>
															<p className="text-sm mt-1">
																{meeting.notes}
															</p>
														</div>
													</div>
												))}
											</div>
										</TabsContent>

										<TabsContent value="documents" className="mt-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												{selectedThesisData.documents.map(doc => (
													<Card key={doc.name} className="p-3">
														<div className="flex items-center justify-between">
															<div className="flex items-center">
																<FileText className="h-6 w-6 mr-3 text-muted-foreground" />
																<div>
																	<p className="font-semibold text-sm">
																		{doc.name}
																	</p>
																	<p className="text-xs text-muted-foreground">
																		{doc.uploadDate} - {doc.type}
																	</p>
																</div>
															</div>
															<Button variant="ghost" size="icon">
																<Eye className="h-4 w-4" />
															</Button>
														</div>
													</Card>
												))}
											</div>
										</TabsContent>
									</Tabs>
								</CardContent>
							</Card>
						) : (
							<div className="flex items-center justify-center h-full rounded-lg border-2 border-dashed">
								<p className="text-muted-foreground">
									Chọn một khóa luận để xem chi tiết
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</PageHeader>
	)
} 