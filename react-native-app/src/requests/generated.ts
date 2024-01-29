import { PostgrestError } from '@supabase/supabase-js'
import supabaseClient from 'utils/supabaseClient'

const TABLES = {
  messages: 'Messages',
  userDetails: 'User Details',
  conversation: 'Conversations',
}

const handleSupabaseRequestError = async (message: string, error: PostgrestError) => {
  const constructedError = new Error(`${message}: ${error.message}`)
  console.error(constructedError)
  throw constructedError
}

/**
 * requests from the supabases auto generated api
 * implementation - https://github.com/supabase/postgrest-js/blob/master/src/PostgrestClient.ts
 */
export const generatedRequests = {
  getMessages: async ({ conversationId }: { conversationId: number }) => {
    const response = await supabaseClient
      .from(TABLES.messages)
      .select(
        `
          conversation_id,
          message_id,
          role,
          created_at,
          content,
          user_id
        `,
      )
      .neq('role', 'system')
      .eq('conversation_id', conversationId)
      .limit(10)
      .order('created_at', { ascending: false })
    if (response.error) handleSupabaseRequestError('Error getting messages:', response.error)

    return response // newest messages are at the bottom
  },
  getUserDetails: async () => {
    const response = await supabaseClient
      .from(TABLES.userDetails)
      .select(
        `
        user_id
      `,
      )
      .maybeSingle()
    if (response.error) handleSupabaseRequestError('Error getting user details:', response.error)

    return response
  },
  getConversations: async () => {
    // filtered by user_id
    const response = await supabaseClient
      .from(TABLES.conversation)
      .select(
        `
        conversation_id
      `,
      )
    if (response.error) handleSupabaseRequestError('Error getting conversation:', response.error)

    return response
  },
  getConversation: async () => {
    // filtered by user_id
    const response = await supabaseClient
      .from(TABLES.conversation)
      .select(
        `
        conversation_id,
      `,
      )
      .maybeSingle()
    if (response.error) handleSupabaseRequestError('Error getting conversation:', response.error)

    return response
  },
}
