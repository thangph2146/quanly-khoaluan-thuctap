/**
 * Partner Details Component
 * Display detailed information about a partner
 */
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Mail, Phone, MapPin, Building } from 'lucide-react'
import type { Partner } from '../types'

interface PartnerDetailsProps {
  partner: Partner
}

export function PartnerDetails({ partner }: PartnerDetailsProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Building className="h-5 w-5" />
                {partner.name}
              </CardTitle>
              <CardDescription className="mt-2">
                Mã số: {partner.id}
              </CardDescription>
            </div>
            <Badge variant="default">
              Đối tác
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Email:</span>
              <span>{partner.email}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Số điện thoại:</span>
              <span>{partner.phoneNumber}</span>
            </div>
            
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span className="font-medium">Địa chỉ:</span>
              <span className="flex-1">{partner.address}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
