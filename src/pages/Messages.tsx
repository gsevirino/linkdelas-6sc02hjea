import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  MessageSquare,
  Send,
  User,
  CheckCheck,
  Check,
  Sparkles,
  FileText,
  Clock,
  Calendar,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { getQuotes } from '@/services/quotes'
import { getQuoteMessages, sendMessage, markMessagesAsRead } from '@/services/messages'
import { useRealtime } from '@/hooks/use-realtime'
import type { QuoteRecord, MessageRecord } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export default function Messages() {
  const { user } = useAuth()
  const [quotes, setQuotes] = useState<QuoteRecord[]>([])
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageRecord[]>([])
  const [inputContent, setInputContent] = useState('')
  const [loadingQuotes, setLoadingQuotes] = useState(true)
  const [sending, setSending] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch threads (quotes)
  const loadThreads = () => {
    if (!user) return
    getQuotes().then((data) => {
      setQuotes(data)
      setLoadingQuotes(false)
      if (data.length > 0 && !selectedQuoteId) {
        setSelectedQuoteId(data[0].id)
      }
    })
  }

  useEffect(() => {
    loadThreads()
  }, [user])

  // Fetch messages when thread changes
  const loadMessages = (qId: string) => {
    getQuoteMessages(qId).then((data) => {
      setMessages(data)
      markMessagesAsRead(qId)
    })
  }

  useEffect(() => {
    if (selectedQuoteId) {
      loadMessages(selectedQuoteId)
    }
  }, [selectedQuoteId])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Realtime subscription on messages
  useRealtime<MessageRecord>('messages', (sub) => {
    if (selectedQuoteId && sub.record.quote === selectedQuoteId) {
      loadMessages(selectedQuoteId)
    }
  })

  // Selected thread quote record
  const selectedQuote = quotes.find((q) => q.id === selectedQuoteId)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputContent.trim() || !selectedQuote || !user) return

    const recipientId =
      user.id === selectedQuote.client ? selectedQuote.provider : selectedQuote.client

    setSending(true)
    try {
      await sendMessage({
        quoteId: selectedQuote.id,
        recipientId,
        content: inputContent.trim(),
      })
      setInputContent('')
      loadMessages(selectedQuote.id)
    } catch (err) {
      console.error('Falha ao enviar mensagem:', err)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto animate-fade-in">
      <div className="pb-2 border-b border-[#E5DFE3]">
        <h1 className="text-2xl font-bold tracking-tight text-[#2D2A32]">
          Mensagens e Negociações
        </h1>
        <p className="text-xs text-[#6E6A73] mt-0.5">
          Converse em tempo real com prestadoras e clientes com segurança e privacidade.
        </p>
      </div>

      {loadingQuotes ? (
        <div className="h-96 rounded-2xl bg-white animate-pulse" />
      ) : quotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5DFE3] p-12 text-center space-y-3">
          <MessageSquare className="w-10 h-10 text-[#6E6A73] mx-auto" />
          <h3 className="font-bold text-base text-[#2D2A32]">Nenhuma conversa iniciada</h3>
          <p className="text-xs text-[#6E6A73] max-w-sm mx-auto">
            As conversas são abertas automaticamente a partir de um orçamento solicitado. Envie uma
            solicitação no catálogo para começar.
          </p>
          <Button asChild className="bg-[#7E3F8F] hover:bg-[#6B347A] text-white">
            <Link to="/catalogo">Encontrar prestadoras</Link>
          </Button>
        </div>
      ) : (
        /* Two-pane layout */
        <div className="bg-white rounded-2xl border border-[#E5DFE3] shadow-xs grid grid-cols-1 md:grid-cols-12 min-h-[580px] overflow-hidden">
          {/* Left Pane: Threads List */}
          <div className="md:col-span-4 border-r border-[#E5DFE3] flex flex-col bg-[#FAF7F5]/50">
            <div className="p-3.5 border-b border-[#E5DFE3] bg-white">
              <span className="font-bold text-xs uppercase tracking-wider text-[#6E6A73]">
                Conversas por Orçamento ({quotes.length})
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#FAF7F5]">
              {quotes.map((q) => {
                const isSelected = q.id === selectedQuoteId
                const other = user?.id === q.client ? q.expand?.provider : q.expand?.client
                const otherRole = user?.id === q.client ? 'Prestadora' : 'Cliente'

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setSelectedQuoteId(q.id)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                      isSelected
                        ? 'bg-white border-l-4 border-l-[#7E3F8F] shadow-xs'
                        : 'hover:bg-white/80'
                    }`}
                  >
                    <Avatar className="w-10 h-10 shrink-0">
                      <AvatarFallback className="bg-[#F3EEF0] text-[#7E3F8F] text-xs font-bold">
                        {other?.name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-xs text-[#2D2A32] truncate">
                          {other?.name || 'Usuária'}
                        </span>
                        <span className="text-[10px] text-[#6E6A73]">
                          {new Date(q.created).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                          })}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#7E3F8F] font-medium truncate mt-0.5">
                        {q.expand?.category?.name || 'Serviço'}
                      </p>

                      <p className="text-xs text-[#6E6A73] truncate mt-1">{q.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Pane: Chat Canvas */}
          <div className="md:col-span-8 flex flex-col bg-white">
            {selectedQuote ? (
              <>
                {/* Chat Top Bar */}
                <div className="p-3.5 border-b border-[#E5DFE3] flex items-center justify-between gap-2 bg-white">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="bg-[#7E3F8F] text-white text-xs font-bold">
                        {(user?.id === selectedQuote.client
                          ? selectedQuote.expand?.provider?.name?.[0]
                          : selectedQuote.expand?.client?.name?.[0]) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-sm text-[#2D2A32] leading-tight">
                        {user?.id === selectedQuote.client
                          ? selectedQuote.expand?.provider?.name
                          : selectedQuote.expand?.client?.name}
                      </h3>
                      <p className="text-[11px] text-[#6E6A73]">
                        {selectedQuote.expand?.category?.name || 'Negociação'} • Status:{' '}
                        <strong className="text-[#7E3F8F] capitalize">
                          {selectedQuote.status}
                        </strong>
                      </p>
                    </div>
                  </div>

                  <Button asChild size="sm" variant="outline" className="text-xs border-[#E5DFE3]">
                    <Link to={`/orcamentos/${selectedQuote.id}`}>
                      <FileText className="w-3.5 h-3.5 mr-1 text-[#7E3F8F]" />
                      Ver proposta
                    </Link>
                  </Button>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF7F5]/40 max-h-[460px]">
                  {/* Context quote info banner */}
                  <div className="p-3 rounded-xl bg-white border border-[#E5DFE3] text-xs space-y-1 shadow-2xs">
                    <span className="font-semibold text-[#7E3F8F] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Solicitação Inicial do Orçamento
                    </span>
                    <p className="text-[#2D2A32] whitespace-pre-line leading-relaxed">
                      {selectedQuote.description}
                    </p>
                    {selectedQuote.price && (
                      <div className="pt-1 text-xs font-semibold text-[#2E7D32]">
                        Proposta atual: R$ {selectedQuote.price.toFixed(2).replace('.', ',')}
                      </div>
                    )}
                  </div>

                  {messages.length === 0 ? (
                    <div className="text-center py-10 text-xs text-[#6E6A73]">
                      Nenhuma mensagem enviada nesta conversa ainda. Inicie o diálogo abaixo!
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMe = m.sender === user?.id
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-2xs ${
                              isMe
                                ? 'bg-[#7E3F8F] text-white rounded-br-xs'
                                : 'bg-white text-[#2D2A32] border border-[#E5DFE3] rounded-bl-xs'
                            }`}
                          >
                            <p className="whitespace-pre-line">{m.content}</p>
                          </div>
                          <span className="text-[10px] text-[#6E6A73] px-1 mt-0.5 flex items-center gap-1">
                            {new Date(m.created).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            {isMe && <CheckCheck className="w-3 h-3 text-[#7E3F8F]" />}
                          </span>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 border-t border-[#E5DFE3] flex items-center gap-2 bg-white"
                >
                  <Input
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                    placeholder="Escreva sua mensagem com clareza..."
                    className="flex-1 text-xs h-10 border-[#E5DFE3] focus-visible:ring-[#7E3F8F]"
                  />
                  <Button
                    type="submit"
                    disabled={sending || !inputContent.trim()}
                    className="h-10 px-4 bg-[#7E3F8F] hover:bg-[#6B347A] text-white shadow-2xs"
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Enviar
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6 text-xs text-[#6E6A73]">
                Selecione uma conversa ao lado para visualizar as mensagens
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
