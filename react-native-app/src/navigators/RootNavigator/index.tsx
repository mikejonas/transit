import React, { useEffect, useRef } from 'react'
import { StatusBar, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack'
import { useTheme } from '@shopify/restyle'
import MainAppDrawerNavigator from 'navigators/MainAppDrawerNavigator'
import InitialLoadingScreen from 'screens/InitialLoading'
import AuthNavigator from 'navigators/AuthNavigator'
import UserDetails from 'screens/UserDetails'
import { Theme } from 'theme/restyle'
import { useAuthState } from './hooks/useAuthState' // Update the path according to your project structure

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
  const { isLoading, isAuthenticated, hasUserDetails } = useAuthState()

  const getInitialRouteName = () => {
    if (isLoading) return 'Loading'
    if (!isAuthenticated) return 'AuthNavigator'
    return hasUserDetails ? 'MainAppDrawerNavigator' : 'UserDetails'
  }

  const initialRouteName = getInitialRouteName()

  // Effect to navigate based on auth state changes
  useEffect(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: initialRouteName }],
    })
  }, [initialRouteName, navigation])

  return (
    <View style={{ flex: 1 }}>
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
          name="AuthNavigator"
          component={AuthNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainAppDrawerNavigator"
          component={MainAppDrawerNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="UserDetails" component={UserDetails} options={{ headerShown: false }} />
      </Stack.Navigator>
    </View>
  )
}

export default RootNavigator
