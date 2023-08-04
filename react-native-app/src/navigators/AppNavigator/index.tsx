import React, { useEffect, useState } from 'react'
import { StatusBar } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack'
import { useTheme } from '@shopify/restyle'
import { Session } from '@supabase/supabase-js'
import MainNavigator from 'navigators/MainNavigator'
import { requests } from 'requests'
import Auth from 'screens/Auth'
import InitialLoadingScreen from 'screens/InitialLoading'
import UserDetails from 'screens/UserDetails'
import { Theme } from 'theme/restyle'

export type StackNavigatorParams = {
  Auth: undefined
  Loading: undefined
  MainNavigator: undefined
  UserDetails: { userId?: string }
}

const Stack = createStackNavigator<StackNavigatorParams>() // provide the type to your createStackNavigator

type AppNavigationProp = StackNavigationProp<StackNavigatorParams, 'MainNavigator'>
const AppNavigator = () => {
  const navigation = useNavigation<AppNavigationProp>()
  const theme = useTheme<Theme>()
  const [userSession, setUserSession] = useState<Session | null>(null)
  const [isDataInitialized, setIsDataInitialized] = useState(false)
  const [hasUserDetails, setHasUserDetails] = useState(false)

  const getUserDetails = async () => {
    const { data } = await requests.generated.getUserDetails()
    setHasUserDetails(!!data)
    setIsDataInitialized(true) // todo rename
  }

  useEffect(() => {
    const { data: subscription } = requests.auth.onAuthStateChange(async (_event, session) => {
      setIsDataInitialized(false) // todo rename

      setUserSession(session)
      if (session) {
        getUserDetails()
      } else {
        setIsDataInitialized(true) // todo rename
      }
    })

    return () => {
      subscription.subscription.unsubscribe()
    }
  }, [])

  const getRouteName = () => {
    if (!userSession) {
      return 'Auth'
    } else {
      return hasUserDetails ? 'MainNavigator' : 'UserDetails' //todo change to user details
    }
  }

  useEffect(() => {
    if (isDataInitialized) {
      navigation.reset({
        index: 0,
        routes: [{ name: getRouteName() }],
      })
    }
  }, [userSession, isDataInitialized, hasUserDetails, navigation])

  const initialRouteName = 'Loading'

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          animationEnabled: false,
          cardStyle: { backgroundColor: theme.colors.background },
        }}>
        <Stack.Screen
          name="Loading"
          component={InitialLoadingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MainNavigator"
          component={MainNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="UserDetails"
          component={UserDetails}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </>
  )
}

export default AppNavigator
