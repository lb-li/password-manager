"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Lock, ArrowRight, Sparkles, Shield, CheckCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isValidSession, setIsValidSession] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    // 检查是否有有效的重置会话
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        setIsValidSession(true)
      } else {
        // 如果没有会话，检查 URL 参数
        const accessToken = searchParams.get("access_token")
        const refreshToken = searchParams.get("refresh_token")

        if (accessToken && refreshToken) {
          try {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })

            if (!error) {
              setIsValidSession(true)
            }
          } catch (err) {
            console.error("Error setting session:", err)
          }
        }
      }
    }

    checkSession()
  }, [searchParams])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("密码长度至少需要6位")
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error

      toast({
        title: "密码重置成功",
        description: "您的密码已成功更新，请使用新密码登录",
        variant: "success",
      })

      // 登出并重定向到登录页
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error: any) {
      const errorMessage = error.message || "密码重置失败，请重试"
      setError(errorMessage)
      toast({
        title: "重置失败",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 密码强度检测
  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return { level: "弱", color: "text-red-400", progress: 25 }
    if (password.length < 10) return { level: "中", color: "text-yellow-400", progress: 50 }
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return { level: "强", color: "text-green-400", progress: 100 }
    }
    return { level: "中", color: "text-yellow-400", progress: 75 }
  }

  const passwordStrength = getPasswordStrength(password)

  if (!isValidSession) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* 动态背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 animate-gradient">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fillOpacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md animate-slide-in-up">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold gradient-text mb-2">链接无效</h1>
              <p className="text-slate-400 text-sm">重置密码链接已过期或无效</p>
            </div>

            <Card className="glass-dark border-white/10 shadow-2xl">
              <CardContent className="p-6 text-center">
                <p className="text-slate-300 mb-6">您的密码重置链接可能已过期或无效。请重新申请密码重置。</p>
                <Link href="/login">
                  <Button className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white">
                    返回登录页面
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 动态背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 animate-gradient">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fillOpacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40"></div>
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-slide-in-up">
          {/* Logo 和标题 */}
          <div className="text-center mb-8 animate-slide-in-down">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-4 animate-pulse-glow">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">重置密码</h1>
            <p className="text-slate-400 text-sm">设置您的新密码</p>
          </div>

          {/* 重置密码卡片 */}
          <Card className="glass-dark border-white/10 shadow-2xl hover-card animate-scale-in">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-green-400" />
                设置新密码
              </CardTitle>
              <CardDescription className="text-slate-400">请输入您的新密码</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleResetPassword} className="space-y-6">
                {/* 新密码输入 */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-200 text-sm font-medium">
                    新密码
                  </Label>
                  <div className="relative modern-input">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="至少6位密码"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 pr-12 h-12 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {/* 密码强度指示器 */}
                  {password && (
                    <div className="space-y-2 animate-slide-in-up">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">密码强度</span>
                        <span className={passwordStrength.color}>{passwordStrength.level}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            passwordStrength.level === "强"
                              ? "bg-gradient-to-r from-green-500 to-emerald-500"
                              : passwordStrength.level === "中"
                                ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                : "bg-gradient-to-r from-red-500 to-pink-500"
                          }`}
                          style={{ width: `${passwordStrength.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 确认密码输入 */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-slate-200 text-sm font-medium">
                    确认新密码
                  </Label>
                  <div className="relative modern-input">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="再次输入新密码"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pl-10 pr-12 h-12 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors duration-200"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {/* 密码匹配指示器 */}
                  {confirmPassword && (
                    <div className="flex items-center gap-2 text-xs animate-slide-in-up">
                      {password === confirmPassword ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-green-400">密码匹配</span>
                        </>
                      ) : (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-red-400"></div>
                          <span className="text-red-400">密码不匹配</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* 错误信息 */}
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-slide-in-up">
                    {error}
                  </div>
                )}

                {/* 重置按钮 */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      重置中...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      重置密码
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>

              {/* 返回登录链接 */}
              <div className="text-center pt-4">
                <Link
                  href="/login"
                  className="text-green-400 hover:text-green-300 font-medium transition-colors duration-200 hover:underline text-sm"
                >
                  返回登录页面
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 底部装饰 */}
          <div className="text-center mt-8 animate-slide-in-up" style={{ animationDelay: "0.3s" }}>
            <p className="text-slate-500 text-xs">© 2024 密码保险箱. 保护您的数字生活安全</p>
          </div>
        </div>
      </div>
    </div>
  )
}
