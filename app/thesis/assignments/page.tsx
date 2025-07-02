'use client'

import { useState } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
	User,
	Calendar,
	Clock,
	CheckCircle2,
	AlertCircle,
	FileText,
	Download,
	Search,
	Plus,
	Edit,
	Trash2,
} from 'lucide-react'
import { PageHeader } from '@/components/common'
import { thesisAssignments } from '@/modules/thesis/data'
import { ThesisAssignment } from '@/modules/thesis/types'
import { useRouter } from 'next/navigation'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import Link from 'next/link'

export default function AssignmentsPage() {
	const router = useRouter()
	const [searchTerm, setSearchTerm] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')
	const [selectedAssignment, setSelectedAssignment] =
		useState<ThesisAssignment | null>(null)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [assignmentToDelete, setAssignmentToDelete] =
		useState<ThesisAssignment | null>(null)

	const filteredAssignments = thesisAssignments.filter(assignment => {
		const matchesSearch =
			assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			assignment.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			assignment.category.toLowerCase().includes(searchTerm.toLowerCase())
		const matchesStatus =
			statusFilter === 'all' || assignment.status === statusFilter
		return matchesSearch && matchesStatus
	})

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Hoàn thành':
				return 'bg-green-100 text-green-800'
			case 'Đang thực hiện':
				return 'bg-blue-100 text-blue-800'
			case 'Chờ review':
				return 'bg-yellow-100 text-yellow-800'
			case 'Quá hạn':
				return 'bg-red-100 text-red-800'
			default:
				return 'bg-gray-100 text-gray-800'
		}
	}

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'Cao':
				return 'bg-red-100 text-red-800'
			case 'Trung bình':
				return 'bg-yellow-100 text-yellow-800'
			case 'Thấp':
				return 'bg-green-100 text-green-800'
			default:
				return 'bg-gray-100 text-gray-800'
		}
	}

	const getCategoryColor = (category: string) => {
		switch (category) {
			case 'Nghiên cứu':
				return 'bg-blue-100 text-blue-800'
			case 'Thiết kế':
				return 'bg-purple-100 text-purple-800'
			case 'Lập trình':
				return 'bg-green-100 text-green-800'
			case 'Báo cáo':
				return 'bg-orange-100 text-orange-800'
			default:
				return 'bg-gray-100 text-gray-800'
		}
	}

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Khóa luận', href: '/thesis' },
		{ label: 'Phân công nhiệm vụ' },
	]

	const handleDeleteClick = (assignment: ThesisAssignment) => {
		setAssignmentToDelete(assignment)
		setIsDeleteDialogOpen(true)
	}

	const handleDeleteConfirm = () => {
		if (assignmentToDelete) {
			// In a real app, you'd call an API here.
			// For this mock, we'll just log and close.
			console.log('Deleting assignment:', assignmentToDelete.id)
			setAssignmentToDelete(null)
			setIsDeleteDialogOpen(false)
			setSelectedAssignment(null) // Close the details pane
		}
	}

	return (
		<PageHeader
			title="Phân công nhiệm vụ"
			description="Quản lý và theo dõi các nhiệm vụ được giao cho sinh viên làm khóa luận"
			breadcrumbs={breadcrumbs}
			actions={
				<div className="flex space-x-2">
					<Button variant="outline">
						<Download className="mr-2 h-4 w-4" />
						Xuất báo cáo
					</Button>
					<Button onClick={() => router.push('/thesis/assignments/new')}>
						<Plus className="mr-2 h-4 w-4" />
						Tạo nhiệm vụ mới
					</Button>
				</div>
			}
		>
			<div className="space-y-6">
				{/* Stats Cards */}
				<div className="grid gap-4 md:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Tổng nhiệm vụ</CardTitle>
							<FileText className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{thesisAssignments.length}
							</div>
							<p className="text-xs text-muted-foreground">Đang theo dõi</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
							<CheckCircle2 className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{
									thesisAssignments.filter(a => a.status === 'Hoàn thành')
										.length
								}
							</div>
							<p className="text-xs text-muted-foreground">Đã hoàn thành</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Đang thực hiện
							</CardTitle>
							<Clock className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{
									thesisAssignments.filter(a => a.status === 'Đang thực hiện')
										.length
								}
							</div>
							<p className="text-xs text-muted-foreground">Cần theo dõi</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Quá hạn</CardTitle>
							<AlertCircle className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{
									thesisAssignments.filter(a => a.status === 'Quá hạn')
										.length
								}
							</div>
							<p className="text-xs text-muted-foreground">Cần xử lý</p>
						</CardContent>
					</Card>
				</div>

				{/* Filters */}
				<div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							placeholder="Tìm kiếm nhiệm vụ, sinh viên, danh mục..."
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
					<div className="relative">
						<select
							value={statusFilter}
							onChange={e => setStatusFilter(e.target.value)}
							className="w-full sm:w-auto appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
						>
							<option value="all">Tất cả trạng thái</option>
							<option value="Đang thực hiện">Đang thực hiện</option>
							<option value="Hoàn thành">Hoàn thành</option>
							<option value="Chờ review">Chờ review</option>
							<option value="Quá hạn">Quá hạn</option>
						</select>
					</div>
				</div>

				{/* Assignments List & Detail View */}
				<div className="grid lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2 space-y-4">
						{filteredAssignments.map(assignment => (
							<Card
								key={assignment.id}
								className={`hover:shadow-md transition-shadow cursor-pointer ${selectedAssignment?.id === assignment.id ? 'border-primary ring-2 ring-primary' : ''}`}
								onClick={() => setSelectedAssignment(assignment)}
							>
								<CardContent className="p-4">
									<div className="flex items-start justify-between">
										<div className="flex-1 space-y-2">
											<h3 className="font-semibold text-base">
												{assignment.title}
											</h3>
											<div className="flex items-center text-xs text-muted-foreground">
												<User className="mr-2 h-3 w-3" />
												{assignment.student.name}
												<Calendar className="ml-4 mr-2 h-3 w-3" />
												Hạn: {assignment.dueDate}
											</div>
											<Progress value={assignment.progress} className="h-2" />
										</div>
										<div className="flex flex-col space-y-1 items-end ml-4">
											<Badge
												className={`${getStatusColor(
													assignment.status
												)} text-xs`}
											>
												{assignment.status}
											</Badge>
											<Badge
												className={`${getPriorityColor(
													assignment.priority
												)} text-xs`}
											>
												{assignment.priority}
											</Badge>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					{/* Details Pane */}
					<div className="lg:col-span-1">
						{selectedAssignment ? (
							<Card className="sticky top-24">
								<CardHeader>
									<div className="flex justify-between items-start">
										<CardTitle className="text-lg flex-1 mr-2">
											{selectedAssignment.title}
										</CardTitle>
										<div className="flex space-x-1">
											<Button
												variant="ghost"
												size="icon"
												onClick={() =>
													router.push(
														`/thesis/assignments/${selectedAssignment.id}/edit`
													)
												}
											>
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="text-red-500 hover:text-red-600"
												onClick={() => handleDeleteClick(selectedAssignment)}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
									<CardDescription>
										GVHD: {selectedAssignment.supervisor.name}
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4 text-sm">
									<p>{selectedAssignment.description}</p>
									<div className="border-t pt-4 space-y-2">
										<p>
											<strong>Loại: </strong>
											<Badge
												className={getCategoryColor(
													selectedAssignment.category
												)}
												variant="outline"
											>
												{selectedAssignment.category}
											</Badge>
										</p>
										<p>
											<strong>Đính kèm:</strong>
										</p>
										{selectedAssignment.attachments.length > 0 ? (
											<ul className="list-disc list-inside">
												{selectedAssignment.attachments.map(file => (
													<li key={file.name}>
														<Link
															href={file.url || '#'}
															className="text-blue-600 hover:underline"
														>
															{file.name} ({file.size})
														</Link>
													</li>
												))}
											</ul>
										) : (
											<p className="text-muted-foreground">Không có tệp đính kèm.</p>
										)}
									</div>
									<Button className="w-full">Thêm nhận xét</Button>
								</CardContent>
							</Card>
						) : (
							<div className="flex flex-col items-center justify-center h-full rounded-lg border border-dashed text-center p-8 sticky top-24">
								<h3 className="text-lg font-semibold">
									Chưa chọn nhiệm vụ
								</h3>
								<p className="text-sm text-muted-foreground mt-2">
									Chọn một nhiệm vụ từ danh sách bên trái để xem chi tiết.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
						<AlertDialogDescription>
							Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh
							viễn nhiệm vụ{' '}
							<span className="font-bold">
								{assignmentToDelete?.title}
							</span>{' '}
							khỏi hệ thống.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setAssignmentToDelete(null)}>
							Hủy
						</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteConfirm}>
							Tiếp tục
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</PageHeader>
	)
} 