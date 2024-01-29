import React, { useEffect, useRef, useState } from 'react'
import { StatusBar, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack'
import { useTheme } from '@shopify/restyle'
import { Session } from '@supabase/supabase-js'
import MainAppDrawerNavigator from 'navigators/MainAppDrawerNavigator'
import InitialLoadingScreen from 'screens/InitialLoading'
import { requests } from 'requests'
import AuthNavigator from 'navigators/AuthNavigator'
import UserDetails from 'screens/UserDetails'
import { Theme } from 'theme/restyle'

export type StackNavigatorParams = {
  AuthNavigator: undefined
  Loading: undefined
  MainAppDrawerNavigator: undefined
  UserDetails: { userId?: string }
}
export type RootNavigationProps = StackNavigationProp<
  StackNavigatorParams,
  'MainAppDrawerNavigator'
>

const Stack = createStackNavigator<StackNavigatorParams>()

const RootNavigator = () => {
  const navigation = useNavigation<RootNavigationProps>()
  const theme = useTheme<Theme>()

  const currentRouteNameRef = useRef<string | null>(null)
  const [userSession, setUserSession] = useState<Session | null>(null)
  const [isLoadingUserDetails, setIsLoadingUserDetails] = useState(true)
  const [hasUserDetails, setHasUserDetails] = useState(false)

  const getUserDetails = async (): Promise<void> => {
    setIsLoadingUserDetails(true)
    try {
      const response = await requests.generated.getUserDetails()
      setHasUserDetails(!!response.data)
    } catch (error) {
      setHasUserDetails(false)
    }
  }

  useEffect(() => {
    const { data: subscription } = requests.auth.onAuthStateChange(async (event, session) => {
      const isSignedIn = !!session
      if (event === 'INITIAL_SESSION') {
        if (isSignedIn) await getUserDetails()
        setIsLoadingUserDetails(false)
      } else if (event === 'SIGNED_IN') {
        await getUserDetails()
        setIsLoadingUserDetails(false)
      } else if (event === 'SIGNED_OUT') {
        setUserSession(session)
        setHasUserDetails(false)
      }
      setUserSession(session)
    })

    return () => {
      // Ensure correct and safe unsubscription
      if (subscription?.subscription?.unsubscribe) {
        subscription.subscription.unsubscribe()
      }
    }
  }, [])

  const getRouteName = () => {
    if (!userSession /* not signed in*/) {
      return 'AuthNavigator'
    } else {
      return hasUserDetails ? 'MainAppDrawerNavigator' : 'UserDetails'
    }
  }

  useEffect(() => {
    if (!isLoadingUserDetails) {
      const newRouteName = getRouteName()

      if (currentRouteNameRef.current !== newRouteName) {
        navigation.reset({
          index: 0,
          routes: [{ name: newRouteName }],
        })

        currentRouteNameRef.current = newRouteName
      }
    }
  }, [userSession, isLoadingUserDetails, hasUserDetails, navigation])

  const INITIAL_ROUTE_NAME = 'Loading'

  return (
    <View testID="RootNavigator" style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator
        initialRouteName={INITIAL_ROUTE_NAME}
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
          name="AuthNavigator"
          component={AuthNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MainAppDrawerNavigator"
          component={MainAppDrawerNavigator}
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
    </View>
  )
}

export default RootNavigator
