import { supabase } from "@/lib/supabase"
import { encrypt } from "@/lib/encryption"

async function migratePasswords() {
  console.log("开始加密现有密码...")
  
  try {
    // 获取所有密码
    const { data, error } = await supabase.from("passwords").select("*")
    
    if (error) throw error
    
    console.log(`找到 ${data.length} 条密码记录需要加密`)
    
    // 逐个加密并更新
    for (const entry of data) {
      // 加密密码
      const encryptedPassword = encrypt(entry.password)
      
      // 更新数据库
      const { error: updateError } = await supabase
        .from("passwords")
        .update({ password: encryptedPassword })
        .eq("id", entry.id)
      
      if (updateError) {
        console.error(`更新密码 ID ${entry.id} 失败:`, updateError)
        continue
      }
      
      console.log(`密码 ID ${entry.id} 已加密`)
    }
    
    console.log("所有密码加密完成!")
  } catch (error) {
    console.error("加密过程中出错:", error)
  }
}

// 执行迁移
migratePasswords()

