"use client"

import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
  initialize: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,

  initialize: async () => {
    if (get().initialized) return

    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    set({ user, loading: false, initialized: true })

    supabase.auth.onAuthStateChange((event, session) => {
      set({ user: session?.user ?? null, loading: false })
    })
  },

  signOut: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    set({ user: null })
  },
}))