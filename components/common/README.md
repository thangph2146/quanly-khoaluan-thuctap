# Common Components

Thư viện các component dùng chung để tránh hard code và đảm bảo tính nhất quán trong UI.

## 📁 Cấu trúc

```
components/common/
├── statistics-card.tsx     # Card hiển thị thống kê
├── status-badge.tsx        # Badge trạng thái
├── page-header.tsx         # Header layout cho trang
├── data-table.tsx          # Bảng dữ liệu với search/filter
├── empty-state.tsx         # Trạng thái không có dữ liệu
├── loading-skeleton.tsx    # Loading skeletons
├── form-fields.tsx         # Form input components
├── index.ts               # Export tất cả components
└── README.md              # Hướng dẫn này
```

## 🚀 Cách sử dụng

### 1. StatisticsCard

Component để hiển thị số liệu thống kê với icon và trend.

```tsx
import { StatisticsCard } from '@/components/common'
import { BookOpen } from 'lucide-react'

<StatisticsCard
  title="Tổng khóa luận"
  value={156}
  description="so với tháng trước"
  icon={BookOpen}
  trend={{ value: "12%", isPositive: true }}
  variant="success"
/>
```

**Props:**
- `title`: Tiêu đề card
- `value`: Giá trị hiển thị
- `description`: Mô tả (optional)
- `icon`: Icon từ lucide-react
- `trend`: Thông tin xu hướng (optional)
- `variant`: "default" | "success" | "warning" | "error"

### 2. StatusBadge

Component hiển thị trạng thái với màu sắc phù hợp.

```tsx
import { StatusBadge } from '@/components/common'

<StatusBadge status="approved" />
<StatusBadge status="pending" label="Chờ duyệt" />
```

**Props:**
- `status`: "approved" | "in_progress" | "pending" | "completed" | "overdue" | "cancelled" | "draft" | "review" | "active" | "inactive"
- `label`: Text tùy chỉnh thay cho label mặc định
- `variant`: Variant của Badge component

### 3. PageHeader

Component layout chung cho header của trang.

```tsx
import { PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

<PageHeader
  title="Quản lý Khóa luận"
  description="Quản lý toàn bộ khóa luận sinh viên"
  breadcrumbs={[
    { label: "Dashboard", href: "/dashboard" },
    { label: "Khóa luận" }
  ]}
  actions={
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Thêm mới
    </Button>
  }
>
  {/* Nội dung trang */}
</PageHeader>
```

**Props:**
- `title`: Tiêu đề trang
- `description`: Mô tả trang (optional)
- `breadcrumbs`: Danh sách breadcrumb
- `actions`: Các action buttons (optional)
- `children`: Nội dung trang

### 4. DataTable

Component bảng dữ liệu với search, filter, actions.

```tsx
import { DataTable, type DataTableColumn, type DataTableAction } from '@/components/common'
import { Eye, Edit, Trash2 } from 'lucide-react'

const columns: DataTableColumn[] = [
  {
    key: "name",
    label: "Họ tên",
    render: (value) => <span className="font-medium">{String(value)}</span>
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => <StatusBadge status={value as StatusType} />
  }
]

const actions: DataTableAction[] = [
  {
    label: "Xem",
    icon: Eye,
    onClick: (row) => console.log(row)
  },
  {
    label: "Xóa",
    icon: Trash2,
    onClick: (row) => console.log(row),
    variant: "destructive"
  }
]

<DataTable
  data={data}
  columns={columns}
  actions={actions}
  searchable
  exportable
/>
```

**Props:**
- `data`: Mảng dữ liệu
- `columns`: Cấu hình cột
- `actions`: Các hành động trên từng row (optional)
- `searchable`: Có search không (default: true)
- `filterable`: Có filter không (default: false)
- `exportable`: Có xuất Excel không (default: false)
- `loading`: Trạng thái loading (default: false)

### 5. EmptyState

Component hiển thị khi không có dữ liệu.

```tsx
import { EmptyState } from '@/components/common'
import { Users } from 'lucide-react'

<EmptyState
  icon={Users}
  title="Không có dữ liệu"
  description="Chưa có người dùng nào trong hệ thống."
  action={{
    label: "Thêm người dùng",
    onClick: () => console.log("Add user")
  }}
/>
```

**Props:**
- `icon`: Icon hiển thị (optional)
- `title`: Tiêu đề
- `description`: Mô tả (optional)
- `action`: Action button (optional)

### 6. Loading Skeletons

Các component skeleton cho trạng thái loading.

```tsx
import { LoadingSkeleton, StatisticsCardSkeleton, TableSkeleton } from '@/components/common'

// Skeleton tổng quát
<LoadingSkeleton type="card" count={4} />
<LoadingSkeleton type="table" count={5} />
<LoadingSkeleton type="list" count={3} />

// Skeleton chuyên biệt
<StatisticsCardSkeleton count={4} />
<TableSkeleton rows={5} columns={4} />
```

### 7. Form Fields

Các component form với validation và styling nhất quán.

```tsx
import { TextField, SelectField, TextAreaField, FileUploadField, FormSection } from '@/components/common'

<FormSection title="Thông tin cơ bản" description="Nhập thông tin bắt buộc">
  <TextField
    label="Họ tên"
    id="name"
    value={name}
    onChange={setName}
    required
    error={nameError}
  />
  
  <SelectField
    label="Chuyên ngành"
    id="major"
    value={major}
    onChange={setMajor}
    options={[
      { value: "cs", label: "Khoa học máy tính" },
      { value: "it", label: "Công nghệ thông tin" }
    ]}
    required
  />
  
  <FileUploadField
    label="Upload CV"
    id="cv"
    accept=".pdf,.doc,.docx"
    onFileSelect={(files) => console.log(files)}
    maxSize={5}
  />
</FormSection>
```

## 💡 Lợi ích

1. **Tính nhất quán**: Tất cả components đều follow cùng design system
2. **Tái sử dụng**: Giảm code duplication đáng kể
3. **Dễ maintain**: Thay đổi ở một nơi, áp dụng toàn bộ app
4. **Type safety**: Full TypeScript support
5. **Accessibility**: Built-in accessibility features
6. **Performance**: Optimized với React best practices

## 🔄 Migration từ code cũ

### Trước:
```tsx
// Code cũ - hard coded
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">Tổng số Khóa luận</CardTitle>
    <BookOpen className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">156</div>
    <p className="text-xs text-muted-foreground">
      <span className="text-green-600">+12%</span> so với học kỳ trước
    </p>
  </CardContent>
</Card>
```

### Sau:
```tsx
// Code mới - sử dụng component
<StatisticsCard
  title="Tổng số Khóa luận"
  value={156}
  description="so với học kỳ trước"
  icon={BookOpen}
  trend={{ value: "12%", isPositive: true }}
/>
```

## 📈 Kế hoạch phát triển

- [ ] Thêm Dark mode support
- [ ] Internationalization (i18n)
- [ ] Advanced filtering components
- [ ] Chart components integration
- [ ] Form validation helpers
- [ ] Animation và transitions
- [ ] Mobile-optimized components 