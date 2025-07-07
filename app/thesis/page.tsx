'use client'

import { useCallback, useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

import { DataTable } from '@/components/common/data-table'
import { getColumns } from './columns'
import { Thesis } from '@/modules/thesis/types'
import {
	createThesis,
	deleteThesis,
	getTheses,
	updateThesis,
	type CreateThesisData,
} from '@/lib/api/theses.api'
import { StudentsApi } from '@/lib/api/students.api'
import { Student } from '@/modules/academic/types'
import { AcademicYear, Semester } from '@/modules/config/types'
import { AcademicYearsApi } from '@/lib/api/academic-years.api'
import { SemestersApi } from '@/lib/api/semesters.api'

// Main Page Component
export default function ThesesPage() {
	const [theses, setTheses] = useState<Thesis[]>([])
	const [students, setStudents] = useState<Student[]>([])
	const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
	const [semesters, setSemesters] = useState<Semester[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isSheetOpen, setSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false)
	const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null)
	const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')
	const { toast } = useToast()

	// Fetch data from API
	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true)
			const [thesesData, studentsData, academicYearsData, semestersData] = await Promise.all([
				getTheses(),
				StudentsApi.getAll(),
				AcademicYearsApi.getAll(),
				SemestersApi.getAll(),
			])
			
			setTheses(Array.isArray(thesesData) ? thesesData : [])
			setStudents(Array.isArray(studentsData) ? studentsData : [])
			setAcademicYears(Array.isArray(academicYearsData) ? academicYearsData : [])
			setSemesters(Array.isArray(semestersData) ? semestersData : [])
		} catch (error: unknown) {
			console.error('Failed to fetch data:', error)
			// Ensure states remain as empty arrays on error
			setTheses([])
			setStudents([])
			setAcademicYears([])
			setSemesters([])
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể tải dữ liệu.',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}, [toast])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const handleCreate = async (data: CreateThesisData) => {
		try {
			setIsLoading(true)
			await createThesis(data)
			toast({
				title: 'Thành công',
				description: 'Khóa luận đã được tạo thành công.',
			})
			fetchData()
			setSheetOpen(false)
		} catch (error: unknown) {
			console.error('Failed to create thesis:', error)
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể tạo khóa luận.',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleUpdate = async (data: CreateThesisData) => {
		if (!selectedThesis) return
		try {
			await updateThesis(selectedThesis.id, data)
			toast({
				title: 'Thành công',
				description: 'Khóa luận đã được cập nhật thành công.',
			})
			fetchData()
			setSheetOpen(false)
			setSelectedThesis(null)
		} catch (error: unknown) {
			console.error('Failed to update thesis:', error)
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể cập nhật khóa luận.',
				variant: 'destructive',
			})
		}
	}

	const handleDelete = async () => {
		if (!selectedThesis) return
		try {
			await deleteThesis(selectedThesis.id)
			toast({
				title: 'Thành công',
				description: 'Khóa luận đã được xóa thành công.',
			})
			fetchData()
			setDeleteDialogOpen(false)
			setSelectedThesis(null)
		} catch (error: unknown) {
			console.error('Failed to delete thesis:', error)
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể xóa khóa luận.',
				variant: 'destructive',
			})
		}
	}

	const openSheet = (mode: 'create' | 'edit', thesis?: Thesis) => {
		setSheetMode(mode)
		setSelectedThesis(thesis || null)
		setSheetOpen(true)
	}

	const openDeleteDialog = (thesis: Thesis) => {
		setSelectedThesis(thesis)
		setDeleteDialogOpen(true)
	}

	const openDetailsDialog = (thesis: Thesis) => {
		setSelectedThesis(thesis)
		setDetailsDialogOpen(true)
	}

	const dynamicColumns = getColumns({
		onView: openDetailsDialog,
		onEdit: (thesis) => openSheet('edit', thesis),
		onDelete: openDeleteDialog,
	})

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Khóa luận' },
	]

	return (
		<>
			<PageHeader
				title="Quản lý Khóa luận"
				description="Quản lý danh sách các khóa luận tốt nghiệp của sinh viên."
				breadcrumbs={breadcrumbs}
				actions={
					<Button onClick={() => openSheet('create')}>
						<Plus className="h-4 w-4 mr-2" />
						Thêm khóa luận
					</Button>
				}
			>
				<DataTable
					columns={dynamicColumns}
					data={theses}
					isLoading={isLoading}
					searchableColumn="title"
					searchPlaceholder="Tìm theo tên đề tài..."
				/>
			</PageHeader>

			{/* Create/Edit Sheet */}
			<Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
				<SheetContent className="sm:max-w-lg">
					<SheetHeader>
						<SheetTitle>{sheetMode === 'create' ? 'Thêm khóa luận mới' : 'Chỉnh sửa khóa luận'}</SheetTitle>
						<SheetDescription>
							{sheetMode === 'create' ? 'Điền thông tin để thêm một khóa luận mới.' : 'Cập nhật thông tin cho khóa luận đã chọn.'}
						</SheetDescription>
					</SheetHeader>
					<ThesisForm
						thesis={sheetMode === 'edit' ? selectedThesis : null}
						students={students}
						academicYears={academicYears}
						semesters={semesters}
						onSave={sheetMode === 'create' ? handleCreate : handleUpdate}
						onCancel={() => setSheetOpen(false)}
					/>
				</SheetContent>
			</Sheet>

			{/* Thesis Details Dialog */}
			<ThesisDetails
				thesis={selectedThesis}
				isOpen={isDetailsDialogOpen}
				onClose={() => {
					setDetailsDialogOpen(false)
					setSelectedThesis(null)
				}}
			/>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
						<AlertDialogDescription>
							Thao tác này không thể hoàn tác. Khóa luận &quot;{selectedThesis?.title}&quot; sẽ bị xóa vĩnh viễn khỏi hệ thống.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}

