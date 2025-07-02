'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { DataTable } from '@/components/common/data-table'
import { columns } from './columns'
import { partnersData } from '@/modules/partners/data'
import { Partner } from '@/modules/partners/types'

// Form Component
const PartnerForm = ({
	partner,
	onSave,
	onCancel,
}: {
	partner?: Partner | null
	onSave: (data: Partial<Partner>) => void
	onCancel: () => void
}) => {
	const [formData, setFormData] = useState({
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
		<div className="space-y-4 py-4">
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

// Main Page Component
export default function PartnersPage() {
	const [partnerData, setPartnerData] = useState<Partner[]>(partnersData)
	const [isSheetOpen, setSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
    const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')

	const handleCreate = (data: Partial<Partner>) => {
		const newPartner: Partner = {
			id: Math.max(...partnerData.map(p => p.id), 0) + 1,
			...data,
		} as Partner
		setPartnerData(prev => [...prev, newPartner])
		setSheetOpen(false)
	}

	const handleUpdate = (data: Partial<Partner>) => {
		if (!selectedPartner) return
		setPartnerData(prev =>
			prev.map(p => (p.id === selectedPartner.id ? { ...p, ...data } : p))
		)
		setSheetOpen(false)
		setSelectedPartner(null)
	}

	const handleDelete = () => {
		if (!selectedPartner) return
		setPartnerData(prev => prev.filter(p => p.id !== selectedPartner.id))
		setDeleteDialogOpen(false)
		setSelectedPartner(null)
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

	const dynamicColumns = columns.map(col => {
		if (col.id === 'actions') {
			return {
				...col,
				cell: ({ row }: { row: { original: Partner } }) => {
					const partner = row.original
					return (
						<div className="flex space-x-2">
							<Button variant="outline" size="icon" onClick={() => openSheet('edit', partner)}>
								<Edit className="h-4 w-4" />
							</Button>
							<Button variant="destructive" size="icon" onClick={() => openDeleteDialog(partner)}>
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
					data={partnerData}
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