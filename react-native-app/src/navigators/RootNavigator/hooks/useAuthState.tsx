import { useState, useEffect, useCallback } from 'react'
import { Session } from '@supabase/supabase-js'
import { requests } from 'requests'

export const useAuthState = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasUserDetails, setHasUserDetails] = useState(false)
  const [userSession, setUserSession] = useState<Session | null>(null)

  const getUserDetails = async (): Promise<void> => {
    try {
      const response = await requests.generated.getUserDetails()
      setHasUserDetails(!!response.data)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Error fetching user details:', error)
      setHasUserDetails(false)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const initializeAuth = useCallback(() => {
    setIsLoading(true)
    const { data: subscription } = requests.auth.onAuthStateChange((event, session) => {
      setUserSession(session)
      const isSignedIn = !!session
      if (isSignedIn) {
        getUserDetails().finally(() => setIsLoading(false))
      } else {
        setIsAuthenticated(false)
        setHasUserDetails(false)
        setIsLoading(false)
      }
    })

    // Cleanup function
    return () => {
      if (subscription?.subscription?.unsubscribe) {
        subscription.subscription.unsubscribe()
      }
    }
  }, [])

  // Optionally, trigger auth initialization on hook mount if needed
  useEffect(() => {
    const unsubscribe = initializeAuth()

    // Return a cleanup function that can be run synchronously
    return () => {
      unsubscribe()
    }
  }, [initializeAuth])
  return {
    isLoading,
    isAuthenticated,
    hasUserDetails,
    initializeAuth,
  }
}
