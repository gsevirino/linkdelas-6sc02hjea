export type UserRole = 'cliente' | 'prestadora'
export type UserStatus = 'pending' | 'approved' | 'rejected'
export type ProviderPlan = 'essencial' | 'profissional' | 'destaque'

import type { RecordModel } from 'pocketbase'

export interface UserRecord extends RecordModel {
  email: string
  name: string
  avatar?: string
  role?: UserRole
  phone?: string
  city?: string
  state?: string
  bio?: string
  status?: UserStatus
  plan?: ProviderPlan
  verified?: boolean
  categories?: string[]
}

export interface CategoryRecord extends RecordModel {
  name: string
  slug: string
  icon?: string
}

export interface ProviderRecord extends RecordModel {
  user: string
  categories?: string[]
  service_description?: string
  city?: string
  state?: string
  locations_served?: string
  gallery?: string[]
  rating_avg?: number
  review_count?: number
  expand?: {
    user?: UserRecord
    categories?: CategoryRecord[]
  }
}

export type QuoteStatus = 'pendente' | 'respondido' | 'aprovado' | 'recusado' | 'concluido'

export interface QuoteRecord extends RecordModel {
  client: string
  provider: string
  category?: string
  description: string
  attachment?: string
  preferred_date?: string
  status: QuoteStatus
  price?: number
  response?: string
  expand?: {
    client?: UserRecord
    provider?: UserRecord
    category?: CategoryRecord
  }
}

export interface ReviewRecord extends RecordModel {
  client: string
  provider: string
  quote?: string
  rating: number
  comment?: string
  expand?: {
    client?: UserRecord
  }
}

export interface MessageRecord extends RecordModel {
  quote: string
  sender: string
  recipient: string
  content: string
  read?: boolean
  expand?: {
    sender?: UserRecord
    recipient?: UserRecord
  }
}
