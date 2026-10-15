import pb from '@/lib/pocketbase/client'
import type { CategoryRecord } from '@/types/database'

export async function getCategories(): Promise<CategoryRecord[]> {
  try {
    const records = await pb.collection('categories').getFullList<CategoryRecord>({
      sort: 'name',
    })
    return records
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return []
  }
}
