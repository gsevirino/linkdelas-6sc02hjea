import React, { createContext, useContext, useEffect, useState } from 'react'
import pb from '@/lib/pocketbase/client'
import type { UserRecord, UserRole } from '@/types/database'

interface SignUpPayload {
  email: string
  password: string
  name: string
  role: UserRole
  phone?: string
  city?: string
  state?: string
  bio?: string
  categories?: string[]
  serviceDescription?: string
}

interface AuthContextType {
  user: UserRecord | null
  token: string | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (payload: SignUpPayload) => Promise<{ error: any; user?: UserRecord }>
  signOut: () => void
  refreshUser: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<{ error: any }>
  confirmPasswordReset: (token: string, password: string) => Promise<{ error: any }>
  requestVerificationEmail: (email: string) => Promise<{ error: any }>
  confirmVerification: (token: string) => Promise<{ error: any }>
  requestEmailChange: (newEmail: string) => Promise<{ error: any }>
  confirmEmailChange: (token: string, password: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserRecord | null>(
    (pb.authStore.record as unknown as UserRecord) || null,
  )
  const [token, setToken] = useState<string | null>(pb.authStore.token || null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const unsub = pb.authStore.onChange((newToken, record) => {
      setToken(newToken || null)
      setUser((record as unknown as UserRecord) || null)
    })

    if (pb.authStore.isValid && pb.authStore.record) {
      // Re-fetch record to ensure fresh attributes (status, verified, plan, role)
      pb.collection('users')
        .getOne<UserRecord>(pb.authStore.record.id)
        .then((fresh) => {
          setUser(fresh)
          setIsLoading(false)
        })
        .catch(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }

    return () => {
      unsub()
    }
  }, [])

  const refreshUser = async () => {
    if (!pb.authStore.record?.id) return
    try {
      const fresh = await pb.collection('users').getOne<UserRecord>(pb.authStore.record.id)
      setUser(fresh)
    } catch (e) {
      console.error('Erro ao atualizar dados do usuário:', e)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const authData = await pb.collection('users').authWithPassword<UserRecord>(email, password)
      setUser(authData.record)
      setToken(authData.token)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signUp = async (payload: SignUpPayload) => {
    try {
      const isProvider = payload.role === 'prestadora'
      const createdUser = await pb.collection('users').create<UserRecord>({
        email: payload.email,
        password: payload.password,
        passwordConfirm: payload.password,
        name: payload.name,
        role: payload.role,
        phone: payload.phone || '',
        city: payload.city || '',
        state: payload.state || '',
        bio: payload.bio || '',
        status: isProvider ? 'pending' : 'approved',
        plan: isProvider ? 'essencial' : undefined,
        verified: false,
        categories: payload.categories || [],
      })

      // If provider, create the provider profile entity
      if (isProvider) {
        try {
          await pb.collection('providers').create({
            user: createdUser.id,
            categories: payload.categories || [],
            service_description: payload.serviceDescription || payload.bio || '',
            city: payload.city || '',
            state: payload.state || '',
            locations_served: payload.city ? `${payload.city} e região` : '',
            rating_avg: 5.0,
            review_count: 0,
          })
        } catch (e) {
          console.error('Erro ao criar registro de prestadora:', e)
        }
      }

      // Try sending verification email (best effort as instructed in email skill)
      try {
        await pb.collection('users').requestVerification(payload.email)
      } catch (e) {
        console.warn('Falha no envio de verificação por e-mail:', e)
      }

      return { error: null, user: createdUser }
    } catch (error) {
      return { error }
    }
  }

  const signOut = () => {
    pb.authStore.clear()
    setUser(null)
    setToken(null)
  }

  const requestPasswordReset = async (email: string) => {
    try {
      await pb.collection('users').requestPasswordReset(email)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const confirmPasswordReset = async (tokenStr: string, password: string) => {
    try {
      await pb.collection('users').confirmPasswordReset(tokenStr, password, password)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const requestVerificationEmail = async (email: string) => {
    try {
      await pb.collection('users').requestVerification(email)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const confirmVerification = async (tokenStr: string) => {
    try {
      await pb.collection('users').confirmVerification(tokenStr)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const requestEmailChange = async (newEmail: string) => {
    try {
      await pb.collection('users').requestEmailChange(newEmail)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const confirmEmailChange = async (tokenStr: string, password: string) => {
    try {
      await pb.collection('users').confirmEmailChange(tokenStr, password)
      pb.authStore.clear()
      setUser(null)
      setToken(null)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshUser,
        requestPasswordReset,
        confirmPasswordReset,
        requestVerificationEmail,
        confirmVerification,
        requestEmailChange,
        confirmEmailChange,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
