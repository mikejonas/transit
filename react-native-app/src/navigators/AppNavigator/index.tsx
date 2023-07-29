// navigation/AppNavigator.js

import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import MainNavigator from '../MainNavigator'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme/restyle'

export type StackNavigatorParams = {
  MainNavigator: undefined
}

const Stack = createStackNavigator<StackNavigatorParams>() // provide the type to your createStackNavigator

const Navigation = () => {
  const theme = useTheme<Theme>()

  return (
    <Stack.Navigator initialRouteName="MainNavigator">
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

export default Navigation
