import React, { useEffect, useState } from 'react'
import { StatusBar } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack'
import { useTheme } from '@shopify/restyle'
import { Session } from '@supabase/supabase-js'
import MainNavigator from 'navigators/MainNavigator'
import Auth from 'screens/Auth'
import InitialLoadingScreen from 'screens/InitialLoading'
import { Theme } from 'theme/restyle'
import supabaseClient from 'utils/supabaseClient'

export type StackNavigatorParams = {
  Auth: undefined
  Loading: undefined
  MainNavigator: undefined
}

const Stack = createStackNavigator<StackNavigatorParams>() // provide the type to your createStackNavigator

type AppNavigationProp = StackNavigationProp<StackNavigatorParams, 'MainNavigator'>
const AppNavigator = () => {
  const navigation = useNavigation<AppNavigationProp>()
  const theme = useTheme<Theme>()
  const [sessionObject, setSessionObject] = useState<Session | null>(null)
  const [isSessionInitialized, setIsSessionInitialized] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      const session = await supabaseClient.auth.getSession()
      setSessionObject(session.data.session)
      setIsSessionInitialized(false)
    }
    const { data: subscription } = supabaseClient.auth.onAuthStateChange(
      async (_event, session) => {
        setSessionObject(session)
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
        routes: [{ name: sessionObject ? 'MainNavigator' : 'Auth' }],
      })
    }
  }, [sessionObject, isSessionInitialized, navigation])

  const initialRouteName = 'Loading'

  return (
    <>
      <StatusBar barStyle="light-content" />
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
    </>
  )
}

export default AppNavigator
