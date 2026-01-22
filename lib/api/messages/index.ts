import { conversations } from './conversations'
import { messages } from './messages'

export const messagesApi = {
    ...conversations,
    ...messages,
    // Alias from original
    getConversations: conversations.getConversationsForUser
}

export * from './types'
