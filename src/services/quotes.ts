import pb from '@/lib/pocketbase/client'
import type { QuoteRecord, QuoteStatus } from '@/types/database'

export interface CreateQuoteData {
  providerId: string
  categoryId?: string
  description: string
  preferredDate?: string
  attachmentFile?: File
}

export async function createQuote(data: CreateQuoteData): Promise<QuoteRecord> {
  const currentUserId = pb.authStore.record?.id
  if (!currentUserId) {
    throw new Error('Você precisa estar conectada para solicitar orçamento.')
  }

  const formData = new FormData()
  formData.append('client', currentUserId)
  formData.append('provider', data.providerId)
  if (data.categoryId) formData.append('category', data.categoryId)
  formData.append('description', data.description)
  formData.append('status', 'pendente')
  if (data.preferredDate) {
    formData.append('preferred_date', new Date(data.preferredDate).toISOString())
  }
  if (data.attachmentFile) {
    formData.append('attachment', data.attachmentFile)
  }

  const record = await pb.collection('quotes').create<QuoteRecord>(formData)
  return record
}

export async function getQuotes(role?: 'cliente' | 'prestadora'): Promise<QuoteRecord[]> {
  const currentUserId = pb.authStore.record?.id
  if (!currentUserId) return []

  try {
    const filter =
      role === 'prestadora'
        ? `provider = "${currentUserId}"`
        : role === 'cliente'
          ? `client = "${currentUserId}"`
          : `client = "${currentUserId}" || provider = "${currentUserId}"`

    const records = await pb.collection('quotes').getFullList<QuoteRecord>({
      filter,
      sort: '-created',
      expand: 'client,provider,category',
    })
    return records
  } catch (error) {
    console.error('Erro ao buscar orçamentos:', error)
    return []
  }
}

export async function getQuoteById(id: string): Promise<QuoteRecord | null> {
  try {
    const record = await pb.collection('quotes').getOne<QuoteRecord>(id, {
      expand: 'client,provider,category',
    })
    return record
  } catch (error) {
    console.error('Erro ao carregar orçamento:', error)
    return null
  }
}

export async function respondQuote(
  quoteId: string,
  price: number,
  response: string,
): Promise<QuoteRecord> {
  const record = await pb.collection('quotes').update<QuoteRecord>(quoteId, {
    price,
    response,
    status: 'respondido' as QuoteStatus,
  })
  return record
}

export async function updateQuoteStatus(
  quoteId: string,
  status: QuoteStatus,
): Promise<QuoteRecord> {
  const record = await pb.collection('quotes').update<QuoteRecord>(quoteId, {
    status,
  })
  return record
}
