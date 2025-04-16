import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Register",
  description: "create your account",
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>{children}</main>
  )
}

export default AuthLayout
