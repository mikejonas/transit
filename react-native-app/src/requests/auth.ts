import supabaseClient from 'utils/supabaseClient'

interface EmailParams {
  email: string
  password: string
}

/**
 * Functions for making authentication requests to Supabase.
 */
export const authRequests = {
  signOut: async () => {
    const response = await supabaseClient.auth.signOut()
    if (response.error) console.error('Error signing out:', response.error.message)

    return response
  },
  signUp: async ({ email, password }: EmailParams) => {
    const response = await supabaseClient.auth.signUp({ email, password })
    if (response.error) console.error('Error signing up:', response.error.message)

    return response
  },
  signInWithPassword: async ({ email, password }: EmailParams) => {
    const response = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })
    if (response.error) console.error('Error signing in:', response.error.message)

    return response
  },
  getSession: async () => {
    const response = await supabaseClient.auth.getSession()
    if (response.error) console.error('Error getting session:', response.error.message)

    return response
  },
  onAuthStateChange: (callback: (event: any, session: any) => void) => {
    return supabaseClient.auth.onAuthStateChange(callback)
  },
}
