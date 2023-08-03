import supabaseClient from 'utils/supabaseClient'

/**
 * requests from the supabases auto generated api
 * implementation - https://github.com/supabase/postgrest-js/blob/master/src/PostgrestClient.ts
 */
export const generatedRequests = {
  getMessages: async () => {
    const response = await supabaseClient
      .from('Messages')
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
      .limit(10)
      .order('created_at', { ascending: false })
    if (response.error) console.error('Error getting session:', response.error)

    return response // newest messages are at the bottom
  },
}
