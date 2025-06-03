import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/contexts/auth-context"
import { RouteGuard } from "@/components/auth/route-guard"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "密码保险箱 - 安全管理您的密码",
  description: "一站式管理您的所有账号和密码，采用军用级加密技术，确保您的数据安全无忧。",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <RouteGuard>{children}</RouteGuard>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}

