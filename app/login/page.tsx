"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, Shield } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // 在组件开头添加忘记密码相关状态
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetLoading, setResetLoading] = useState(false)

  // 添加忘记密码处理函数
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail) {
      toast({
        title: "请输入邮箱",
        description: "请输入您的注册邮箱地址",
        variant: "warning",
      })
      return
    }

    setResetLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      toast({
        title: "重置邮件已发送",
        description: "请检查您的邮箱并点击重置链接",
        variant: "success",
      })

      setShowForgotPassword(false)
      setResetEmail("")
    } catch (error: any) {
      toast({
        title: "发送失败",
        description: error.message || "发送重置邮件失败，请重试",
        variant: "destructive",
      })
    } finally {
      setResetLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast({
        title: "登录成功",
        description: "欢迎回到密码保险箱！",
        variant: "success",
      })

      // 路由跳转现在由 AuthProvider 处理
    } catch (error: any) {
      const errorMessage = error.message || "登录失败，请重试"
      setError(errorMessage)
      toast({
        title: "登录失败",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 动态背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 animate-gradient">
        {/* 浮动装饰元素 */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-pulse"></div>

        {/* 网格背景 */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fillOpacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40"></div>
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-slide-in-up">
          {/* Logo 和标题 */}
          <div className="text-center mb-8 animate-slide-in-down">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl mb-4 animate-pulse-glow">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">密码保险箱</h1>
            <p className="text-slate-400 text-sm">安全登录您的账户</p>
          </div>

          {/* 登录卡片 */}
          <Card className="glass-dark border-white/10 shadow-2xl hover-card animate-scale-in">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-400" />
                欢迎回来
              </CardTitle>
              <CardDescription className="text-slate-400">登录您的密码保险箱账户</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* 邮箱输入 */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200 text-sm font-medium">
                    邮箱地址
                  </Label>
                  <div className="relative modern-input">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-12 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* 密码输入 */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-200 text-sm font-medium">
                    密码
                  </Label>
                  <div className="relative modern-input">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 pr-12 h-12 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* 记住我选项 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="w-4 h-4 text-pink-600 bg-slate-800 border-slate-600 rounded focus:ring-pink-500 focus:ring-2"
                      defaultChecked
                    />
                    <label htmlFor="remember" className="text-sm text-slate-300">
                      记住我
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-pink-400 hover:text-pink-300 transition-colors duration-200"
                  >
                    忘记密码？
                  </button>
                </div>

                {/* 错误信息 */}
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-slide-in-up">
                    {error}
                  </div>
                )}

                {/* 登录按钮 */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      登录中...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      登录账户
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>

              {/* 分割线 */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-800/50 text-slate-400">或者</span>
                </div>
              </div>

              {/* 注册链接 */}
              <div className="text-center">
                <p className="text-slate-400 text-sm">
                  还没有账户？{" "}
                  <Link
                    href="/signup"
                    className="text-pink-400 hover:text-pink-300 font-medium transition-colors duration-200 hover:underline"
                  >
                    立即注册
                  </Link>
                </p>
              </div>
              {showForgotPassword && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-600/50 rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
                    <div className="p-6">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-600/20 rounded-xl mb-4 border border-blue-500/30">
                          <Mail className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">重置密码</h3>
                        <p className="text-slate-400 text-sm">输入您的邮箱地址，我们将发送重置链接</p>
                      </div>

                      <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="reset-email" className="text-slate-200 text-sm font-medium">
                            邮箱地址
                          </Label>
                          <div className="relative modern-input">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-slate-400" />
                            </div>
                            <Input
                              id="reset-email"
                              type="email"
                              placeholder="your@email.com"
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              required
                              className="pl-10 h-12 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowForgotPassword(false)
                              setResetEmail("")
                            }}
                            className="flex-1 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-300 h-12 rounded-xl"
                            disabled={resetLoading}
                          >
                            取消
                          </Button>
                          <Button
                            type="submit"
                            disabled={resetLoading}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white h-12 rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300"
                          >
                            {resetLoading ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                发送中...
                              </div>
                            ) : (
                              "发送重置邮件"
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
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
