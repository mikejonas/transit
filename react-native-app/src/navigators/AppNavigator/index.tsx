import React, { useEffect, useState } from 'react'
import { StatusBar, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack'
import { useTheme } from '@shopify/restyle'
import { Session } from '@supabase/supabase-js'
import MainNavigator from 'navigators/MainNavigator'
import { requests } from 'requests'
import Auth from 'navigators/AuthNavigator'
import InitialLoadingScreen from 'screens/InitialLoading'
import TransitDetails from 'screens/TransitDetails'
import UserDetails from 'screens/UserDetails'
import { Theme } from 'theme/restyle'

export type StackNavigatorParams = {
  Auth: undefined
  Loading: undefined
  MainNavigator: undefined
  UserDetails: { userId?: string }
  TransitHoroscope: { conversationId?: number }
}
export type AppNavigationProps = StackNavigationProp<StackNavigatorParams, 'MainNavigator'>

const Stack = createStackNavigator<StackNavigatorParams>()

const AppNavigator = () => {
  const navigation = useNavigation<AppNavigationProps>()
  const theme = useTheme<Theme>()
  const [userSession, setUserSession] = useState<Session | null>(null)
  const [isLoadingUserData, setIsLoadingUserData] = useState(true)
  const [hasUserDetails, setHasUserDetails] = useState(false)

  const getUserDetails = async () => {
    const { data } = await requests.generated.getUserDetails()
    setHasUserDetails(!!data)
    setIsLoadingUserData(false)
  }

  useEffect(() => {
    const { data: subscription } = requests.auth.onAuthStateChange(async (_event, session) => {
      setIsLoadingUserData(true)
      setUserSession(session)

      if (session) {
        getUserDetails()
      } else {
        setIsLoadingUserData(false)
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
      return hasUserDetails ? 'MainNavigator' : 'UserDetails'
    }
  }

  useEffect(() => {
    if (!isLoadingUserData) {
      navigation.reset({
        index: 0,
        routes: [{ name: getRouteName() }],
      })
    }
  }, [userSession, isLoadingUserData, hasUserDetails, navigation])

  const INITIAL_ROUTE_NAME = 'Loading'

  return (
    <View testID="AppNavigator" style={{ flex: 1 }}>
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
        <Stack.Screen
          name="TransitHoroscope"
          component={TransitDetails}
          initialParams={{ conversationId: 0 }}
          options={{
            headerTitle: 'transit',
            headerBackTitle: ' ', // This will remove the label next to the back button
            animationEnabled: true, // Enable animation for this screen
            headerStyle: {
              backgroundColor: theme.colors.background,
              borderBottomWidth: 0,
              shadowOpacity: 0, // Remove shadow for iOS
              elevation: 0, // Remove shadow for Android
            },
            headerTitleStyle: {
              color: 'white',
            },
            headerTintColor: 'white',
          }}
        />
      </Stack.Navigator>
    </View>
  )
}

export default AppNavigator
