"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface RouteGuardProps {
  children: React.ReactNode
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // 定义公开路由（不需要登录）
  const publicRoutes = ["/", "/login", "/signup", "/verify-email"]
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    if (!loading) {
      if (!user && !isPublicRoute) {
        // 用户未登录且访问受保护路由，重定向到登录页
        router.push("/login")
      } else if (user && user.email_confirmed_at && (pathname === "/login" || pathname === "/signup")) {
        // 用户已登录且邮箱已验证，访问登录/注册页时重定向到仪表板
        router.push("/dashboard")
      } else if (user && !user.email_confirmed_at && pathname !== "/verify-email") {
        // 用户已登录但邮箱未验证，重定向到验证页面
        router.push("/verify-email")
      }
    }
  }, [user, loading, pathname, isPublicRoute, router])

  // 显示加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto animate-pulse-glow">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-white font-semibold">正在加载...</h3>
            <p className="text-slate-400 text-sm">请稍候，正在验证您的身份</p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
