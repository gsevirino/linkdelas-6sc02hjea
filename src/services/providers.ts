import pb from '@/lib/pocketbase/client'
import type { ProviderRecord } from '@/types/database'

export interface ProviderFilters {
  search?: string
  categorySlug?: string
  state?: string
  city?: string
  sort?: 'relevance' | 'rating' | 'recent'
}

export async function getProviders(filters?: ProviderFilters): Promise<ProviderRecord[]> {
  try {
    const filterParts: string[] = []

    if (filters?.city && filters.city.trim()) {
      filterParts.push(`city ~ "${filters.city.trim()}"`)
    }
    if (filters?.state && filters.state.trim() && filters.state !== 'TODOS') {
      filterParts.push(`state = "${filters.state.trim()}"`)
    }
    if (filters?.search && filters.search.trim()) {
      filterParts.push(
        `(service_description ~ "${filters.search.trim()}" || city ~ "${filters.search.trim()}" || locations_served ~ "${filters.search.trim()}")`,
      )
    }

    let sortOption = '-rating_avg'
    if (filters?.sort === 'recent') {
      sortOption = '-created'
    } else if (filters?.sort === 'rating') {
      sortOption = '-rating_avg'
    }

    const records = await pb.collection('providers').getFullList<ProviderRecord>({
      filter: filterParts.length > 0 ? filterParts.join(' && ') : undefined,
      sort: sortOption,
      expand: 'user,categories',
    })

    // Filter by category slug in memory if provided
    let list = records
    if (filters?.categorySlug) {
      list = list.filter((p) => {
        const cats = p.expand?.categories || []
        return cats.some((c) => c.slug === filters.categorySlug || c.id === filters.categorySlug)
      })
    }

    // Additional client search for provider user name or bio
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase()
      list = list.filter((p) => {
        const nameMatch = p.expand?.user?.name?.toLowerCase().includes(q)
        const bioMatch = p.expand?.user?.bio?.toLowerCase().includes(q)
        const descMatch = p.service_description?.toLowerCase().includes(q)
        const cityMatch = p.city?.toLowerCase().includes(q)
        return nameMatch || bioMatch || descMatch || cityMatch
      })
    }

    // Sort order: featured (plan === 'destaque') first, then professional, then essencial
    if (!filters?.sort || filters.sort === 'relevance') {
      list.sort((a, b) => {
        const planWeight = (plan?: string) => {
          if (plan === 'destaque') return 3
          if (plan === 'profissional') return 2
          return 1
        }
        const weightA = planWeight(a.expand?.user?.plan)
        const weightB = planWeight(b.expand?.user?.plan)
        if (weightA !== weightB) {
          return weightB - weightA
        }
        return (b.rating_avg || 0) - (a.rating_avg || 0)
      })
    }

    return list
  } catch (error) {
    console.error('Erro ao buscar prestadoras:', error)
    return []
  }
}

export async function getProviderById(id: string): Promise<ProviderRecord | null> {
  try {
    // Check if id is a provider id or user id
    try {
      const record = await pb.collection('providers').getOne<ProviderRecord>(id, {
        expand: 'user,categories',
      })
      return record
    } catch {
      // Try finding by user relation
      const record = await pb
        .collection('providers')
        .getFirstListItem<ProviderRecord>(`user="${id}"`, {
          expand: 'user,categories',
        })
      return record
    }
  } catch (error) {
    console.error('Prestadora não encontrada:', error)
    return null
  }
}

export function getFileUrl(
  collectionIdOrName: string,
  recordId: string,
  filename?: string,
): string {
  if (!filename) return ''
  return pb.files.getURL({ id: recordId, collectionName: collectionIdOrName } as any, filename)
}
