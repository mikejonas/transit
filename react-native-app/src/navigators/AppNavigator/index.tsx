// navigation/AppNavigator.js

import React, { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import MainNavigator from '../MainNavigator'
import Auth from '../../screens/Auth'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme/restyle'
import supabaseClient from '../../utils/supabaseClient'
import { Session } from '@supabase/supabase-js'

export type StackNavigatorParams = {
  Auth: undefined
  MainNavigator: undefined
}

const Stack = createStackNavigator<StackNavigatorParams>() // provide the type to your createStackNavigator

const handleSignOut = async () => {
  const { error } = await supabaseClient.auth.signOut()
  if (error) {
    console.log(error)
  }
}

const AppNavigator = () => {
  const theme = useTheme<Theme>()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      const session = await supabaseClient.auth.getSession()

      setSession(session.data.session)
      setLoading(false)
    }
    fetchSession()

    const { data: subscription } = supabaseClient.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
      },
    )

    return () => {
      subscription.subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return null
  }

  const initialRouteName = session ? 'MainNavigator' : 'Auth'

  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen
        name="Auth"
        component={Auth}
        options={{
          headerShown: false, // This will hide the header
          cardStyle: { backgroundColor: theme.colors.background },
        }}
      />
      <Stack.Screen
        name="MainNavigator"
        component={MainNavigator}
        options={{
          headerShown: false, // This will hide the header
        }}
      />
    </Stack.Navigator>
  )
}

export default AppNavigator
