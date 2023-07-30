// navigation/AppNavigator.js

import React, { useEffect, useState } from 'react'
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack'
import MainNavigator from '@navigators/MainNavigator'
import InitialLoadingScreen from '@screens/InitialLoading'
import Auth from '@screens/Auth'
import { useTheme } from '@shopify/restyle'
import { Theme } from '@theme/restyle'
import supabaseClient from '@utils/supabaseClient'
import { Session } from '@supabase/supabase-js'

export type StackNavigatorParams = {
  Auth: undefined
  Loading: undefined
  MainNavigator: undefined
}

const Stack = createStackNavigator<StackNavigatorParams>() // provide the type to your createStackNavigator

import { useNavigation } from '@react-navigation/native'
type AppNavigationProp = StackNavigationProp<StackNavigatorParams, 'MainNavigator'>
const AppNavigator = () => {
  const navigation = useNavigation<AppNavigationProp>()
  const theme = useTheme<Theme>()
  const [session, setSession] = useState<Session | null>(null)
  const [isSessionInitialized, setIsSessionInitialized] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      const session = await supabaseClient.auth.getSession()
      setSession(session.data.session)
      setIsSessionInitialized(false)
    }
    const { data: subscription } = supabaseClient.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
      },
    )

    fetchSession()

    return () => {
      subscription.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!isSessionInitialized) {
      navigation.reset({
        index: 0,
        routes: [{ name: session ? 'MainNavigator' : 'Auth' }],
      })
    }
  }, [session, isSessionInitialized, navigation])

  const initialRouteName = 'Loading'

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ animationEnabled: false }}>
      <Stack.Screen
        name="Loading"
        component={InitialLoadingScreen}
        options={{ headerShown: false }}
      />
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
