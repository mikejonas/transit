import { authRequests } from './auth'
import { edgeFunctionRequests } from './edgeFunctions'
import { generatedRequests } from './generated'

export const requests = {
  // Functions for making authentication requests to Supabase.
  auth: authRequests,
  // Requests from the supabases auto generated api
  generated: generatedRequests,
  // Edge functions we created
  edgeFunctions: edgeFunctionRequests,
}
