import { FunctionsFetchError, FunctionsHttpError, FunctionsRelayError } from '@supabase/supabase-js'
import { AutocompletePrediction, LocationAutocompleteResponse } from './utils'
import supabaseClient from 'utils/supabaseClient'
import { awsApiGatewayUrl } from 'utils/config'

const handleLambdaRequestError = async (message: string, error: any) => {
  let errorMessage = 'Unknown error: ' + error.message

  if (error.response) {
    errorMessage = `HTTP error ${error.response.status}: ${JSON.stringify(error.response.data)}`
  }

  const constructedError = new Error(`${message}: ${errorMessage}`)
  console.error(constructedError)
  throw constructedError
}

const getJwtToken = async (): Promise<string> => {
  const { data, error } = await supabaseClient.auth.getSession()

  if (error || !data?.session?.access_token) {
    throw new Error('Failed to get JWT token from Supabase')
  }

  return data.session.access_token
}

export const lambdaFunctionRequests = {
  locationAutocomplete: async ({
    searchQuery,
  }: {
    searchQuery: string
  }): Promise<LocationAutocompleteResponse> => {
    const jwtToken = await getJwtToken()
    process.env.EXPO_PUBLIC_AWS_API_GATEWAY_URL
    const url = `${awsApiGatewayUrl}/location-autocomplete?searchQuery=${encodeURIComponent(
      searchQuery,
    )}`

    try {
      const response = await fetch(url, {
        method: 'GET', // Corrected to GET request
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })

      if (!response.ok) {
        console.log({ response })
        throw new Error(`HTTP error ${response.status}`) // Use a custom error to ensure we always throw
      }

      const data = await response.json()
      return { data } as LocationAutocompleteResponse // Explicitly cast to ensure type correctness
    } catch (error) {
      // Directly throw to ensure all paths lead to a throw or return
      console.error('Location autocomplete error:', error)
      console.log({ error })
      throw error // Rethrow the error to ensure the function exits by throwing if it can't return a valid value
    }
  },
}