// Form Component
const ThesisForm = ({
	thesis,
	students,
	academicYears,
	semesters,
	onSave,
	onCancel,
}: {
	thesis?: Thesis | null
	students: Student[]
	academicYears: AcademicYear[]
	semesters: Semester[]
	onSave: (data: CreateThesisData) => void
	onCancel: () => void
}) => {
	const [formData, setFormData] = useState<CreateThesisData>({
		title: thesis?.title || '',
		studentId: thesis?.studentId || 0,
		academicYearId: thesis?.academicYearId || 0,
		semesterId: thesis?.semesterId || 0,
		submissionDate: thesis?.submissionDate || '',
	})
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [filteredSemesters, setFilteredSemesters] = useState<Semester[]>(semesters)

	// Filter semesters when academic year changes
	useEffect(() => {
		if (formData.academicYearId) {
			const yearSemesters = semesters.filter(s => s.academicYearId === formData.academicYearId)
			setFilteredSemesters(yearSemesters)
			
			// Only update semester if current one is not valid for the selected year
			if (yearSemesters.length > 0 && !yearSemesters.some(s => s.id === formData.semesterId)) {
				setFormData(prev => ({
					...prev,
					semesterId: yearSemesters[0].id
				}))
			}
		}
	}, [formData.academicYearId, semesters])

	// Initialize form data when component mounts and data is available
	useEffect(() => {
		if (thesis) {
			// For edit mode, use thesis data
			setFormData({
				title: thesis.title,
				studentId: thesis.studentId,
				academicYearId: thesis.academicYearId,
				semesterId: thesis.semesterId,
				submissionDate: thesis.submissionDate,
			})
		} else if (students.length > 0 && academicYears.length > 0 && semesters.length > 0 && formData.studentId === 0) {
			// For create mode, set defaults only once when all data is loaded
			const defaultAcademicYear = academicYears[0]
			const defaultSemesters = semesters.filter(s => s.academicYearId === defaultAcademicYear.id)
			
			setFormData({
				title: '',
				studentId: students[0].id,
				academicYearId: defaultAcademicYear.id,
				semesterId: defaultSemesters.length > 0 ? defaultSemesters[0].id : 0,
				submissionDate: '',
			})
		}
	}, [thesis, students, academicYears, semesters])

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {}

		if (!formData.title.trim()) {
			newErrors.title = 'Vui lòng nhập tiêu đề khóa luận'
		}

		if (formData.studentId <= 0) {
			newErrors.studentId = 'Vui lòng chọn sinh viên'
		}

		if (formData.academicYearId <= 0) {
			newErrors.academicYearId = 'Vui lòng chọn năm học'
		}

		if (formData.semesterId <= 0) {
			newErrors.semesterId = 'Vui lòng chọn học kỳ'
		}

		if (!formData.submissionDate) {
			newErrors.submissionDate = 'Vui lòng chọn hạn nộp'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }))
		}
	}

	const handleSelectChange = (name: string, value: string) => {
		const numValue = parseInt(value)
		setFormData(prev => ({ ...prev, [name]: numValue }))
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }))
		}
	}

	const handleFormSave = () => {
		if (validateForm()) {
			onSave(formData)
		}
	}

	return (
		<div className="space-y-4 p-4">
			<div className="space-y-2">
				<Label htmlFor="title">Tiêu đề khóa luận</Label>
				<Input
					id="title"
					name="title"
					value={formData.title}
					onChange={handleChange}
					placeholder="Nhập tiêu đề khóa luận"
					className={errors.title ? 'border-red-500' : ''}
				/>
				{errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="studentId">Sinh viên</Label>
				<Select
					value={formData.studentId > 0 ? formData.studentId.toString() : ''}
					onValueChange={(value) => handleSelectChange('studentId', value)}
				>
					<SelectTrigger className={`w-full ${errors.studentId ? 'border-red-500' : ''}`}>
						<SelectValue placeholder="Chọn sinh viên" />
					</SelectTrigger>
					<SelectContent>
						{students.map((student) => (
							<SelectItem key={student.id} value={student.id.toString()}>
								{student.fullName} ({student.email})
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{errors.studentId && <p className="text-sm text-red-500">{errors.studentId}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="academicYearId">Năm học</Label>
				<Select
					value={formData.academicYearId > 0 ? formData.academicYearId.toString() : ''}
					onValueChange={(value) => handleSelectChange('academicYearId', value)}
				>
					<SelectTrigger className={`w-full ${errors.academicYearId ? 'border-red-500' : ''}`}>
						<SelectValue placeholder="Chọn năm học" />
					</SelectTrigger>
					<SelectContent>
						{academicYears.map((year) => (
							<SelectItem key={year.id} value={year.id.toString()}>
								{year.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{errors.academicYearId && <p className="text-sm text-red-500">{errors.academicYearId}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="semesterId">Học kỳ</Label>
				<Select
					value={formData.semesterId > 0 ? formData.semesterId.toString() : ''}
					onValueChange={(value) => handleSelectChange('semesterId', value)}
				>
					<SelectTrigger className={`w-full ${errors.semesterId ? 'border-red-500' : ''}`}>
						<SelectValue placeholder="Chọn học kỳ" />
					</SelectTrigger>
					<SelectContent>
						{filteredSemesters.length > 0 ? (
							filteredSemesters.map((semester) => (
								<SelectItem key={semester.id} value={semester.id.toString()}>
									{semester.name}
								</SelectItem>
							))
						) : (
							<SelectItem value="0" disabled>
								Không có học kỳ nào cho năm học này
							</SelectItem>
						)}
					</SelectContent>
				</Select>
				{errors.semesterId && <p className="text-sm text-red-500">{errors.semesterId}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="submissionDate">Hạn nộp</Label>
				<Input
					id="submissionDate"
					name="submissionDate"
					type="date"
					value={formData.submissionDate}
					onChange={handleChange}
					className={errors.submissionDate ? 'border-red-500' : ''}
				/>
				{errors.submissionDate && <p className="text-sm text-red-500">{errors.submissionDate}</p>}
			</div>

			<SheetFooter className="pt-4">
				<Button variant="outline" onClick={onCancel}>Hủy</Button>
				<Button onClick={handleFormSave}>Lưu thay đổi</Button>
			</SheetFooter>
		</div>
	)
}

const ThesisDetails = ({
	thesis,
	isOpen,
	onClose,
}: {
	thesis: Thesis | null
	isOpen: boolean
	onClose: () => void
}) => {
	if (!thesis) return null

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Chi tiết khóa luận</DialogTitle>
					<DialogDescription>
						Thông tin chi tiết về khóa luận
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label className="text-sm font-medium text-gray-500">ID</Label>
						<div className="text-sm">{thesis.id}</div>
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-medium text-gray-500">Tiêu đề</Label>
						<div className="text-sm font-medium">{thesis.title}</div>
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-medium text-gray-500">Sinh viên</Label>
						<div className="text-sm">{thesis.student?.fullName}</div>
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-medium text-gray-500">Năm học</Label>
						<div className="text-sm">{thesis.academicYear?.name}</div>
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-medium text-gray-500">Học kỳ</Label>
						<div className="text-sm">{thesis.semester?.name}</div>
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-medium text-gray-500">Hạn nộp</Label>
						<div className="text-sm">{thesis.submissionDate}</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
} 