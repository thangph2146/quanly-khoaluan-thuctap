import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp } from "lucide-react"
import { StatusCategory } from '@/modules/dashboard/types'

interface CurrentStatusProps {
  thesisStatus: StatusCategory
  internshipStatus: StatusCategory
}

function StatusSection({ title, total, items }: StatusCategory) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        <Badge variant="outline">{total} tổng</Badge>
      </div>
      <div className="mt-2 space-y-2">
        {items.map(item => (
          <div key={item.label} className="flex justify-between text-sm">
            <span>{item.label}</span>
            <span className={item.color}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CurrentStatus({ thesisStatus, internshipStatus }: CurrentStatusProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Tình trạng hiện tại</CardTitle>
        <CardDescription>Thống kê theo trạng thái</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <StatusSection {...thesisStatus} />
          <Separator />
          <StatusSection {...internshipStatus} />
          <Separator />
          <div className="space-y-2">
            <span className="text-sm font-medium">Thao tác nhanh</span>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="h-8">
                <Calendar className="mr-2 h-3 w-3" />
                Xem lịch
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <TrendingUp className="mr-2 h-3 w-3" />
                Báo cáo
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 