import { AuthChangeEvent, AuthError, Session } from '@supabase/supabase-js'
import supabaseClient from 'utils/supabaseClient'

interface EmailParams {
  email: string
  password: string
}

const handleSupabaseAuthError = async (message: string, error: AuthError) => {
  const constructedError = new Error(`${message}: ${error.message}`)
  console.error(constructedError)
  throw constructedError
}

/**
 * Functions for making authentication requests to Supabase.
 */
export const authRequests = {
  signOut: async () => {
    const response = await supabaseClient.auth.signOut()
    if (response.error) handleSupabaseAuthError('Error signing out:', response.error)

    return response
  },
  signUp: async ({ email, password }: EmailParams) => {
    const response = await supabaseClient.auth.signUp({ email, password })
    if (response.error) handleSupabaseAuthError('Error signing up:', response.error)

    return response
  },
  signInWithPassword: async ({ email, password }: EmailParams) => {
    const response = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })
    if (response.error) handleSupabaseAuthError('Error signing in:', response.error)

    return response
  },
  onAuthStateChange: (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
    return supabaseClient.auth.onAuthStateChange(callback)
  },
}
