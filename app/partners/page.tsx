'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

import { DataTable } from '@/components/common/data-table'
import { columns } from './columns'
import { Partner } from '@/modules/partners/types'
import {
	createPartner,
	deletePartner,
	getPartners,
	updatePartner,
	type CreatePartnerData,
} from '@/lib/api/partners.api'

// Form Component
const PartnerForm = ({
	partner,
	onSave,
	onCancel,
}: {
	partner?: Partner | null
	onSave: (data: CreatePartnerData) => void
	onCancel: () => void
}) => {
	const [formData, setFormData] = useState<CreatePartnerData>({
		name: partner?.name || '',
		email: partner?.email || '',
		phoneNumber: partner?.phoneNumber || '',
		address: partner?.address || '',
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}
    
    const handleFormSave = () => {
        onSave(formData)
    }

	return (
		<div className="space-y-4 p-4">
			<div className="space-y-2">
				<Label htmlFor="name">Tên doanh nghiệp</Label>
				<Input id="name" name="name" value={formData.name} onChange={handleChange} />
			</div>
			<div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
			</div>
			<div className="space-y-2">
				<Label htmlFor="phoneNumber">Số điện thoại</Label>
				<Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
			</div>
			<div className="space-y-2">
				<Label htmlFor="address">Địa chỉ</Label>
				<Textarea id="address" name="address" value={formData.address} onChange={handleChange} />
			</div>
            <SheetFooter className="pt-4">
				<Button variant="outline" onClick={onCancel}>Hủy</Button>
                <Button onClick={handleFormSave}>Lưu thay đổi</Button>
            </SheetFooter>
		</div>
	)
}

// Partner Details Component
const PartnerDetails = ({
	partner,
	isOpen,
	onClose,
}: {
	partner: Partner | null
	isOpen: boolean
	onClose: () => void
}) => {
	if (!partner) return null

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Chi tiết doanh nghiệp</DialogTitle>
					<DialogDescription>
						Thông tin chi tiết về doanh nghiệp đối tác
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label className="text-sm font-medium text-gray-500">ID</Label>
						<div className="text-sm">{partner.id}</div>
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-medium text-gray-500">Tên doanh nghiệp</Label>
						<div className="text-sm font-medium">{partner.name}</div>
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-medium text-gray-500">Email</Label>
						<div className="text-sm">{partner.email}</div>
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-medium text-gray-500">Số điện thoại</Label>
						<div className="text-sm font-mono">{partner.phoneNumber}</div>
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-medium text-gray-500">Địa chỉ</Label>
						<div className="text-sm">{partner.address}</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

// Main Page Component
export default function PartnersPage() {
	const [partners, setPartners] = useState<Partner[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isSheetOpen, setSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false)
	const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
    const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')
	const { toast } = useToast()

	const fetchPartners = async () => {
		try {
			setIsLoading(true)
			const partnersData = await getPartners()
			setPartners(partnersData)
		} catch (error: any) {
			console.error('Failed to fetch partners:', error)
			toast({
				title: 'Lỗi',
				description: error.message || 'Không thể tải dữ liệu đối tác.',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchPartners()
	}, [])

	const handleCreate = async (data: CreatePartnerData) => {
		try {
			await createPartner(data)
			toast({
				title: 'Thành công',
				description: 'Đối tác đã được tạo thành công.',
			})
			fetchPartners()
			setSheetOpen(false)
		} catch (error: any) {
			console.error('Failed to create partner:', error)
			toast({
				title: 'Lỗi',
				description: error.message || 'Không thể tạo đối tác.',
				variant: 'destructive',
			})
		}
	}

	const handleUpdate = async (data: CreatePartnerData) => {
		if (!selectedPartner) return
		try {
			await updatePartner(selectedPartner.id, data)
			toast({
				title: 'Thành công',
				description: 'Đối tác đã được cập nhật thành công.',
			})
			fetchPartners()
			setSheetOpen(false)
			setSelectedPartner(null)
		} catch (error: any) {
			console.error('Failed to update partner:', error)
			toast({
				title: 'Lỗi',
				description: error.message || 'Không thể cập nhật đối tác.',
				variant: 'destructive',
			})
		}
	}

	const handleDelete = async () => {
		if (!selectedPartner) return
		try {
			await deletePartner(selectedPartner.id)
			toast({
				title: 'Thành công',
				description: 'Đối tác đã được xóa thành công.',
			})
			fetchPartners()
			setDeleteDialogOpen(false)
			setSelectedPartner(null)
		} catch (error: any) {
			console.error('Failed to delete partner:', error)
			toast({
				title: 'Lỗi',
				description: error.message || 'Không thể xóa đối tác.',
				variant: 'destructive',
			})
		}
	}

	const openSheet = (mode: 'create' | 'edit', partner?: Partner) => {
        setSheetMode(mode)
        setSelectedPartner(partner || null)
        setSheetOpen(true)
    }

	const openDeleteDialog = (partner: Partner) => {
		setSelectedPartner(partner)
		setDeleteDialogOpen(true)
	}

	const openDetailsDialog = (partner: Partner) => {
		setSelectedPartner(partner)
		setDetailsDialogOpen(true)
	}

	const dynamicColumns = columns.map(col => {
		if (col.id === 'actions') {
			return {
				...col,
				cell: ({ row }: { row: { original: Partner } }) => {
					const partner = row.original
					return (
						<div className="flex space-x-2">
							<Button variant="outline" size="icon" onClick={() => openDetailsDialog(partner)} title="Xem chi tiết">
								<Eye className="h-4 w-4" />
							</Button>
							<Button variant="outline" size="icon" onClick={() => openSheet('edit', partner)} title="Chỉnh sửa">
								<Edit className="h-4 w-4" />
							</Button>
							<Button variant="destructive" size="icon" onClick={() => openDeleteDialog(partner)} title="Xóa">
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					)
				},
			}
		}
		return col
	})

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Doanh nghiệp' },
	]

	return (
		<>
			<PageHeader
				title="Quản lý Doanh nghiệp"
				description="Quản lý danh sách các doanh nghiệp đối tác thực tập và khóa luận."
				breadcrumbs={breadcrumbs}
				actions={
                    <Button onClick={() => openSheet('create')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm Doanh nghiệp
                    </Button>
				}
			>
				<DataTable
					columns={dynamicColumns}
					data={partners}
					isLoading={isLoading}
					searchableColumn="name"
					searchPlaceholder="Tìm theo tên, email..."
				/>
			</PageHeader>
            
			{/* Create/Edit Sheet */}
			<Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
				<SheetContent className="sm:max-w-lg">
					<SheetHeader>
						<SheetTitle>{sheetMode === 'create' ? 'Thêm doanh nghiệp mới' : 'Chỉnh sửa doanh nghiệp'}</SheetTitle>
						<SheetDescription>
                            {sheetMode === 'create' ? 'Điền thông tin để thêm một đối tác mới.' : 'Cập nhật thông tin cho đối tác đã chọn.'}
                        </SheetDescription>
					</SheetHeader>
					<PartnerForm 
                        partner={sheetMode === 'edit' ? selectedPartner : null} 
                        onSave={sheetMode === 'create' ? handleCreate : handleUpdate} 
                        onCancel={() => setSheetOpen(false)}
                    />
				</SheetContent>
			</Sheet>

			{/* Partner Details Dialog */}
			<PartnerDetails
				partner={selectedPartner}
				isOpen={isDetailsDialogOpen}
				onClose={() => {
					setDetailsDialogOpen(false)
					setSelectedPartner(null)
				}}
			/>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
						<AlertDialogDescription>
							Thao tác này không thể hoàn tác. Doanh nghiệp{' '}
							<strong>{selectedPartner?.name}</strong> sẽ bị xóa vĩnh viễn khỏi hệ thống.
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
