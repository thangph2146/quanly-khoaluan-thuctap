'use client'

import { useEffect, useState } from 'react'
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
import { Internship } from '@/modules/internship/types'
import {
	createInternship,
	deleteInternship,
	getInternships,
	updateInternship,
	type CreateInternshipData,
} from '@/lib/api/internships.api'
import { getUsers } from '@/lib/api/users.api'
import { getPartners } from '@/lib/api/partners.api'
import { AcademicYearsApi } from '@/lib/api/academic-years.api'
import { SemestersApi } from '@/lib/api/semesters.api'
import { User } from '@/modules/users/types'
import { Partner } from '@/modules/partners/types'
import { AcademicYear, Semester } from '@/modules/config/types'

// Main Page Component
export default function InternshipsPage() {
	const [internships, setInternships] = useState<Internship[]>([])
	const [users, setUsers] = useState<User[]>([])
	const [partners, setPartners] = useState<Partner[]>([])
	const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
	const [semesters, setSemesters] = useState<Semester[]>([])
	const [filteredSemesters, setFilteredSemesters] = useState<Semester[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isSheetOpen, setSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false)
	const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null)
	const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')
	const { toast } = useToast()

	// Fetch data from API
	useEffect(() => {
		fetchData()
	}, [])

	const fetchData = async () => {
		try {
			setIsLoading(true)
			const [internshipsData, usersData, partnersData, academicYearsData, semestersData] = await Promise.all([
				getInternships(),
				getUsers(),
				getPartners(),
				AcademicYearsApi.getAll(),
				SemestersApi.getAll(),
			])
			setInternships(internshipsData)
			setUsers(usersData)
			setPartners(partnersData)
			setAcademicYears(academicYearsData)
			setSemesters(semestersData)
			
			// If there are academic years, filter semesters for the first one
			if (academicYearsData.length > 0) {
				const firstYearSemesters = semestersData.filter(s => 
					s.academicYearId === academicYearsData[0].id
				)
				setFilteredSemesters(firstYearSemesters)
			}
		} catch (error: any) {
			console.error('Failed to fetch data:', error)
			toast({
				title: 'Lỗi',
				description: error.message || 'Không thể tải dữ liệu.',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleCreate = async (data: CreateInternshipData) => {
		try {
			setIsLoading(true);
			
			// Validate the data before sending
			const errors = validateInternshipData(data);
			if (Object.keys(errors).length > 0) {
				toast({
					title: 'Dữ liệu không hợp lệ',
					description: 'Vui lòng kiểm tra lại thông tin nhập vào.',
					variant: 'destructive',
				});
				return;
			}
			
			console.log('Attempting to create internship with data:', data);
			await createInternship(data);
			
			toast({
				title: 'Thành công',
				description: 'Thực tập đã được tạo thành công.',
			});
			
			fetchData();
			setSheetOpen(false);
		} catch (error: any) {
			console.error('Failed to create internship:', error);
			
			// Show appropriate error messages based on the error
			if (error.message.includes('Lỗi khi tạo mới đợt thực tập')) {
				toast({
					title: 'Lỗi hệ thống',
					description: 'Không thể tạo thực tập. Vui lòng liên hệ quản trị viên.',
					variant: 'destructive',
				});
			} else {
				toast({
					title: 'Lỗi',
					description: error.message || 'Không thể tạo thực tập.',
					variant: 'destructive',
				});
			}
			
			// Try to provide more helpful information if possible
			if (error.message.includes('Inner exception')) {
				toast({
					title: 'Chi tiết kỹ thuật',
					description: 'Có lỗi với cơ sở dữ liệu. Vui lòng thử lại sau.',
					variant: 'destructive',
				});
			}
		} finally {
			setIsLoading(false);
		}
	}

	const handleUpdate = async (data: CreateInternshipData) => {
		if (!selectedInternship) return
		try {
			await updateInternship(selectedInternship.id, data)
			toast({
				title: 'Thành công',
				description: 'Thực tập đã được cập nhật thành công.',
			})
			fetchData()
			setSheetOpen(false)
			setSelectedInternship(null)
		} catch (error: any) {
			console.error('Failed to update internship:', error)
			toast({
				title: 'Lỗi',
				description: error.message || 'Không thể cập nhật thực tập.',
				variant: 'destructive',
			})
		}
	}

	const handleDelete = async () => {
		if (!selectedInternship) return
		try {
			await deleteInternship(selectedInternship.id)
			toast({
				title: 'Thành công',
				description: 'Thực tập đã được xóa thành công.',
			})
			fetchData()
			setDeleteDialogOpen(false)
			setSelectedInternship(null)
		} catch (error: any) {
			console.error('Failed to delete internship:', error)
			toast({
				title: 'Lỗi',
				description: error.message || 'Không thể xóa thực tập.',
				variant: 'destructive',
			})
		}
	}

	const openSheet = (mode: 'create' | 'edit', internship?: Internship) => {
		setSheetMode(mode)
		setSelectedInternship(internship || null)
		setSheetOpen(true)
	}

	const openDeleteDialog = (internship: Internship) => {
		setSelectedInternship(internship)
		setDeleteDialogOpen(true)
	}

	const openDetailsDialog = (internship: Internship) => {
		setSelectedInternship(internship)
		setDetailsDialogOpen(true)
	}

	const dynamicColumns = getColumns({
		onView: openDetailsDialog,
		onEdit: (internship) => openSheet('edit', internship),
		onDelete: openDeleteDialog,
	})

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Thực tập' },
	]

	return (
		<>
			<PageHeader
				title="Quản lý Thực tập"
				description="Quản lý danh sách các đợt thực tập của sinh viên tại các doanh nghiệp đối tác."
				breadcrumbs={breadcrumbs}
				actions={
					<Button onClick={() => openSheet('create')}>
						<Plus className="h-4 w-4 mr-2" />
						Thêm thực tập
					</Button>
				}
			>
				<DataTable
					columns={dynamicColumns}
					data={internships}
					isLoading={isLoading}
					searchableColumn="studentFullName"
					searchPlaceholder="Tìm theo tên sinh viên..."
				/>
			</PageHeader>

			{/* Create/Edit Sheet */}
			<Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
				<SheetContent className="sm:max-w-lg">
					<SheetHeader>
						<SheetTitle>{sheetMode === 'create' ? 'Thêm thực tập mới' : 'Chỉnh sửa thực tập'}</SheetTitle>
						<SheetDescription>
							{sheetMode === 'create' ? 'Điền thông tin để thêm một đợt thực tập mới.' : 'Cập nhật thông tin cho đợt thực tập đã chọn.'}
						</SheetDescription>
					</SheetHeader>
					<InternshipForm
						internship={sheetMode === 'edit' ? selectedInternship : null}
						users={users}
						partners={partners}
						academicYears={academicYears}
						semesters={semesters}
						onSave={sheetMode === 'create' ? handleCreate : handleUpdate}
						onCancel={() => setSheetOpen(false)}
					/>
				</SheetContent>
			</Sheet>

			{/* Internship Details Dialog */}
			<InternshipDetails
				internship={selectedInternship}
				isOpen={isDetailsDialogOpen}
				onClose={() => {
					setDetailsDialogOpen(false)
					setSelectedInternship(null)
				}}
			/>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
						<AlertDialogDescription>
							Thao tác này không thể hoàn tác. Đợt thực tập của sinh viên{' '}
							<strong>{selectedInternship?.student?.name}</strong> sẽ bị xóa vĩnh viễn khỏi hệ thống.
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
const InternshipForm = ({
	internship,
	users,
	partners,
	academicYears,
	semesters,
	onSave,
	onCancel,
}: {
	internship?: Internship | null
	users: User[]
	partners: Partner[]
	academicYears: AcademicYear[]
	semesters: Semester[]
	onSave: (data: CreateInternshipData) => void
	onCancel: () => void
}) => {
	// Filter users to only show students (assuming students have specific role)
	// Since userRoles might be empty, we'll show all users for now
	// TODO: Update this logic when proper role filtering is implemented
	const students = users.filter(user => 
		// Check if user has student role, or if userRoles is empty/undefined, include all users
		!user.userRoles || user.userRoles.length === 0 || 
		user.userRoles.some(role => role.toLowerCase().includes('student'))
	)

	const [formData, setFormData] = useState<CreateInternshipData>({
		studentId: internship?.studentId || 0,
		partnerId: internship?.partnerId || 0,
		academicYearId: internship?.academicYearId || 0,
		semesterId: internship?.semesterId || 0,
		reportUrl: internship?.reportUrl || '',
		grade: internship?.grade || null,
	})
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [filteredSemesters, setFilteredSemesters] = useState<Semester[]>(semesters)

	// Update formData when data loads
	useEffect(() => {
		if (!internship && formData.studentId === 0) {
			setFormData(prev => ({
				...prev,
				studentId: students.length > 0 ? students[0].id : 0,
				partnerId: partners.length > 0 ? partners[0].id : 0,
				academicYearId: academicYears.length > 0 ? academicYears[0].id : 0,
				semesterId: filteredSemesters.length > 0 ? filteredSemesters[0].id : 0,
			}))
		}
	}, [students, partners, academicYears, filteredSemesters, internship, formData.studentId])

	// Filter semesters when academic year changes
	useEffect(() => {
		if (formData.academicYearId) {
			const yearSemesters = semesters.filter(s => s.academicYearId === formData.academicYearId)
			setFilteredSemesters(yearSemesters)
			
			// If there are semesters for this year but current selection is not valid,
			// update semesterId to the first available option
			if (yearSemesters.length > 0 && !yearSemesters.some(s => s.id === formData.semesterId)) {
				setFormData(prev => ({
					...prev,
					semesterId: yearSemesters[0].id
				}))
			}
		}
	}, [formData.academicYearId, semesters])

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {}

		if (formData.studentId <= 0) {
			newErrors.studentId = 'Vui lòng chọn sinh viên'
		}

		if (formData.partnerId <= 0) {
			newErrors.partnerId = 'Vui lòng chọn đối tác'
		}

		if (formData.academicYearId <= 0) {
			newErrors.academicYearId = 'Vui lòng chọn năm học'
		}

		if (formData.semesterId <= 0) {
			newErrors.semesterId = 'Vui lòng chọn học kỳ'
		}

		if (formData.grade !== null && formData.grade !== undefined && (formData.grade < 0 || formData.grade > 10)) {
			newErrors.grade = 'Điểm phải từ 0 đến 10'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		if (name === 'grade') {
			setFormData(prev => ({ ...prev, [name]: value ? parseFloat(value) : null }))
		} else {
			setFormData(prev => ({ ...prev, [name]: value }))
		}
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }))
		}
	}

	const handleSelectChange = (name: string, value: string) => {
		const numValue = parseInt(value)
		setFormData(prev => ({ ...prev, [name]: numValue }))
		// Clear error when user selects
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }))
		}
		
		// If changing academic year, reset semester to avoid invalid selection
		if (name === 'academicYearId') {
			// We don't need to set semesterId here as the useEffect will handle it
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
								{student.name} ({student.email})
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{errors.studentId && <p className="text-sm text-red-500">{errors.studentId}</p>}
			</div>
			
			<div className="space-y-2">
				<Label htmlFor="partnerId">Đối tác</Label>
				<Select
					value={formData.partnerId > 0 ? formData.partnerId.toString() : ''}
					onValueChange={(value) => handleSelectChange('partnerId', value)}
				>
					<SelectTrigger className={`w-full ${errors.partnerId ? 'border-red-500' : ''}`}>
						<SelectValue placeholder="Chọn đối tác" />
					</SelectTrigger>
					<SelectContent>
						{partners.map((partner) => (
							<SelectItem key={partner.id} value={partner.id.toString()}>
								{partner.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{errors.partnerId && <p className="text-sm text-red-500">{errors.partnerId}</p>}
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
				{filteredSemesters.length === 0 && (
					<p className="text-sm text-amber-500">Chưa có học kỳ nào cho năm học này. Vui lòng tạo học kỳ trước.</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="reportUrl">URL Báo cáo</Label>
				<Input
					id="reportUrl"
					name="reportUrl"
					value={formData.reportUrl || ''}
					onChange={handleChange}
					placeholder="https://example.com/report.pdf"
					className={errors.reportUrl ? 'border-red-500' : ''}
				/>
				{errors.reportUrl && <p className="text-sm text-red-500">{errors.reportUrl}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="grade">Điểm số</Label>
				<Input
					id="grade"
					name="grade"
					type="number"
					min="0"
					max="10"
					step="0.1"
					value={formData.grade?.toString() || ''}
					onChange={handleChange}
					placeholder="8.5"
					className={errors.grade ? 'border-red-500' : ''}
				/>
				{errors.grade && <p className="text-sm text-red-500">{errors.grade}</p>}
			</div>

			<SheetFooter className="pt-4">
				<Button variant="outline" onClick={onCancel}>Hủy</Button>
				<Button onClick={handleFormSave}>Lưu thay đổi</Button>
			</SheetFooter>
		</div>
	)
}

const InternshipDetails = ({
	internship,
	isOpen,
	onClose,
}: {
	internship: Internship | null
	isOpen: boolean
	onClose: () => void
}) => {
	if (!internship) return null

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Chi tiết thực tập</DialogTitle>
					<DialogDescription>
						Thông tin chi tiết về đợt thực tập
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label className="text-sm font-medium text-gray-500">ID</Label>
						<div className="text-sm">{internship.id}</div>
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-medium text-gray-500">Sinh viên</Label>
						<div className="text-sm font-medium">{internship.student?.name}</div>
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-medium text-gray-500">Đối tác</Label>
						<div className="text-sm">{internship.partner?.name}</div>
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-medium text-gray-500">Năm học</Label>
						<div className="text-sm">{internship.academicYear?.name}</div>
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-medium text-gray-500">Học kỳ</Label>
						<div className="text-sm">{internship.semester?.name}</div>
					</div>
					{internship.reportUrl && (
						<div className="space-y-2">
							<Label className="text-sm font-medium text-gray-500">Báo cáo</Label>
							<div className="text-sm">
								<a 
									href={internship.reportUrl} 
									target="_blank" 
									rel="noopener noreferrer"
									className="text-blue-600 hover:underline"
								>
									Xem báo cáo
								</a>
							</div>
						</div>
					)}
					{internship.grade !== null && internship.grade !== undefined && (
						<div className="space-y-2">
							<Label className="text-sm font-medium text-gray-500">Điểm số</Label>
							<div className="text-sm font-mono">{internship.grade}</div>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}

// Add a data validation function
const validateInternshipData = (data: CreateInternshipData): Record<string, string> => {
	const errors: Record<string, string> = {};
	
	if (!data.studentId || data.studentId <= 0) {
		errors.studentId = 'Vui lòng chọn sinh viên';
	}
	
	if (!data.partnerId || data.partnerId <= 0) {
		errors.partnerId = 'Vui lòng chọn đối tác';
	}
	
	if (!data.academicYearId || data.academicYearId <= 0) {
		errors.academicYearId = 'Vui lòng chọn năm học';
	}
	
	if (!data.semesterId || data.semesterId <= 0) {
		errors.semesterId = 'Vui lòng chọn học kỳ';
	}
	
	if (data.grade !== null && data.grade !== undefined && (data.grade < 0 || data.grade > 10)) {
		errors.grade = 'Điểm phải từ 0 đến 10';
	}
	
	return errors;
};
