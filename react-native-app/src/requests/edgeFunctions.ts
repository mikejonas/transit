import supabaseClient from 'utils/supabaseClient'

interface NewMessageParams {
  newMessage: string
  conversationId: number
}

/**
 * edge functions we created
 * implementation - https://github.com/supabase/functions-js/blob/main/src/types.ts#L44
 */
export const edgeFunctionRequests = {
  addMessage: async ({ newMessage, conversationId }: NewMessageParams) => {
    const response = await supabaseClient.functions.invoke('add-message', {
      body: JSON.stringify({
        new_message: newMessage,
        conversation_id: conversationId,
      }),
    })
    if (response.error) {
      console.error('Error adding message:', response.error)
    }

    return response
  },
}
