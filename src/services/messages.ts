import pb from '@/lib/pocketbase/client'
import type { MessageRecord } from '@/types/database'

export async function getQuoteMessages(quoteId: string): Promise<MessageRecord[]> {
  try {
    const records = await pb.collection('messages').getFullList<MessageRecord>({
      filter: `quote = "${quoteId}"`,
      sort: 'created',
      expand: 'sender,recipient',
    })
    return records
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error)
    return []
  }
}

export async function sendMessage(data: {
  quoteId: string
  recipientId: string
  content: string
}): Promise<MessageRecord> {
  const currentUserId = pb.authStore.record?.id
  if (!currentUserId) throw new Error('Não autenticado.')

  const record = await pb.collection('messages').create<MessageRecord>({
    quote: data.quoteId,
    sender: currentUserId,
    recipient: data.recipientId,
    content: data.content,
    read: false,
  })
  return record
}

export async function markMessagesAsRead(quoteId: string): Promise<void> {
  const currentUserId = pb.authStore.record?.id
  if (!currentUserId) return

  try {
    const unread = await pb.collection('messages').getFullList<MessageRecord>({
      filter: `quote = "${quoteId}" && recipient = "${currentUserId}" && read = false`,
    })
    for (const msg of unread) {
      await pb.collection('messages').update(msg.id, { read: true })
    }
  } catch (error) {
    console.error('Erro ao marcar lidas:', error)
  }
}
