import pb from '@/lib/pocketbase/client'
import type { ReviewRecord } from '@/types/database'

export async function getProviderReviews(providerUserId: string): Promise<ReviewRecord[]> {
  try {
    const records = await pb.collection('reviews').getFullList<ReviewRecord>({
      filter: `provider = "${providerUserId}"`,
      sort: '-created',
      expand: 'client',
    })
    return records
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error)
    return []
  }
}

export async function createReview(data: {
  providerUserId: string
  rating: number
  comment: string
  quoteId?: string
}): Promise<ReviewRecord> {
  const currentUserId = pb.authStore.record?.id
  if (!currentUserId) throw new Error('Faça login para avaliar.')

  const record = await pb.collection('reviews').create<ReviewRecord>({
    client: currentUserId,
    provider: data.providerUserId,
    rating: data.rating,
    comment: data.comment,
    quote: data.quoteId || null,
  })

  // Recalculate average on provider record
  try {
    const all = await getProviderReviews(data.providerUserId)
    const total = all.reduce((acc, curr) => acc + curr.rating, 0)
    const avg = all.length > 0 ? Number((total / all.length).toFixed(1)) : data.rating
    const providerRecord = await pb
      .collection('providers')
      .getFirstListItem(`user="${data.providerUserId}"`)
    if (providerRecord) {
      await pb.collection('providers').update(providerRecord.id, {
        rating_avg: avg,
        review_count: all.length,
      })
    }
  } catch (e) {
    console.error('Erro ao recalcular média:', e)
  }

  return record
}
