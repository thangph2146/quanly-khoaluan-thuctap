'use server'

import { signIn, signOut } from '@/auth'

export async function signInWithKeycloak() {
  await signIn('keycloak')
}

export async function signOutAction() {
  try {
    await signOut({ redirectTo: '/', redirect: true })
  } catch (error) {
    console.error('Sign out failed:', error)
    // Re-throw the error to be handled further up if necessary
    throw error
  }
} 