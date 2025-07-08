"use client"

import * as React from "react"
import { NavMain } from "@/components/layouts/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Menu, AlertTriangle } from "lucide-react"
import { useMenus } from "@/hooks/useMenus"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isLoading, error } = useMenus()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Button variant="ghost" size="icon">
          <Menu />
        </Button>
      </SidebarHeader>
      <SidebarContent>
        {isLoading ? (
          <div className="space-y-2 p-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : error ? (
          <Alert variant="destructive" className="m-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Không thể tải menu: {error}
            </AlertDescription>
          </Alert>
        ) : (
          <NavMain />
        )}
      </SidebarContent>
      <SidebarFooter>
        <Separator className="my-2" />
      </SidebarFooter>
    </Sidebar>
  )
}
