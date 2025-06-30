"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { appConfig } from "@/modules/config/data"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { File } from "lucide-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Button variant="ghost" size="icon">
          <File />
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={appConfig.navMain} user={appConfig.user} />
      </SidebarContent>
      <SidebarFooter>
        <Separator className="my-2" />
        <NavUser user={appConfig.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
