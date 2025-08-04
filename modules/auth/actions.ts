'use server'

import { signOut } from '@/auth'

// Server action để đăng xuất và về trang chủ
export async function signOutAction() {
  await signOut({ redirectTo: "/" })
} 