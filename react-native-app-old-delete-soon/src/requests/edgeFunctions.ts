import { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from '@supabase/supabase-js'
import supabaseClient from 'utils/supabaseClient'

interface NewMessageParams {
  newMessage: string
  conversationId: number
}

const handleEdgeFunctionRequestError = async (
  message: string,
  error: FunctionsHttpError | FunctionsRelayError | FunctionsFetchError,
) => {
  let errorMessage = 'Unknown error type'

  if (error instanceof FunctionsHttpError) {
    error = await error.context.json()
    errorMessage = JSON.stringify(error)
  } else if (error instanceof FunctionsRelayError) {
    errorMessage = 'Relay error: ' + error.message
  } else if (error instanceof FunctionsFetchError) {
    errorMessage = 'Fetch error: ' + error.message
  }

  const constructedError = new Error(`${message}: ${errorMessage}`)
  console.error(constructedError)
  throw constructedError
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
      await handleEdgeFunctionRequestError('Error adding message', response.error)
    }
    return response
  },
  addUserDetails: async ({ name, birthDate }: { name: string; birthDate: Date }) => {
    const response = await supabaseClient.functions.invoke('add-user-details', {
      body: JSON.stringify({
        name,
        birth_date: birthDate,
      }),
    })

    if (response.error) {
      await handleEdgeFunctionRequestError('Error adding user details:', response.error)
    }
    return response
  },
  newConversation: async () => {
    const response = await supabaseClient.functions.invoke('new-conversation')

    if (response.error) {
      await handleEdgeFunctionRequestError('Error starting new conversation:', response.error)
    }
    return response
  },
  startConversation: async ({ conversationId }: { conversationId: number }) => {
    const response = await supabaseClient.functions.invoke('start-conversation', {
      body: JSON.stringify({ conversation_id: conversationId }),
    })

    if (response.error) {
      await handleEdgeFunctionRequestError('Error starting conversation:', response.error)
    }
    return response
  },
}
