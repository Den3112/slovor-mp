import * as z from 'zod'

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, {
      message: 'Správa nemôže byť prázdna.',
    })
    .max(2000, {
      message: 'Správa môže mať maximálne 2000 znakov.',
    }),
  conversationId: z.string(),
  attachments: z.array(z.string()).optional(),
})

export type MessageInput = z.infer<typeof messageSchema>

export const conversationSchema = z.object({
  listingId: z.string(),
  sellerId: z.string(),
  buyerId: z.string(),
})

export type ConversationInput = z.infer<typeof conversationSchema>
