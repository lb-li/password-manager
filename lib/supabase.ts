import { createClient } from "@supabase/supabase-js"
import { encrypt, decrypt } from "./encryption"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 定义密码条目类型
export interface PasswordEntry {
  id: string
  user_id: string
  platform: string
  username: string
  password: string
  url?: string
  created_at: string
  updated_at: string
}

// 加密密码条目
export function encryptPasswordEntry(entry: Omit<PasswordEntry, 'id' | 'created_at' | 'updated_at'>) {
  return {
    ...entry,
    password: encrypt(entry.password)
  };
}

// 解密密码条目
export function decryptPasswordEntry(entry: PasswordEntry): PasswordEntry {
  return {
    ...entry,
    password: decrypt(entry.password)
  };
}

