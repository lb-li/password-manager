"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { supabase, type PasswordEntry, encryptPasswordEntry, decryptPasswordEntry } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import {
  Search,
  Plus,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  LogOut,
  Copy,
  Key,
  User,
  Shield,
  Globe,
  CheckCircle,
  AlertCircle,
  Save,
  X,
  ChevronDown,
} from "lucide-react"

export default function DashboardPage() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({})
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showEditPassword, setShowEditPassword] = useState(false)
  const [newEntry, setNewEntry] = useState({
    platform: "",
    username: "",
    password: "",
    url: "",
  })
  const [editEntry, setEditEntry] = useState<{
    id: string
    platform: string
    username: string
    password: string
    url: string
  } | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean
    id: string
    platform: string
  }>({
    open: false,
    id: "",
    platform: "",
  })
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [copySuccess, setCopySuccess] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { user, signOut } = useAuth()
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})

  // 切换卡片展开状态
  const toggleCardExpansion = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // 获取密码列表
  const fetchPasswords = async () => {
    try {
      const { data, error } = await supabase.from("passwords").select("*").order("created_at", { ascending: false })

      if (error) throw error

      // 解密所有密码
      const decryptedData = data ? data.map(entry => decryptPasswordEntry(entry)) : [];
      setPasswords(decryptedData);
    } catch (error) {
      console.error("Error fetching passwords:", error)
      toast({
        title: "获取数据失败",
        description: "无法加载密码列表，请刷新页面重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchPasswords()
    }
  }, [user])

  // 添加新密码
  const handleAddPassword = async () => {
    if (!newEntry.platform || !newEntry.username || !newEntry.password) {
      toast({
        title: "信息不完整",
        description: "请填写所有必填字段",
        variant: "warning",
      })
      return
    }

    try {
      // 加密密码
      const encryptedEntry = encryptPasswordEntry({
        user_id: user.id,
        platform: newEntry.platform,
        username: newEntry.username,
        password: newEntry.password,
        url: newEntry.url || null,
      });

      const { error } = await supabase.from("passwords").insert([encryptedEntry])

      if (error) throw error

      setNewEntry({ platform: "", username: "", password: "", url: "" })
      setShowNewPassword(false)
      setIsAddDialogOpen(false)
      fetchPasswords()

      toast({
        title: "添加成功",
        description: `${newEntry.platform} 的密码已成功保存`,
        variant: "success",
      })
    } catch (error) {
      console.error("Error adding password:", error)
      toast({
        title: "添加失败",
        description: "保存密码时出现错误，请重试",
        variant: "destructive",
      })
    }
  }

  // 编辑密码
  const handleEditPassword = async () => {
    if (!editEntry || !editEntry.platform || !editEntry.username || !editEntry.password) {
      toast({
        title: "信息不完整",
        description: "请填写所有必填字段",
        variant: "warning",
      })
      return
    }

    setEditLoading(true)
    try {
      // 加密密码
      const encryptedPassword = encrypt(editEntry.password);
      
      const { error } = await supabase
        .from("passwords")
        .update({
          platform: editEntry.platform,
          username: editEntry.username,
          password: encryptedPassword,
          url: editEntry.url || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editEntry.id)

      if (error) throw error

      setEditEntry(null)
      setShowEditPassword(false)
      setIsEditDialogOpen(false)
      fetchPasswords()

      toast({
        title: "更新成功",
        description: `${editEntry.platform} 的密码已成功更新`,
        variant: "success",
      })
    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        title: "更新失败",
        description: "更新密码时出现错误，请重试",
        variant: "destructive",
      })
    } finally {
      setEditLoading(false)
    }
  }

  // 打开编辑对话框
  const openEditDialog = (entry: PasswordEntry) => {
    setEditEntry({
      id: entry.id,
      platform: entry.platform,
      username: entry.username,
      password: entry.password,
      url: entry.url || "",
    })
    setShowEditPassword(false)
    setIsEditDialogOpen(true)
  }

  // 删除密码
  const handleDeletePassword = async () => {
    setDeleteLoading(true)
    try {
      const { error } = await supabase.from("passwords").delete().eq("id", deleteConfirm.id)

      if (error) throw error

      fetchPasswords()
      toast({
        title: "删除成功",
        description: `${deleteConfirm.platform} 的密码已被删除`,
        variant: "success",
      })
    } catch (error) {
      console.error("Error deleting password:", error)
      toast({
        title: "删除失败",
        description: "删除密码时出现错误，请重试",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(false)
      setDeleteConfirm({ open: false, id: "", platform: "" })
    }
  }

  // 复制到剪贴板
  const copyToClipboard = async (text: string, type: string, platform: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(type)
      setTimeout(() => setCopySuccess(null), 2000)

      toast({
        title: "复制成功",
        description: `${platform} 的${type === "username" ? "用户名" : "密码"}已复制到剪贴板`,
        variant: "success",
      })
    } catch (err) {
      console.error("复制失败:", err)
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板，请手动复制",
        variant: "destructive",
      })
    }
  }

  // 切换密码可见性
  const togglePasswordVisibility = (id: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // 登出
  const handleLogout = async () => {
    await signOut()
  }

  // 生成随机密码
  const generatePassword = (isEdit = false) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    if (isEdit && editEntry) {
      setEditEntry({ ...editEntry, password })
    } else {
      setNewEntry({ ...newEntry, password })
    }

    toast({
      title: "密码已生成",
      description: "已为您生成一个强密码",
      variant: "success",
    })
  }

  // 过滤密码列表
  const filteredPasswords = passwords.filter(
    (entry) =>
      entry.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 密码强度检测
  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return { level: "弱", color: "bg-red-500" }
    if (password.length < 10) return { level: "中", color: "bg-yellow-500" }
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return { level: "强", color: "bg-green-500" }
    }
    return { level: "中", color: "bg-yellow-500" }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 顶部导航 */}
      <header className="border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-rose-500 to-purple-600 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white hidden sm:block">密码保险箱</h1>
              <p className="text-xs text-slate-400 hidden sm:block">安全管理您的密码</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-gradient-to-r from-rose-500/20 to-purple-600/20 p-2">
                <User className="h-4 w-4 text-rose-400" />
              </div>
              <span className="text-sm text-slate-300">{user?.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-300 hover:text-white">
              <LogOut className="h-4 w-4 mr-2" />
              登出
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-200">总密码数</CardTitle>
              <Key className="h-3 w-3 sm:h-4 sm:w-4 text-rose-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">{passwords.length}</div>
              <p className="text-xs text-slate-400">已保存的账户</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-200">强密码</CardTitle>
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">
                {passwords.filter((p) => getPasswordStrength(p.password).level === "强").length}
              </div>
              <p className="text-xs text-slate-400">安全性良好</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-200">弱密码</CardTitle>
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">
                {passwords.filter((p) => getPasswordStrength(p.password).level === "弱").length}
              </div>
              <p className="text-xs text-slate-400">需要加强</p>
            </CardContent>
          </Card>
        </div>

        {/* 操作栏 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-white">我的密码</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="搜索平台或用户名..."
                className="pl-10 bg-slate-800/50 border-slate-700 text-white w-full sm:w-64 focus:border-rose-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog
              open={isAddDialogOpen}
              onOpenChange={(open) => {
                setIsAddDialogOpen(open)
                if (!open) {
                  setShowNewPassword(false)
                  setNewEntry({ platform: "", username: "", password: "", url: "" })
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:shadow-rose-500/25 transition-all duration-300 hover:scale-105">
                  <Plus className="h-4 w-4 mr-2" />
                  添加密码
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-600/50 text-white w-[95vw] max-w-md mx-auto shadow-2xl backdrop-blur-xl sm:w-full max-h-[85vh] overflow-y-auto hide-scrollbar">
                {/* 装饰性背景 */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-purple-500/5 to-cyan-500/5 rounded-lg"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500 rounded-t-lg"></div>

                <div className="relative z-10">
                  <DialogHeader className="text-center pb-2 sm:pb-4">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-rose-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center border border-rose-500/30 backdrop-blur-sm">
                          <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-rose-400" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                      添加新密码
                    </DialogTitle>
                    <p className="text-slate-400 text-sm mt-2">安全保存您的账户信息</p>
                  </DialogHeader>

                  <div className="grid gap-3 sm:gap-4 py-2 sm:py-3">
                    {/* 平台名称 */}
                    <div className="group space-y-2">
                      <Label htmlFor="platform" className="text-slate-200 text-sm font-medium flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-rose-400 to-purple-500 rounded-full"></div>
                        平台名称 *
                      </Label>
                      <div className="relative">
                        <Input
                          id="platform"
                          placeholder="如：微信、支付宝、淘宝等"
                          className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 transition-all duration-300 h-10 sm:h-12 rounded-xl backdrop-blur-sm hover:bg-slate-700/50"
                          value={newEntry.platform}
                          onChange={(e) => setNewEntry({ ...newEntry, platform: e.target.value })}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    {/* 用户名 */}
                    <div className="group space-y-2">
                      <Label htmlFor="username" className="text-slate-200 text-sm font-medium flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full"></div>
                        用户名/邮箱 *
                      </Label>
                      <div className="relative">
                        <Input
                          id="username"
                          placeholder="账号用户名或邮箱"
                          className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 h-10 sm:h-12 rounded-xl backdrop-blur-sm hover:bg-slate-700/50"
                          value={newEntry.username}
                          onChange={(e) => setNewEntry({ ...newEntry, username: e.target.value })}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    {/* 密码 */}
                    <div className="group space-y-2">
                      <Label htmlFor="password" className="text-slate-200 text-sm font-medium flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                        密码 *
                      </Label>
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <Input
                            id="password"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="账号密码"
                            className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 h-10 sm:h-12 rounded-xl backdrop-blur-sm hover:bg-slate-700/50 pr-12"
                            value={newEntry.password}
                            onChange={(e) => setNewEntry({ ...newEntry, password: e.target.value })}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-all duration-300 hover:scale-110"
                          >
                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => generatePassword(false)}
                          className="border-slate-600/50 text-slate-300 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:border-purple-500/50 transition-all duration-300 h-10 sm:h-12 px-2 sm:px-4 rounded-xl backdrop-blur-sm hover:scale-105"
                        >
                          <Key className="h-4 w-4 sm:mr-1" />
                          <span className="hidden sm:inline">生成</span>
                        </Button>
                      </div>
                      {newEntry.password && (
                        <div className="flex items-center gap-3 animate-slide-in-up">
                          <div className="flex-1 bg-slate-800/30 rounded-lg p-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-slate-400">密码强度</span>
                              <span
                                className={`text-xs font-medium ${
                                  getPasswordStrength(newEntry.password).level === "强"
                                    ? "text-green-400"
                                    : getPasswordStrength(newEntry.password).level === "中"
                                      ? "text-yellow-400"
                                      : "text-red-400"
                                }`}
                              >
                                {getPasswordStrength(newEntry.password).level}
                              </span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${getPasswordStrength(newEntry.password).color}`}
                                style={{
                                  width:
                                    getPasswordStrength(newEntry.password).level === "强"
                                      ? "100%"
                                      : getPasswordStrength(newEntry.password).level === "中"
                                        ? "60%"
                                        : "30%",
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 网站链接 */}
                    <div className="group space-y-2">
                      <Label htmlFor="url" className="text-slate-200 text-sm font-medium flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full"></div>
                        网站链接 <span className="text-slate-500 text-xs">(可选)</span>
                      </Label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                          id="url"
                          placeholder="https://example.com"
                          className="pl-12 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 h-10 sm:h-12 rounded-xl backdrop-blur-sm hover:bg-slate-700/50"
                          value={newEntry.url}
                          onChange={(e) => setNewEntry({ ...newEntry, url: e.target.value })}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                      className="w-full sm:flex-1 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-300 h-10 sm:h-12 rounded-xl backdrop-blur-sm hover:scale-[1.02]"
                    >
                      <X className="h-4 w-4 mr-2" />
                      取消
                    </Button>
                    <Button
                      onClick={handleAddPassword}
                      className="w-full sm:flex-1 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white h-10 sm:h-12 rounded-xl shadow-lg hover:shadow-xl hover:shadow-rose-500/25 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      保存密码
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* 密码卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // 加载骨架屏
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-slate-700 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-700 rounded mb-2"></div>
                      <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-slate-700 rounded"></div>
                    <div className="h-3 bg-slate-700 rounded w-3/4"></div>
                    <div className="flex gap-2 mt-4">
                      <div className="h-8 bg-slate-700 rounded flex-1"></div>
                      <div className="h-8 w-8 bg-slate-700 rounded"></div>
                      <div className="h-8 w-8 bg-slate-700 rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredPasswords.length === 0 ? (
            <div className="col-span-full">
              <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-slate-600/20 to-slate-500/20 rounded-full flex items-center justify-center mb-6">
                    <Key className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-300 mb-2">
                    {searchTerm ? "没有找到匹配的记录" : "还没有添加任何密码"}
                  </h3>
                  <p className="text-slate-500 mb-6">
                    {searchTerm ? "尝试使用不同的搜索词" : "开始添加您的第一个密码来保护您的账户"}
                  </p>
                  {!searchTerm && (
                    <Button
                      onClick={() => setIsAddDialogOpen(true)}
                      className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      添加第一个密码
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredPasswords.map((entry, index) => {
              const strength = getPasswordStrength(entry.password)
              return (
                <Card
                  key={entry.id}
                  className="group bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20 animate-slide-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-0 overflow-hidden">
                    {/* 卡片头部 - 始终可见 */}
                    <div className="p-4 cursor-pointer select-none" onClick={() => toggleCardExpansion(entry.id)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-r from-rose-500/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-rose-500/20 group-hover:border-rose-500/40 transition-all duration-300">
                              <span className="text-sm font-bold text-rose-400 group-hover:text-rose-300 transition-colors duration-300">
                                {entry.platform.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">
                              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-base truncate group-hover:text-rose-300 transition-colors duration-300">
                              {entry.platform}
                            </h3>
                            <p className="text-slate-400 text-xs truncate">{entry.username}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* 密码强度指示器 */}
                          <Badge
                            variant="outline"
                            className={`${strength.color} text-white border-0 text-xs px-2 py-1 group-hover:scale-110 transition-transform duration-300`}
                          >
                            {strength.level}
                          </Badge>

                          {/* 展开/收缩按钮 */}
                          <div
                            className={`transform transition-transform duration-300 ${expandedCards[entry.id] ? "rotate-180" : "rotate-0"}`}
                          >
                            <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-200" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 可展开的详细内容 */}
                    <div
                      className={`transition-all duration-500 ease-in-out overflow-hidden ${
                        expandedCards[entry.id] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-4 pb-4 space-y-3">
                        {/* 密码显示区域 */}
                        <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 group-hover:border-slate-600/50 transition-all duration-300 transform hover:scale-[1.01]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <Key className="h-3 w-3" />
                              密码
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-slate-400 hover:text-white transition-all duration-300 hover:scale-110"
                              onClick={(e) => {
                                e.stopPropagation()
                                togglePasswordVisibility(entry.id)
                              }}
                            >
                              {showPassword[entry.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-mono text-sm flex-1 truncate bg-slate-800/50 px-2 py-1 rounded">
                              {showPassword[entry.id] ? entry.password : "••••••••••••"}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-slate-400 hover:text-green-400 transition-all duration-300 hover:scale-110"
                              onClick={(e) => {
                                e.stopPropagation()
                                copyToClipboard(entry.password, "password", entry.platform)
                              }}
                            >
                              {copySuccess === `password-${entry.id}` ? (
                                <CheckCircle className="h-3 w-3 text-green-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* 用户名显示区域 */}
                        <div className="p-3 bg-slate-900/30 rounded-lg border border-slate-700/30 group-hover:border-slate-600/30 transition-all duration-300 transform hover:scale-[1.01]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <User className="h-3 w-3" />
                              用户名
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-300 text-sm flex-1 truncate bg-slate-800/30 px-2 py-1 rounded">
                              {entry.username}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-slate-400 hover:text-green-400 transition-all duration-300 hover:scale-110"
                              onClick={(e) => {
                                e.stopPropagation()
                                copyToClipboard(entry.username, "username", entry.platform)
                              }}
                            >
                              {copySuccess === `username-${entry.id}` ? (
                                <CheckCircle className="h-3 w-3 text-green-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* 网站链接（如果有） */}
                        {entry.url && (
                          <div className="p-3 bg-slate-900/20 rounded-lg border border-slate-700/20 transition-all duration-300 transform hover:scale-[1.01]">
                            <div className="flex items-center gap-2">
                              <Globe className="h-3 w-3 text-slate-400" />
                              <a
                                href={entry.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-sm truncate transition-colors duration-300"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {entry.url}
                              </a>
                            </div>
                          </div>
                        )}

                        {/* 时间信息 */}
                        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-700/30">
                          <span>创建: {new Date(entry.created_at).toLocaleDateString("zh-CN")}</span>
                          <span>更新: {new Date(entry.updated_at).toLocaleDateString("zh-CN")}</span>
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex gap-2 pt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-300 hover:scale-[1.02]"
                            onClick={(e) => {
                              e.stopPropagation()
                              openEditDialog(entry)
                            }}
                          >
                            <Edit className="h-3 w-3 mr-2" />
                            编辑
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 hover:scale-[1.02]"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteConfirm({
                                open: true,
                                id: entry.id,
                                platform: entry.platform,
                              })
                            }}
                          >
                            <Trash2 className="h-3 w-3 mr-2" />
                            删除
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* 悬浮时的装饰效果 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-purple-600/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </main>

      {/* 编辑密码对话框 */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open)
          if (!open) {
            setShowEditPassword(false)
            setEditEntry(null)
          }
        }}
      >
        <DialogContent className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-600/50 text-white w-[95vw] max-w-md mx-auto shadow-2xl backdrop-blur-xl sm:w-full max-h-[85vh] overflow-y-auto hide-scrollbar">
          {/* 装饰性背景 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-purple-500/5 rounded-lg"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 rounded-t-lg"></div>

          <div className="relative z-10">
            <DialogHeader className="text-center pb-2 sm:pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500/20 to-cyan-600/20 rounded-2xl flex items-center justify-center border border-blue-500/30 backdrop-blur-sm">
                    <Edit className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                编辑密码
              </DialogTitle>
              <p className="text-slate-400 text-sm mt-2">更新您的账户信息</p>
            </DialogHeader>

            {editEntry && (
              <div className="grid gap-3 sm:gap-4 py-2 sm:py-3">
                {/* 平台名称 */}
                <div className="group space-y-2">
                  <Label htmlFor="edit-platform" className="text-slate-200 text-sm font-medium flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full"></div>
                    平台名称 *
                  </Label>
                  <div className="relative">
                    <Input
                      id="edit-platform"
                      placeholder="如：微信、支付宝、淘宝等"
                      className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 h-10 sm:h-12 rounded-xl backdrop-blur-sm hover:bg-slate-700/50"
                      value={editEntry.platform}
                      onChange={(e) => setEditEntry({ ...editEntry, platform: e.target.value })}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* 用户名 */}
                <div className="group space-y-2">
                  <Label htmlFor="edit-username" className="text-slate-200 text-sm font-medium flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full"></div>
                    用户名/邮箱 *
                  </Label>
                  <div className="relative">
                    <Input
                      id="edit-username"
                      placeholder="账号用户名或邮箱"
                      className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 h-10 sm:h-12 rounded-xl backdrop-blur-sm hover:bg-slate-700/50"
                      value={editEntry.username}
                      onChange={(e) => setEditEntry({ ...editEntry, username: e.target.value })}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* 密码 */}
                <div className="group space-y-2">
                  <Label htmlFor="edit-password" className="text-slate-200 text-sm font-medium flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
                    密码 *
                  </Label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Input
                        id="edit-password"
                        type={showEditPassword ? "text" : "password"}
                        placeholder="账号密码"
                        className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 h-10 sm:h-12 rounded-xl backdrop-blur-sm hover:bg-slate-700/50 pr-12"
                        value={editEntry.password}
                        onChange={(e) => setEditEntry({ ...editEntry, password: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowEditPassword(!showEditPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-all duration-300 hover:scale-110"
                      >
                        {showEditPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => generatePassword(true)}
                      className="border-slate-600/50 text-slate-300 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-cyan-500/20 hover:border-blue-500/50 transition-all duration-300 h-10 sm:h-12 px-2 sm:px-4 rounded-xl backdrop-blur-sm hover:scale-105"
                    >
                      <Key className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">生成</span>
                    </Button>
                  </div>
                  {editEntry.password && (
                    <div className="flex items-center gap-3 animate-slide-in-up">
                      <div className="flex-1 bg-slate-800/30 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-400">密码强度</span>
                          <span
                            className={`text-xs font-medium ${
                              getPasswordStrength(editEntry.password).level === "强"
                                ? "text-green-400"
                                : getPasswordStrength(editEntry.password).level === "中"
                                  ? "text-yellow-400"
                                  : "text-red-400"
                            }`}
                          >
                            {getPasswordStrength(editEntry.password).level}
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${getPasswordStrength(editEntry.password).color}`}
                            style={{
                              width:
                                getPasswordStrength(editEntry.password).level === "强"
                                  ? "100%"
                                  : getPasswordStrength(editEntry.password).level === "中"
                                    ? "60%"
                                    : "30%",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 网站链接 */}
                <div className="group space-y-2">
                  <Label htmlFor="edit-url" className="text-slate-200 text-sm font-medium flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"></div>
                    网站链接 <span className="text-slate-500 text-xs">(可选)</span>
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="edit-url"
                      placeholder="https://example.com"
                      className="pl-12 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 h-10 sm:h-12 rounded-xl backdrop-blur-sm hover:bg-slate-700/50"
                      value={editEntry.url}
                      onChange={(e) => setEditEntry({ ...editEntry, url: e.target.value })}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false)
                  setEditEntry(null)
                }}
                className="w-full sm:flex-1 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-300 h-10 sm:h-12 rounded-xl backdrop-blur-sm hover:scale-[1.02]"
                disabled={editLoading}
              >
                <X className="h-4 w-4 mr-2" />
                取消
              </Button>
              <Button
                onClick={handleEditPassword}
                disabled={editLoading}
                className="w-full sm:flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white h-10 sm:h-12 rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02]"
              >
                {editLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    更新中...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    保存更改
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}
        title="确认删除"
        description={`您确定要删除 "${deleteConfirm.platform}" 的密码吗？此操作无法撤销。`}
        confirmText="删除"
        cancelText="取消"
        variant="destructive"
        onConfirm={handleDeletePassword}
        loading={deleteLoading}
      />
    </div>
  )
}

