import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowRight,
  Shield,
  Lock,
  Smartphone,
  Globe,
  CheckCircle,
  Star,
  Sparkles,
  Zap,
  Users,
  Eye,
  Plus,
  BarChart3,
  TrendingUp,
  Activity,
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* 动态背景 */}
      <div className="absolute inset-0 animate-gradient">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-2xl animate-pulse"></div>
      </div>

      {/* 网格背景 */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fillOpacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40"></div>

      {/* 导航栏 */}
      <header className="relative z-10 container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300 animate-pulse-glow">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">密码保险箱</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-slate-200 hover:text-white hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 backdrop-blur-sm"
            >
              登录
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25 border-0">
              注册
            </Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        {/* 英雄区域 */}
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8 animate-slide-in-up">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full border border-pink-500/20 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span className="text-pink-400 text-sm font-medium">全新体验</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
                  安全管理您的
                  <span className="gradient-text block">所有密码</span>
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
                  一站式管理您的所有账号和密码，采用军用级加密技术，确保您的数据安全无忧。
                  告别忘记密码的烦恼，让数字生活更加安全便捷。
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/25 border-0"
                  >
                    立即开始
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    className="bg-slate-800/50 border-2 border-slate-600/50 text-slate-200 hover:text-white hover:bg-slate-700/50 hover:border-slate-500/50 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  >
                    已有账户
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-8 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>免费使用</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>无限密码</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>跨设备同步</span>
                </div>
              </div>
            </div>

            {/* 重新设计的安全仪表板展示 */}
            <div className="flex justify-center animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="relative w-full max-w-lg">
                {/* 主仪表板卡片 */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-3xl blur-3xl animate-pulse"></div>
                  <Card className="relative glass-dark border-white/10 shadow-2xl hover-card overflow-hidden">
                    {/* 顶部状态栏 */}
                    <div className="bg-gradient-to-r from-pink-500/10 to-purple-600/10 p-4 border-b border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center animate-pulse-glow">
                            <Shield className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">安全仪表板</h3>
                            <p className="text-slate-400 text-xs">实时安全监控</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-400 text-xs font-medium">在线</span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6 space-y-6">
                      {/* 安全评分 */}
                      <div className="text-center space-y-3">
                        <div className="relative w-24 h-24 mx-auto">
                          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="transparent"
                              className="text-slate-700"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="url(#gradient)"
                              strokeWidth="8"
                              fill="transparent"
                              strokeDasharray={`${85 * 2.51} ${100 * 2.51}`}
                              className="transition-all duration-1000 ease-out"
                            />
                            <defs>
                              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#ec4899" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">85</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-semibold">安全评分</p>
                          <p className="text-slate-400 text-sm">优秀</p>
                        </div>
                      </div>

                      {/* 密码统计 */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          </div>
                          <p className="text-lg font-bold text-white">12</p>
                          <p className="text-xs text-slate-400">强密码</p>
                        </div>
                        <div className="text-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                          <div className="w-8 h-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <Activity className="w-4 h-4 text-yellow-400" />
                          </div>
                          <p className="text-lg font-bold text-white">3</p>
                          <p className="text-xs text-slate-400">中等</p>
                        </div>
                        <div className="text-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                          <div className="w-8 h-8 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <TrendingUp className="w-4 h-4 text-red-400" />
                          </div>
                          <p className="text-lg font-bold text-white">1</p>
                          <p className="text-xs text-slate-400">需更新</p>
                        </div>
                      </div>

                      {/* 最近活动 */}
                      <div className="space-y-3">
                        <h4 className="text-white font-medium text-sm flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-pink-400" />
                          最近活动
                        </h4>
                        <div className="space-y-2">
                          {[
                            { platform: "微信", action: "密码已更新", time: "2分钟前", status: "success" },
                            { platform: "支付宝", action: "安全检查", time: "1小时前", status: "warning" },
                            { platform: "淘宝", action: "新增密码", time: "3小时前", status: "info" },
                          ].map((activity, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg border border-slate-700/30 hover:bg-slate-700/30 transition-all duration-300"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    activity.status === "success"
                                      ? "bg-green-400"
                                      : activity.status === "warning"
                                        ? "bg-yellow-400"
                                        : "bg-blue-400"
                                  }`}
                                ></div>
                                <div>
                                  <p className="text-white text-sm font-medium">{activity.platform}</p>
                                  <p className="text-slate-400 text-xs">{activity.action}</p>
                                </div>
                              </div>
                              <span className="text-slate-500 text-xs">{activity.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 快速操作 */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-pink-500/20 to-purple-600/20 hover:from-pink-500/30 hover:to-purple-600/30 text-pink-400 border border-pink-500/30 hover:border-pink-500/50 transition-all duration-300"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          添加
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-blue-500/20 to-cyan-600/20 hover:from-blue-500/30 hover:to-cyan-600/30 text-blue-400 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          查看
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 浮动装饰元素 */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full animate-bounce opacity-80"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full animate-pulse opacity-60"></div>
              </div>
            </div>
          </div>
        </section>

        {/* 功能特性 */}
        <section className="container mx-auto px-4 py-20 bg-slate-900/30 backdrop-blur-sm">
          <div className="text-center mb-16 animate-slide-in-up">
            <div className="inline-block rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-600/10 px-4 py-2 text-sm text-pink-400 mb-6 border border-pink-500/20">
              <Zap className="w-4 h-4 inline mr-2" />
              核心功能
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
              为什么选择我们的
              <span className="gradient-text block">密码管理器</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              我们提供最先进的密码管理解决方案，让您的数字生活更加安全便捷
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "军用级加密",
                description: "采用AES-256加密技术，确保您的密码数据安全无忧，即使是我们也无法查看您的密码。",
                color: "from-red-500 to-pink-500",
              },
              {
                icon: Smartphone,
                title: "跨设备同步",
                description: "在任何设备上访问您的密码，数据实时同步，无论您在哪里都能安全登录。",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Globe,
                title: "自动填充",
                description: "一键自动填充登录信息，告别手动输入密码的烦恼，提升您的工作效率。",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Lock,
                title: "密码生成器",
                description: "智能生成强密码，确保每个账户都有独特且安全的密码保护。",
                color: "from-purple-500 to-violet-500",
              },
              {
                icon: CheckCircle,
                title: "安全检测",
                description: "实时监控密码强度，及时提醒您更新弱密码，保持账户安全。",
                color: "from-orange-500 to-red-500",
              },
              {
                icon: Star,
                title: "简单易用",
                description: "直观的用户界面，简单的操作流程，让密码管理变得轻松愉快。",
                color: "from-yellow-500 to-orange-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="glass-dark border-white/10 hover-card group animate-slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div
                    className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 统计数据 */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10K+", label: "活跃用户", icon: Users },
              { number: "99.9%", label: "安全保障", icon: Shield },
              { number: "24/7", label: "技术支持", icon: Zap },
              { number: "100%", label: "用户满意", icon: Star },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center animate-slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-2xl mb-4 border border-pink-500/20">
                  <stat.icon className="w-8 h-8 text-pink-400" />
                </div>
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA区域 */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center space-y-8 animate-slide-in-up">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              开始保护您的
              <span className="gradient-text block">数字生活</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              加入数千名用户的行列，体验最安全、最便捷的密码管理服务
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/25 border-0"
                >
                  免费注册
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto flex flex-col gap-2 py-8 px-4 md:flex-row md:items-center md:gap-4">
          <p className="text-sm text-slate-400">© 2024 密码保险箱. 保留所有权利.</p>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link href="#" className="hover:text-slate-300 transition-colors duration-200">
              隐私政策
            </Link>
            <Link href="#" className="hover:text-slate-300 transition-colors duration-200">
              服务条款
            </Link>
            <Link href="#" className="hover:text-slate-300 transition-colors duration-200">
              联系我们
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
