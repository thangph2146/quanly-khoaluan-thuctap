'use client'

import { usePathname } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { useEffect } from 'react'
import { initToolbar } from '@stagewise/toolbar'

export function LayoutProvider({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()
	// Apply sidebar layout to all pages except the landing page
	const isAppPage = pathname !== '/'

	useEffect(() => {
		if (process.env.NODE_ENV === 'development') {
			initToolbar({
				plugins: [],
			})
		}
	}, [])

	if (isAppPage) {
		return (
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>{children}</SidebarInset>
			</SidebarProvider>
		)
	}

	return <>{children}</>
} 