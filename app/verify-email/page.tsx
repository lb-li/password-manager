"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { Mail, CheckCircle, ArrowLeft, Sparkles } from "lucide-react"

export default function VerifyEmailPage() {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user?.email_confirmed_at) {
        router.push("/dashboard")
      }
    }

    checkUser()
  }, [router])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 动态背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 animate-gradient">
        {/* 浮动装饰元素 */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-float"></div>
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-4 animate-pulse-glow">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">验证邮箱</h1>
            <p className="text-slate-400 text-sm">我们已向您发送验证链接</p>
          </div>

          {/* 验证卡片 */}
          <Card className="glass-dark border-white/10 shadow-2xl hover-card animate-scale-in">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-green-400" />
                验证您的邮箱
              </CardTitle>
              <CardDescription className="text-slate-400">我们已向您的邮箱发送了验证链接</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 text-center">
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-3 text-slate-300">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <span className="text-lg font-medium">注册成功！</span>
                </div>

                <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    请检查您的邮箱并点击验证链接来激活您的账户。 验证完成后，您就可以开始使用密码保险箱了。
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>邮件可能需要几分钟才能到达</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                    <span>请检查垃圾邮件文件夹</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full h-12 border-slate-600 text-slate-200 hover:bg-slate-700/50 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    返回登录页面
                  </Button>
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
