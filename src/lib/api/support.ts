import { supabase } from '@/lib/supabase/client'
import { logError } from '@/lib/utils/logger'
import type { ApiResponse } from '@/lib/types/database'
import { notificationsApi } from './notifications'

export interface SupportTicket {
  id: string
  user_id: string
  subject: string
  message: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: 'general' | 'billing' | 'technical' | 'safety' | 'other'
  created_at: string
  updated_at: string
  user?: {
    display_name: string
    avatar_url: string
    email: string
  }
}

export interface SupportMessage {
  id: string
  ticket_id: string
  user_id: string
  message: string
  is_admin: boolean
  created_at: string
}

export const supportApi = {
  async createTicket(
    ticket: Omit<SupportTicket, 'id' | 'created_at' | 'updated_at' | 'status'>
  ): Promise<ApiResponse<SupportTicket>> {
    try {
      let userId = ticket.user_id
      if (!userId) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')
        userId = user.id
      }

      const { data, error } = await supabase
        .from('support_tickets')
        .insert([{ ...ticket, user_id: userId, status: 'open' }])
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      logError('supportApi.createTicket', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async getMyTickets(): Promise<ApiResponse<SupportTicket[]>> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      logError('supportApi.getMyTickets', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async getTicket(id: string): Promise<ApiResponse<SupportTicket>> {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*, user:profiles(display_name, avatar_url, email)')
        .eq('id', id)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      logError('supportApi.getTicket', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async getMessages(ticketId: string): Promise<ApiResponse<SupportMessage[]>> {
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      logError('supportApi.getMessages', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async sendMessage(
    ticketId: string,
    message: string,
    isAdmin = false
  ): Promise<ApiResponse<SupportMessage>> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('support_messages')
        .insert([
          {
            ticket_id: ticketId,
            user_id: user.id,
            message,
            is_admin: isAdmin,
          },
        ])
        .select()
        .single()

      if (error) throw error

      // Update ticket status if it's an admin reply
      if (isAdmin) {
        // Fetch ticket to get user_id for notification
        const { data: ticket } = await supabase
          .from('support_tickets')
          .select('user_id, subject')
          .eq('id', ticketId)
          .single()

        if (ticket) {
          await notificationsApi.create({
            user_id: ticket.user_id,
            type: 'system',
            title: 'Support Ticket Reply',
            content: `Support has replied to your ticket: ${ticket.subject}`,
            link: `/dashboard/support/${ticketId}`,
            metadata: { ticket_id: ticketId },
          })
        }

        await supabase
          .from('support_tickets')
          .update({
            status: 'in_progress',
            updated_at: new Date().toISOString(),
          })
          .eq('id', ticketId)
      } else {
        await supabase
          .from('support_tickets')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', ticketId)
      }

      return { data, error: null }
    } catch (error) {
      logError('supportApi.sendMessage', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async getAllTickets(): Promise<ApiResponse<SupportTicket[]>> {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*, user:profiles(display_name, avatar_url, email)')
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      logError('supportApi.getAllTickets', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async updateStatus(
    id: string,
    status: SupportTicket['status']
  ): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      return { data: null, error: null }
    } catch (error) {
      logError('supportApi.updateStatus', error)
      return { data: null, error: (error as Error).message }
    }
  },
}
