import React from 'react'
import { Button, StatusBar, View } from 'react-native'
import { NavigationContainer, RouteProp } from '@react-navigation/native'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'
import AuthScreen from 'screens/Auth'
import CreateAccountUserDetails from 'screens/UserDetails'

import SignUpWithEmailScreen from 'screens/Auth/SignUpWithEmailScreen'
import { useTheme } from '@shopify/restyle'
import { Theme } from 'theme/restyle'

type AuthStackParamList = {
  SignInMain: undefined
  SignUpWithEmail: undefined
  CreateAccountUserDetails: undefined
}

export type AuthNavigationProps = StackNavigationProp<AuthStackParamList, 'SignInMain'>
export type AuthRouteProps = RouteProp<AuthStackParamList, 'SignInMain'>

const AuthStack = createStackNavigator<AuthStackParamList>()

const AuthNavigator = () => {
  const theme = useTheme<Theme>()

  return (
    <>
      <AuthStack.Navigator
        screenOptions={{
          cardStyle: { backgroundColor: theme.colors.background },
        }}>
        <AuthStack.Screen
          name="SignInMain"
          component={AuthScreen}
          options={{
            headerShown: false,
          }}
        />
        <AuthStack.Screen
          name="SignUpWithEmail"
          component={SignUpWithEmailScreen}
          options={{
            headerTitle: '',
            headerBackTitle: 'Back', // This will remove the label next to the back button
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
      </AuthStack.Navigator>
    </>
  )
}

const App: React.FC = () => <AuthNavigator />

export default App
